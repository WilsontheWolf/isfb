//-eval
let keys = client.saves.keyArray();
let num = ["1", "2", "3", "4", "5"];
keys.forEach(k => {
  let save = client.saves.get(k);
  num.forEach(n => {
    let s = save.saves[n];
    if (!s.version) return;
    client.saves.set(
      k,
      {
        save: s.save,
        fileName: s.fileName,
        image: s.image,
        version: s.version,
        public: s.public || false,
        format: 2,
        comment: ""
      },
      `saves.${n}`
    );
  });
});
