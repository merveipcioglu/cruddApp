const fs = require("fs");
const moment = require("moment");
const axios = require("axios");
const Jimp = require("jimp");

const trainDataCount = 10000;
const splitSize = 20;

async function getImageData(url) {
  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
    });
    return response.data;
  } catch (error) {
    console.error("Resim verisi alınamadı:", error);
    throw error;
  }
}

function randomInt(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function savePhoto(buffer, name) {
  // Genişlik ve yükseklik değerleri
  return new Promise((resolve, reject) => {
    Jimp.read(buffer)
      .then((image) => {
        image.write(name, (err) => {
          // if(err) reject(err);
          resolve();
        });
      })
      .catch((err) => {
        // console.log("kayıt edilmedi");
        resolve();
      })
      .finally(() => {
        resolve();
      });
  });
}

async function getPicture(name) {
  return new Promise(async (resolve, reject) => {
    try {
      const year =
        randomInt(1970, 2020) + "/" + randomInt(1, 12) + "/" + randomInt(1, 31);
      const hour = randomInt(0, 23) + ":" + randomInt(0, 59);

      const verilenTarih = `${year} ${hour}`;

      const tarihMs = await moment(verilenTarih, "YYYY/MM/DD HH:mm").valueOf();

      const x = 62168472000000; // 1970 yılının ms'i
      let result = (tarihMs + x - 32875200000) * 10000;

      const redirectUrl = `https://cdn.ihumandesign.com/RaveChartGenerator.php?Time=${result}`;

      //   console.log(redirectUrl);

      const buff = await getImageData(redirectUrl);
      await savePhoto(buff, name);

      resolve();
    } catch (error) {
      console.error("Resim dosyası yüklenirken hata oluştu:", error);
      reject();
    }
  });
}

async function bulkImageCreate(count = 0, step = 0) {
  let images = [];
  const files = fs.readdirSync("./assets/train_images/");

  const existList = files.map((r) => Number(r.split(".")[0]));
  const loopSize=count ? count : splitSize;

  for (let index = 0; index < loopSize; index++) {
    if (step>0) {
      const findState = existList.findIndex((r) => r == index + step);
      if (findState == -1 || existList.length == 0)
        images.push(
          getPicture("./assets/train_images/" + (index + step) + ".png")
      );
    } else {
      const findState = existList.findIndex((r) => r == index);
      if (findState == -1 || existList.length == 0)
        images.push(getPicture("./assets/train_images/" + index + ".png"));
    }
  }

  await Promise.all(images);

  const diffrent = splitSize - files.length;

  if (diffrent != 0) {
    await bulkImageCreate(splitSize,step);
  } else {
    createTag();
  }
}

const files = fs.readdirSync("./assets/train_images/");
const text = fs.readdirSync("./assets/train_text/");

files.forEach((item) => {
  fs.rmSync("./assets/train_images/" + item);
});
text.forEach((item) => {
  fs.rmSync("./assets/train_text/" + item);
});

async function main() {
  for (let index = 0; index < trainDataCount; index++) {
    if (index % splitSize == 0) {
      console.log(splitSize,index)
      await bulkImageCreate(splitSize, index);
    }
  }
}

setTimeout(() => {
  main();
}, 5000);

// function createTag() {
//   const files = fs.readdirSync("./assets/train_images/");

//   const cordinates = [
//     [0, 0.487373, 0.453064, 0.004099, 0.015307],
//     [1, 0.488741, 0.609611, 0.004113, 0.017336],
//     [2, 0.488336, 0.828627, 0.004402, 0.01291],
//     [3, 0.501981, 0.164344, 0.004759, 0.00877],
//     [4, 0.475199, 0.715717, 0.005089, 0.0125],
//     [5, 0.59978, 0.741004, 0.006162, 0.005082],
//     [6, 0.474023, 0.468617, 0.004113, 0.017848],
//     [7, 0.488583, 0.436773, 0.003631, 0.016701],
//     [8, 0.501403, 0.827295, 0.003851, 0.011885],
//     [9, 0.434326, 0.530574, 0.0089, 0.008156],
//     [10, 0.502084, 0.270461, 0.003425, 0.012193],
//     [11, 0.52553, 0.405451, 0.003054, 0.010738],
//     [12, 0.501919, 0.467848, 0.003755, 0.017336],
//     [13, 0.48879, 0.716803, 0.005365, 0.011066],
//     [14, 0.474532, 0.59124, 0.005131, 0.014283],
//     [15, 0.451589, 0.36665, 0.003232, 0.01416],
//     [16, 0.47412, 0.268473, 0.00381, 0.01248],
//     [17, 0.318514, 0.792162, 0.005942, 0.009201],
//     [18, 0.526878, 0.885676, 0.005777, 0.008402],
//     [19, 0.452056, 0.408012, 0.00381, 0.009631],
//     [20, 0.554292, 0.555615, 0.004512, 0.009918],
//     [21, 0.642758, 0.682807, 0.004553, 0.009344],
//     [22, 0.48848, 0.321178, 0.005516, 0.013873],
//     [23, 0.488006, 0.164764, 0.004952, 0.011332],
//     [24, 0.524512, 0.559887, 0.003769, 0.010717],
//     [25, 0.516032, 0.62167, 0.006891, 0.007439],
//     [26, 0.451816, 0.788463, 0.00564, 0.008402],
//     [27, 0.331582, 0.780297, 0.005942, 0.007439],
//     [28, 0.502091, 0.717152, 0.004952, 0.008811],
//     [29, 0.660034, 0.792756, 0.004828, 0.006619],
//     [30, 0.475543, 0.433094, 0.004759, 0.013893],
//     [31, 0.344773, 0.769139, 0.005227, 0.007787],
//     [32, 0.501376, 0.435287, 0.004787, 0.014262],
//     [33, 0.451376, 0.747643, 0.00564, 0.01168],
//     [34, 0.665007, 0.661342, 0.005144, 0.008914],
//     [36, 0.620481, 0.700205, 0.005832, 0.00918],
//     [37, 0.452311, 0.912254, 0.003989, 0.008197],
//     [38, 0.526052, 0.912828, 0.004127, 0.006557],
//     [39, 0.573906, 0.627152, 0.005695, 0.007787],
//     [40, 0.525557, 0.938176, 0.005144, 0.011066],
//     [41, 0.474931, 0.82876, 0.004278, 0.009775],
//     [42, 0.500447, 0.290703, 0.005762, 0.012532],
//     [43, 0.361052, 0.703463, 0.008322, 0.006721],
//     [44, 0.519615, 0.433217, 0.004622, 0.00959],
//     [45, 0.502242, 0.590318, 0.004512, 0.009201],
//     [46, 0.484431, 0.162478, 0.003573, 0.010325],
//     [47, 0.31447, 0.665748, 0.004512, 0.009201],
//     [48, 0.635062, 0.767572, 0.004567, 0.008914],
//     [49, 0.375908, 0.740994, 0.005708, 0.007439],
//     [50, 0.534333, 0.584303, 0.004044, 0.00709],
//     [51, 0.502311, 0.853617, 0.00542, 0.011045],
//     [52, 0.475069, 0.851916, 0.005131, 0.010184],
//     [53, 0.454388, 0.887818, 0.00542, 0.009775],
//     [54, 0.649746, 0.779467, 0.004856, 0.011475],
//     [55, 0.502448, 0.322295, 0.002641, 0.010328],
//     [56, 0.335385, 0.680789, 0.004993, 0.010266],
//     [57, 0.452393, 0.938391, 0.003136, 0.008914],
//     [58, 0.526699, 0.788607, 0.005144, 0.006803],
//     [59, 0.487476, 0.85, 0.006561, 0.011475],
//     [60, 0.500053, 0.145866, 0.004974, 0.010823],
//     [61, 0.474883, 0.321803, 0.003631, 0.012787],
//     [62, 0.519352, 0.147468, 0.003783, 0.01303],
//     [63, 0.484729, 0.146981, 0.005779, 0.010584],
//     [35, 0.526795, 0.364221, 0.003466, 0.012541],
//   ];
//   const formattedCoordinates = cordinates.map((coord) =>
//     coord.join(", ").replace(/,/g, " ")
//   );

//   for (let index = 0; index < files.length; index++) {
//     // görseli çekmemiz gerekiyor -tamam

//     const chunkSize = 16;
//     for (let i = 0; i < formattedCoordinates.length; i += chunkSize) {
//       const chank = formattedCoordinates.slice(i, i + chunkSize);
//       const step = i / 16 + 1;

//       files.forEach((file) => {
//         const imageSplit = file.split(".");
//         const originalFile = "./assets/train_images/" + file;
//         const imageFile =
//           "./assets/train_images/" +
//           imageSplit[0] +
//           "-" +
//           step +
//           "." +
//           imageSplit[1];
        
//         fs.copyFile(originalFile, imageFile, function (err) {
//           if (err) throw err;

//           const fileName =
//             "./assets/train_text/" + file.split(".")[0] + "-" + step + ".txt";
//           fs.open(fileName, "w", function (err, file) {
//             fs.writeFile(fileName, chank.join("\n"), function (err) {
//               if (err) throw err;
//             });
//           });
//         });
//       });
//     }

//     files.forEach((file) => {
//       const originalFile = "./assets/train_images/" + file;
//       fs.rm(originalFile, (err) => {
//         if (err) throw err;
//       });
//     });
//   }
// }



async function createTag() {
  try {
    const files = fs.readdirSync('./assets/train_images/');

    const cordinates = [
    [0, 0.487373, 0.453064, 0.004099, 0.015307],
    [1, 0.488741, 0.609611, 0.004113, 0.017336],
    [2, 0.488336, 0.828627, 0.004402, 0.01291],
    [3, 0.501981, 0.164344, 0.004759, 0.00877],
    [4, 0.475199, 0.715717, 0.005089, 0.0125],
    [5, 0.59978, 0.741004, 0.006162, 0.005082],
    [6, 0.474023, 0.468617, 0.004113, 0.017848],
    [7, 0.488583, 0.436773, 0.003631, 0.016701],
    [8, 0.501403, 0.827295, 0.003851, 0.011885],
    [9, 0.434326, 0.530574, 0.0089, 0.008156],
    [10, 0.502084, 0.270461, 0.003425, 0.012193],
    [11, 0.52553, 0.405451, 0.003054, 0.010738],
    [12, 0.501919, 0.467848, 0.003755, 0.017336],
    [13, 0.48879, 0.716803, 0.005365, 0.011066],
    [14, 0.474532, 0.59124, 0.005131, 0.014283],
    [15, 0.451589, 0.36665, 0.003232, 0.01416],
    [16, 0.47412, 0.268473, 0.00381, 0.01248],
    [17, 0.318514, 0.792162, 0.005942, 0.009201],
    [18, 0.526878, 0.885676, 0.005777, 0.008402],
    [19, 0.452056, 0.408012, 0.00381, 0.009631],
    [20, 0.554292, 0.555615, 0.004512, 0.009918],
    [21, 0.642758, 0.682807, 0.004553, 0.009344],
    [22, 0.48848, 0.321178, 0.005516, 0.013873],
    [23, 0.488006, 0.164764, 0.004952, 0.011332],
    [24, 0.524512, 0.559887, 0.003769, 0.010717],
    [25, 0.516032, 0.62167, 0.006891, 0.007439],
    [26, 0.451816, 0.788463, 0.00564, 0.008402],
    [27, 0.331582, 0.780297, 0.005942, 0.007439],
    [28, 0.502091, 0.717152, 0.004952, 0.008811],
    [29, 0.660034, 0.792756, 0.004828, 0.006619],
    [30, 0.475543, 0.433094, 0.004759, 0.013893],
    [31, 0.344773, 0.769139, 0.005227, 0.007787],
    [32, 0.501376, 0.435287, 0.004787, 0.014262],
    [33, 0.451376, 0.747643, 0.00564, 0.01168],
    [34, 0.665007, 0.661342, 0.005144, 0.008914],
    [36, 0.620481, 0.700205, 0.005832, 0.00918],
    [37, 0.452311, 0.912254, 0.003989, 0.008197],
    [38, 0.526052, 0.912828, 0.004127, 0.006557],
    [39, 0.573906, 0.627152, 0.005695, 0.007787],
    [40, 0.525557, 0.938176, 0.005144, 0.011066],
    [41, 0.474931, 0.82876, 0.004278, 0.009775],
    [42, 0.500447, 0.290703, 0.005762, 0.012532],
    [43, 0.361052, 0.703463, 0.008322, 0.006721],
    [44, 0.519615, 0.433217, 0.004622, 0.00959],
    [45, 0.502242, 0.590318, 0.004512, 0.009201],
    [46, 0.484431, 0.162478, 0.003573, 0.010325],
    [47, 0.31447, 0.665748, 0.004512, 0.009201],
    [48, 0.635062, 0.767572, 0.004567, 0.008914],
    [49, 0.375908, 0.740994, 0.005708, 0.007439],
    [50, 0.534333, 0.584303, 0.004044, 0.00709],
    [51, 0.502311, 0.853617, 0.00542, 0.011045],
    [52, 0.475069, 0.851916, 0.005131, 0.010184],
    [53, 0.454388, 0.887818, 0.00542, 0.009775],
    [54, 0.649746, 0.779467, 0.004856, 0.011475],
    [55, 0.502448, 0.322295, 0.002641, 0.010328],
    [56, 0.335385, 0.680789, 0.004993, 0.010266],
    [57, 0.452393, 0.938391, 0.003136, 0.008914],
    [58, 0.526699, 0.788607, 0.005144, 0.006803],
    [59, 0.487476, 0.85, 0.006561, 0.011475],
    [60, 0.500053, 0.145866, 0.004974, 0.010823],
    [61, 0.474883, 0.321803, 0.003631, 0.012787],
    [62, 0.519352, 0.147468, 0.003783, 0.01303],
    [63, 0.484729, 0.146981, 0.005779, 0.010584],
    [35, 0.526795, 0.364221, 0.003466, 0.012541],
  ];

    const formattedCoordinates = cordinates.map((coord) =>
      coord.join(', ').replace(/,/g, ' ')
    );

    const chunkSize = 16;

    for (let index = 0; index < files.length; index++) {
      for (let i = 0; i < formattedCoordinates.length; i += chunkSize) {
        const chank = formattedCoordinates.slice(i, i + chunkSize);
        const step = i / 16 + 1;

        for (const file of files) {
          const imageSplit = file.split('.');
          const originalFile = './assets/train_images/' + file;
          const imageFile =
            './assets/train_images/' +
            imageSplit[0] +
            '-' +
            step +
            '.' +
            imageSplit[1];

          await copyFileAsync(originalFile, imageFile);
          const fileName =
            './assets/train_text/' + file.split('.')[0] + '-' + step + '.txt';
          await writeFileAsync(fileName, chank.join('\n'));
        }
      }

      for (const file of files) {
        const originalFile = './assets/train_images/' + file;
        await unlinkFileAsync(originalFile);
      }
    }

    console.log('İşlem tamamlandı.');
  } catch (err) {
    console.error('Hata oluştu:', err);
  }
}

function copyFileAsync(source, destination) {
  return new Promise((resolve, reject) => {
    fs.copyFile(source, destination, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// Asenkron dosya yazma işlemi için yardımcı fonksiyon
function writeFileAsync(file, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// Asenkron dosya silme işlemi için yardımcı fonksiyon
function unlinkFileAsync(file) {
  return new Promise((resolve, reject) => {
    fs.unlink(file, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}
