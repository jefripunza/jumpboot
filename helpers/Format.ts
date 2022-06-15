export const Format = {
  Bytes: (bytes: number, decimals = 2) => {
    const fix_bytes = bytes;
    const fix_decimals = decimals;
    if (fix_bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = fix_decimals < 0 ? 0 : fix_decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(fix_bytes) / Math.log(k));
    return `${parseFloat((fix_bytes / Math.pow(k, i)).toFixed(dm))} ${
      sizes[i]
    }`;
  },
  WhatsApp: {
    NumberFormat: (value: string, standard = "@c.us") => {
      let formatted = value;
      // const standard = '@c.us'; // @s.whatsapp.net / @c.us
      // !isGroup ? process...
      if (!String(formatted).endsWith("@g.us")) {
        // 1. Menghilangkan karakter selain angka
        formatted = String(value).replace(/\D/g, "");
        // 2. Menghilangkan angka 62 di depan (prefix)
        //    Kemudian diganti dengan 0
        if (formatted.startsWith("0")) {
          formatted = `62${formatted.substr(1)}`;
        }
        // 3. Tambahkan standar pengiriman whatsapp
        if (!String(formatted).endsWith(standard)) {
          formatted = formatted + standard;
        }
      }
      return formatted;
    },
  },
};
