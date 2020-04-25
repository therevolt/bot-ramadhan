//          HI!
//PERGUNAKAN DENGAN BIJAK
// SEMOGA BERMANFAAT YA!
//  -Rama Seftiansyah-

const { Client } = require("whatsapp-web.js");
const fs = require("fs");
const qrcode = require("qrcode-terminal");
const fetch = require("node-fetch");
const cheerio = require("cheerio");
const SESSION_FILE_PATH = "./session.json";
const delay = require("delay");
let date = new Date();
let millisecond = date.getMilliseconds();
let detik = date.getSeconds();
let menit = date.getMinutes();
let jam = date.getHours();
//Ganti Bagian link_sumber dibawah dengan link kota kalian
let link_sumber =
  "https://www.detik.com/ramadan/jadwal-imsak/banten/kab-pandeglang";
//-----------------------------------------------------
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionCfg = require(SESSION_FILE_PATH);
}

const client = new Client({
  puppeteer: {
    headless: true,
  },
  session: sessionCfg,
});

client.initialize();

client.on("qr", (qr) => {
  let scan = qrcode.generate(qr, {
    small: true,
  });
  console.log("SCAN!", scan);
});

client.on("authenticated", (session) => {
  console.log(
    `[${jam}:${menit}:${detik}:${millisecond}] BERHASIL LOGIN SOB!\n---------------------------------`
  );
  sessionCfg = session;
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
    if (err) {
      console.error(err);
    }
  });
});

client.on("auth_failure", (msg) => {
  console.error("AUTHENTICATION FAILURE", msg);
});

client.on("ready", () => {
  console.log(
    `[${jam}:${menit}:${detik}:${millisecond}] BOT SUDAH SIAP DIGUNAKAN SOB!\n---------------------------------`
  );
});

client.on("message", async (msg) => {
  //perintah !imsak bisa diganti apapun yang kalian mau
  if (msg.body == "!imsak") {
    fetch(link_sumber)
      .then((res) => res.text())
      .then((rest) => {
        const $ = cheerio.load(rest);
        let day = $(
          "#scheduleTable > table > tbody > tr.selected > td:nth-child(1)"
        ).text();
        let kota = $("#scheduleTable > div > div > div > div > div > select")
          .val()
          .split("/");
        kota = kota[1].replace("-", " ");
        kota = kota.toUpperCase();
        let imsak = $(
          "#scheduleTable > table > tbody > tr.selected > td:nth-child(2)"
        ).text();
        let subuh = $(
          "#scheduleTable > table > tbody > tr.selected > td:nth-child(3)"
        ).text();
        let dzuhur = $(
          "#scheduleTable > table > tbody > tr.selected > td:nth-child(4)"
        ).text();
        let ashar = $(
          "#scheduleTable > table > tbody > tr.selected > td:nth-child(5)"
        ).text();
        let maghrib = $(
          "#scheduleTable > table > tbody > tr.selected > td:nth-child(6)"
        ).text();
        let isya = $(
          "#scheduleTable > table > tbody > tr.selected > td:nth-child(7)"
        ).text();
        console.log(msg.from + " > Meminta Jadwal Imsak");
        //dibawah ini adalah reply pesan setelah mendapat perintah !imsak
        msg.reply(
          `*🌕JADWAL IMSAKIYAH🌕*\n*🌆KAB/KOTA ${kota}*\nHari Ke : _${day}_\n\n_Imsak_ : ${imsak}\n_Subuh_ : ${subuh}\n_Dzuhur_ : ${dzuhur}\n_Ashar_ : ${ashar}\n_Maghrib_ : ${maghrib}\n_Isya_ : ${isya}\n\n*Sumber :* https://www.detik.com/ramadan/jadwal-imsak`
        );
      });
  } else if (msg.body.startsWith("!spam ")) {
    //gunakan fitur spam ini sebaik mungkin
    let nomor = msg.body.split(" ")[1];
    let jmlh = msg.body.split(" ")[2];
    let panjang_pesan = Object.keys(msg.body.split(" ")).length;
    let pesan = "";
    for (let i = 3; i < panjang_pesan; i++) {
      pesan += msg.body.split(" ")[i] + " ";
    }
    nomor = nomor.includes("@c.us") ? nomor : `${nomor}@c.us`;
    if (jmlh >= 500) {
      msg.reply("DOSA SOB SPAM BANYAK BANYAK!");
    } else {
      if (jmlh >= 50 && jmlh <= 500) {
        if (pesan == "") {
          for (let i = 1; i < jmlh; i++) {
            client.sendMessage(nomor, "P");
            await delay(1500);
          }
          client.sendMessage(
            nomor,
            `[${jam}:${menit}:${detik}:${millisecond}][BOT] Spam Request by https://wa.me/${
              msg.from.split("@c.us")[0]
            }`
          );
          msg.reply(
            `*[SUKSES]* ${jmlh} Pesan ke ${
              nomor.split("@c.us")[0]
            } (Dengan Memberitahu Bahwa Anda Pengirimnya!)`
          );
          console.log(
            `*[${jam}:${menit}:${detik}:${millisecond}][SUKSES]* Mengirim ${jmlh} Pesan ke ${nomor} (Dari ${msg.from})`
          );
        } else {
          for (let i = 0; i < jmlh; i++) {
            client.sendMessage(nomor, pesan);
            await delay(1500);
          }
          client.sendMessage(
            nomor,
            `[${jam}:${menit}:${detik}:${millisecond}][BOT] Spam Request by https://wa.me/${
              msg.from.split("@c.us")[0]
            }`
          );
          msg.reply(
            `*[SUKSES]* ${jmlh} Pesan ke ${
              nomor.split("@c.us")[0]
            } (Dengan Memberitahu Bahwa Anda Pengirimnya!)`
          );
          console.log(
            `[${jam}:${menit}:${detik}:${millisecond}][SUKSES] Mengirim ${jmlh} Pesan ke ${nomor} (Dari ${msg.from})`
          );
        }
      } else {
        if (pesan == "") {
          for (let i = 1; i < jmlh; i++) {
            client.sendMessage(nomor, "P");
            await delay(1500);
          }
          msg.reply(
            `*[SUKSES]* ${jmlh} Pesan ke ${
              nomor.split("@c.us")[0]
            } (Tanpa Memberitahu Bahwa Anda Pengirimnya!)`
          );
          console.log(
            `[${jam}:${menit}:${detik}:${millisecond}][SUKSES] Mengirim ${jmlh} Pesan ke ${nomor} (Dari ${msg.from})`
          );
        } else {
          for (let i = 0; i < jmlh; i++) {
            client.sendMessage(nomor, pesan);
            await delay(1500);
          }
          msg.reply(
            `*[SUKSES]* ${jmlh} Pesan ke ${
              nomor.split("@c.us")[0]
            } (Tanpa Memberitahu Bahwa Anda Pengirimnya!)`
          );
          console.log(
            `[${jam}:${menit}:${detik}:${millisecond}][SUKSES] Mengirim ${jmlh} Pesan ke ${nomor} (Dari ${msg.from})`
          );
        }
      }
    }
  }
});

client.on("change_battery", (batteryInfo) => {
  const { battery, plugged } = batteryInfo;
  console.log(`Battery: ${battery}% - Charging? ${plugged}`);
});

client.on("disconnected", (reason) => {
  console.log("Client was logged out", reason);
});
