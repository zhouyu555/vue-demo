/**
 * 分块计算文件的md5值
 * @param file 文件
 * @param chunkSize 分片大小
 * @returns Promise
 */
import SparkMD5 from "spark-md5";

function calculateFileMd5(file, chunkSize) {
    return new Promise((resolve, reject) => {
        let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
        let chunks = Math.ceil(file.size / chunkSize);
        let currentChunk = 0;
        let spark = new SparkMD5.ArrayBuffer();
        let fileReader = new FileReader();
        let time = new Date().getTime();
        fileReader.onload = function (e) {
            spark.append(e.target.result);
            currentChunk++;
            if (currentChunk < chunks) {
                console.log(`第${currentChunk}分片解析完成, 开始第${currentChunk +1} / ${chunks}分片解析`);
                loadNext();
            } else {
                let md5 = spark.end();
                console.log(`MD5计算完成：${file.name} \nMD5：${md5} \n分片：${chunks} 大小:${file.size} 用时：${new Date().getTime() - time} ms`);
                resolve(md5);
            }
        };

        fileReader.onerror = function (e) {
            console.warn(e);
            reject(e);
        };

        function loadNext() {
            let start = currentChunk * chunkSize;
            let end = start + chunkSize;
            if (end > file.size) {
                end = file.size;
            }
            fileReader.readAsArrayBuffer(blobSlice.call(file.raw, start, end));
        }

        loadNext();
    });
}

/**
 * 分块计算文件的md5值，默认分片大小为2097152（2M）
 * @param file 文件
 * @returns Promise
 */
export function calculateFileMd5ByDefaultChunkSize(file) {
    return calculateFileMd5(file, 2097152);
}

/**
 * 获取文件的后缀名
 */
// function getFileType(fileName) {
//   return fileName.substr(fileName.lastIndexOf(".") + 1).toLowerCase();
// }

// 文件选择之后就计算文件的md5值
// document.getElementById("file").addEventListener("change", function () {
//   let file = this.files[0];
//   calculateFileMd5ByDefaultChunkSize(file).then(e => {
//     // 获取到文件的md5
//     let md5 = e;
//     checkMd5(md5, file)
//   }).catch(e => {
//     // 处理异常
//     console.error(e);
//   });
// });

/**
 * 根据文件的md5值判断文件是否已经上传过了
 *
 * @param md5 文件的md5
 * @param file 准备上传的文件
 */
// export function checkMd5(md5, file) {
//   $.ajax({
//     url: baseUrl + "/minio/check",
//     type: "GET",
//     data: {
//       md5: md5
//     },
//     async: true, //异步
//     dataType: "json",
//     success: function (msg) {
//       console.log(msg);
//       // 文件已经存在了，无需上传
//       if (msg.status === 200) {
//         console.log("文件已经存在了，无需上传")
//       } else if (msg.status === 500) {
//         // 文件不存在需要上传
//         console.log("文件不存在需要上传")
//         PostFile(file, 0, md5);
//       } else {
//         console.log('未知错误');
//       }
//     }
//   })
// }
//
// /**
//  * 执行分片上传
//  * @param file 上传的文件
//  * @param i 第几分片，从0开始
//  * @param md5 文件的md5值
//  */
// function PostFile(file, i, md5) {
//   let name = file.name,                           //文件名
//     size = file.size,                           //总大小shardSize = 2 * 1024 * 1024,
//     shardSize = 5 * 1024 * 1024,                //以5MB为一个分片,每个分片的大小
//     shardCount = Math.ceil(size / shardSize);   //总片数
//   if (i >= shardCount) {
//     return;
//   }
//
//   let start = i * shardSize;
//   let end = start + shardSize;
//   let packet = file.slice(start, end);  //将文件进行切片
//   /*  构建form表单进行提交  */
//   let form = new FormData();
//   form.append("md5", md5);// 前端生成uuid作为标识符传个后台每个文件都是一个uuid防止文件串了
//   form.append("data", packet); //slice方法用于切出文件的一部分
//   form.append("name", name);
//   form.append("totalSize", size);
//   form.append("total", shardCount); //总片数
//   form.append("index", i + 1); //当前是第几片
//   $.ajax({
//     url: baseUrl + "/minio/upload",
//     type: "POST",
//     data: form,
//     //timeout:"10000",  //超时10秒
//     async: true, //异步
//     dataType: "json",
//     processData: false, //很重要，告诉jquery不要对form进行处理
//     contentType: false, //很重要，指定为false才能形成正确的Content-Type
//     success: function (msg) {
//       console.log(msg);
//       /*  表示上一块文件上传成功，继续下一次  */
//       if (msg.status === 20001) {
//         form = '';
//         i++;
//         PostFile(file, i, md5);
//       } else if (msg.status === 50000) {
//         form = '';
//         /*  失败后，每2秒继续传一次分片文件  */
//         setInterval(function () {
//           PostFile(file, i, md5)
//         }, 2000);
//       } else if (msg.status === 20002) {
//         merge(shardCount, name, md5, getFileType(file.name), file.size)
//         console.log("上传成功");
//       } else {
//         console.log('未知错误');
//       }
//     }
//   })
// }
//
// /**
//  * 合并文件
//  * @param shardCount 分片数
//  * @param fileName 文件名
//  * @param md5 文件md值
//  * @param fileType 文件类型
//  * @param fileSize 文件大小
//  */
// function merge(shardCount, fileName, md5, fileType, fileSize) {
//   $.ajax({
//     url: baseUrl + "/minio/merge",
//     type: "GET",
//     data: {
//       shardCount: shardCount,
//       fileName: fileName,
//       md5: md5,
//       fileType: fileType,
//       fileSize: fileSize
//     },
//     // timeout:"10000",  //超时10秒
//     async: true, //异步
//     dataType: "json",
//     success: function (msg) {
//       console.log(msg);
//     }
//   })
// }
