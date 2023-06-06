const url = "json_data/kirihara_brightStage"; // 読み込むJSONファイル

const mondaiDiv = document.getElementById("mondai-contents");
const selectDiv = document.getElementById("select-contents");

const numOfAllData = 26;

const groupCheckd = new Array(numOfAllData);
groupCheckd.forEach((d) => {
  d = false;
});

let isShuffle = true;

let mondai;
import("./mondai.js").then((module) => {
  mondai = new module.mondai(mondaiDiv);
});

function toggleContents() {
  mondaiDiv.hidden = selectDiv.hidden;
  selectDiv.hidden = !selectDiv.hidden;
}

function formatJSON(json) {
  return JSON.parse(JSON.stringify(json));
}

function makeMondai(chapter) {
  if (typeof chapter === "object") {
    let allData = [];

    const getJson = (chap) => {
      return new Promise((resolve, reject) => {
        fetch(url + ("00" + chap).slice(-2) + ".json")
          .then((response) => response.json())
          .then((data) =>
            resolve((allData = allData.concat(formatJSON(data))))
          );
      });
    };

    let getData = Promise.resolve();
    for (let i = 0; i < groupCheckd.length; ++i) {
      if (groupCheckd[i]) getData = getData.then(getJson.bind(this, i + 1));
    }

    getData
      .then(() => {
        if (allData.length === 0) {
          toggleContents();
          return;
        }
        // console.log(allData);
        mondai.setChapterData(allData, isShuffle);
      })
      .then(() => {
        if (allData.length === 0) {
          return;
        }
        mondai.viewMondai();
      });
  } else {
    fetch(url + ("00" + chapter).slice(-2) + ".json")
      .then((response) => response.json())
      .then((data) => mondai.setChapterData(formatJSON(data), isShuffle))
      .then(() => {
        mondai.viewMondai();
      });
  }
}

// 起動時の処理
window.addEventListener("load", () => {
  for (let i = 1; i <= numOfAllData; i++) {
    let btn = document.createElement("button");
    let check = document.createElement("input");
    check.type = "checkbox";
    check.value = i - 1;
    check.onchange = (e) => {
      //console.log(e);
      groupCheckd[e.target.value] = e.target.checked;
    };
    selectDiv.appendChild(check);

    // ボタンのテキストを設定
    btn.innerHTML = i + "章";
    btn.value = i;
    btn.onclick = (e) => {
      console.log(e.target.value);

      toggleContents();
      makeMondai(e.target.value);
    };

    // ボタンを追加
    selectDiv.appendChild(btn);
    selectDiv.appendChild(document.createElement("br"));
  }
  let btn = document.createElement("button");

  // ボタンのテキストを設定
  btn.innerHTML = "グループ";
  btn.value = "group";
  btn.onclick = (e) => {
    // console.log(e.target.value);

    toggleContents();
    makeMondai(groupCheckd);
  };

  // ボタンを追加
  selectDiv.appendChild(btn);
  selectDiv.appendChild(document.createElement("br"));
});
