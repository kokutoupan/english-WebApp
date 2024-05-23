const url = "json_data/kirihara_brightStage"; // 読み込むJSONファイル

const mondaiDiv = document.getElementById("mondai-contents");
const selectDiv = document.getElementById("select-contents");

const numOfAllData = 26;

const groupCheckd = new Array(numOfAllData).fill(false);

let isShuffle = true;

let mondai;
import("./mondai.js").then((module) => {
  mondai = new module.mondai(mondaiDiv);
});

function toggleContents() {
  mondaiDiv.hidden = !mondaiDiv.hidden;
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

window.addEventListener("load", () => {
  // グループボタンを先に作成
  let groupBtn = document.createElement("button");
  groupBtn.innerHTML = "グループ";
  groupBtn.value = "group";
  groupBtn.onclick = (e) => {
    toggleContents();
    makeMondai(groupCheckd);
  };

  selectDiv.appendChild(groupBtn);
  selectDiv.appendChild(document.createElement("br"));

  // 章ごとのボタンとチェックボックスを作成
  for (let i = 1; i <= numOfAllData; i++) {
    let check = document.createElement("input");
    check.type = "checkbox";
    check.value = i - 1;
    check.onchange = (e) => {
      groupCheckd[e.target.value] = e.target.checked;
    };

    let btn = document.createElement("button");
    btn.innerHTML = `${i}章`;
    btn.value = i;
    btn.onclick = (e) => {
      toggleContents();
      makeMondai(e.target.value);
    };

    // ラジオボタンとボタンをインラインで配置
    let container = document.createElement("div");
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.appendChild(check);
    container.appendChild(btn);

    selectDiv.appendChild(container);
  }
});
