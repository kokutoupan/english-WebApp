export class mondai {
  #chapterData;
  #dataSize = 0;
  #count = 0;

  #isAns = false;

  #workDiv;
  #isShuffle;

  #mTotal;

  #mNum;
  #mQuestion;
  #mChoices;
  #nextButton;
  #ansDiv;

  #vSeitou;

  #ansCorect;
  #ansJP;
  #collect=0;
  #miss=0;

  constructor(mondaiDiv) {
    this.#workDiv = mondaiDiv;

    let viewStatas = document.createElement('div');
    
    let total = document.createElement("span");
    let tmp = document.createElement('span');
    let seitou = document.createElement('span');
    tmp.textContent = ' : '
    seitou.textContent = '0/0 ';

    total.textContent = "0/0";
    viewStatas.appendChild(total);
    viewStatas.appendChild(tmp);
    viewStatas.appendChild(seitou);
    this.#vSeitou = seitou;

    let num = document.createElement("p");
    num.textContent = "問題";
    let question = document.createElement("p");
    question.textContent = "問題文";
    let choice = document.createElement("form");
    choice.name = 'choice';
    let nextButton = document.createElement("button");
    nextButton.textContent = "next";
    nextButton.addEventListener("click", () => {
      this.next();
    });
    let backButton = document.createElement("button");
    backButton.textContent = "back";
    backButton.addEventListener("click", () => {
      this.back();
    });
    //nextButton.onclick = this.viewAns;

    this.#workDiv.appendChild(viewStatas);
    this.#workDiv.appendChild(num);
    this.#workDiv.appendChild(question);
    this.#workDiv.appendChild(choice);

    let ansDiv = document.createElement("div");
    let correct = document.createElement("p");
    let japanese = document.createElement("p");

    ansDiv.appendChild(correct);
    ansDiv.appendChild(japanese);

    this.#workDiv.appendChild(backButton);
    this.#workDiv.appendChild(nextButton);

    this.#workDiv.appendChild(ansDiv);

    this.#mTotal = total;
    this.#mNum = num;
    this.#mQuestion = question;
    this.#mChoices = choice;

    this.#ansDiv = ansDiv;
    this.#ansCorect = correct;
    this.#ansJP = japanese;

    document.addEventListener("keydown", this.keyDownEvent, false); // 第一引数にkeydownを記述
  }
  setChapterData(data, isShuffle) {
    this.#isShuffle = isShuffle;
    if (isShuffle) this.#chapterData = this.shuffleArray(data);
    else this.#chapterData = data;
    this.#dataSize = this.#chapterData.length;
    this.#count = 0;
    this.#ansDiv.hidden = true;

    this.#collect = 0;
    this.#miss = 0;
  }
  viewMondai() {
    this.#mTotal.textContent =' 進捗: ' +  (this.#count + 1) + " / " + this.#dataSize;
    this.#vSeitou.textContent = '正答率:' + (this.#collect) + ' / ' + this.#miss;
    this.#mNum.textContent = this.#chapterData[this.#count]["No"];
    this.#mQuestion.innerHTML = this.#chapterData[this.#count]["Question"];

    while (this.#mChoices.lastChild) {
      this.#mChoices.removeChild(this.#mChoices.lastChild);
    }
    let sentakusi = this.#chapterData[this.#count]["Choice"];

    if (this.#isShuffle) sentakusi = this.shuffleArray(sentakusi);

    sentakusi.forEach((data, index) => {
      let elm = document.createElement("input");
      let wrap = document.createElement("div");
      let lable = document.createElement("label");
      elm.type = "radio";
      elm.name = "choice";
      elm.value = data;
      elm.id = "choise:" + index;
      lable.textContent = data;
      lable.htmlFor = elm.id;

      wrap.appendChild(elm);
      wrap.appendChild(lable);
      this.#mChoices.appendChild(wrap);
      // this.#mChoices.appendChild(elm);
      // this.#mChoices.appendChild(lable);
      // this.#mChoices.innerText +='aaa';
    });
  }

  next() {
    if (this.#isAns === true) {
      if (this.#count < this.#dataSize) {
        this.#isAns = false;
        this.#ansDiv.hidden = true;
        this.viewMondai();
      } else {
        toggleContents();
      }
    } else {
      this.#isAns = true;
      this.viewAns();
    }
  }

  viewAns() {
    this.#ansDiv.hidden = false;
    this.#ansCorect.textContent =
      "Anser: " + this.#chapterData[this.#count]["Anser"];
    if(this.#mChoices.choice.value == this.#chapterData[this.#count]["Anser"]){
      this.#ansCorect.style.color = '#000000';
      this.#collect++;
    }
    else{
      this.#miss++;
      this.#ansCorect.style.color = '#ff0000';
    }

    this.#ansJP.innerHTML = this.#chapterData[this.#count]["Japanese"];
    this.#count++;
  }

  shuffleArray(array) {
    const copyArray = [...array];

    const result = copyArray.reduce((_, cur, idx) => {
      let rand = Math.floor(Math.random() * (idx + 1));
      copyArray[idx] = copyArray[rand];
      copyArray[rand] = cur;
      return copyArray;
    });

    return result;
  }

  back() {
    if (this.#count >= 1) {
      this.#count--;
      this.viewMondai();
    }
  }

  keyDownEvent(event) {
    if (event.code === "KeyA") return;
  }
}
