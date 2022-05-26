import css from './css/wikidot.css';
import sigma from './css/sigma-9.css';
import init from './css/init.css';
import fs from 'vite-plugin-fs/browser';
import YAML from 'yaml'
import ftmlWorker from './ftml.web.worker.js?bundled-worker&dataurl';

let ftml = new Worker(ftmlWorker, {
  type: 'module',
});

type Message = {
  actionarea: {
    title: string
    titleinput: string
    message: Array<string>
    save: string
    advancedsettings: string
    advancedsettingstitle: string
  }
}


document.querySelector("head > style#innercss")!.innerHTML = css;
document.querySelector("head > style#sigma")!.innerHTML = sigma;
document.querySelector("head > style#init")!.innerHTML = init;

// Workerスレッドから受信
ftml.onmessage = (event: MessageEvent) => {
  const { html, styles, type } = event.data;
  const pageStyles = document.getElementById('page-styles')!;
  const pageContent = document.getElementById('page-content')!;
  const sideContent = document.getElementById('side-bar')!;
  const topContent = document.getElementById('top-bar')!;
  if (type == 'page') {
    pageContent.innerHTML = html.replace("\<wj-body class=\"wj-body\"\>", "").replace("\<\/wj-body\>", "");
  } else if (type == 'side') {
    sideContent.innerHTML = html.replace("\<wj-body class=\"wj-body\"\>", "").replace("\<\/wj-body\>", "");
  } else if (type == 'top') {
    topContent.innerHTML = html.replace("\<wj-body class=\"wj-body\"\>", "").replace("\<\/wj-body\>", "");
  } else {
    pageContent.innerHTML = html.replace("\<wj-body class=\"wj-body\"\>", "").replace("\<\/wj-body\>", "");
  }
  if (styles.length > 0) {
    pageStyles.innerHTML = styles.map((v: string) => `<style>\n${v.replace(/\\</g, '&lt;')}\n</style>`).join("\n\n");
  }
};

const editpageField: HTMLInputElement = <HTMLInputElement>document.getElementById('edit-page-textarea')!;
const edittitleField: HTMLInputElement = <HTMLInputElement>document.getElementById('edit-page-title')!;
const editsideField: HTMLInputElement = <HTMLInputElement>document.getElementById('edit-side-textarea')!;
const editsaveButton = document.getElementById('actionarea-save')!;

editpageField.addEventListener('input', (event) => {
  const { target } = event;
  if (!(target instanceof HTMLTextAreaElement)) {
    return;
  }
  const value = target.value;
  const type = "page"
  const FtmlStorageItem = { title: edittitleField.value, page: editpageField.value, side: editsideField.value };
  localStorage.setItem("FtmlStorage", JSON.stringify(FtmlStorageItem));
  ftml.postMessage({ value: value, type: type });
});

editsideField.addEventListener('input', (event) => {
  const { target } = event;
  if (!(target instanceof HTMLTextAreaElement)) {
    return;
  }
  const value = target.value;
  const type = "side"
  const FtmlStorageItem = { title: edittitleField.value, page: editpageField.value, side: editsideField.value };
  localStorage.setItem("FtmlStorage", JSON.stringify(FtmlStorageItem));
  ftml.postMessage({ value: value, type: type });
});

edittitleField.addEventListener('input', (event) => {
  const { target } = event;
  if (!(target instanceof HTMLInputElement)) {
    return;
  }
  const value = target.value;
  document.querySelector("#page-title")!.innerHTML = value;
  const FtmlStorageItem = { title: edittitleField.value, page: editpageField.value, side: editsideField.value };
  localStorage.setItem("FtmlStorage", JSON.stringify(FtmlStorageItem));
});

editsaveButton.addEventListener('click', async () => {
  const opts = {
    suggestedName: edittitleField.value ? edittitleField.value : 'underfined',
    types: [{
      description: 'Foundation Text Markup Language',
      accept: { 'text/plain': ['.ftml'] },
    }],
  };
  try {
    const handle = await window.showSaveFilePicker(opts);
    const writable = await handle.createWritable();
    await writable.write(editpageField.value);
    await writable.close();
  } catch (err) {
    console.log(err)
  }
})


document.addEventListener('DOMContentLoaded', () => {
  async function loadFtml() {
    const dir = await fs.readdir('./locales/');
    console.log(dir);
    const sideftml = await fs.readFile('./locales/ja/side.ftml');
    const topftml = await fs.readFile('./locales/ja/top.ftml');
    const messagescongig = await fs.readFile('./locales/ja/messages.yaml');
    const messages = YAML.parse(messagescongig);
    for (const key in messages.actionarea) {
      let messagevalue = messages.actionarea[key];
      if (Array.isArray(messagevalue)) {
        // array to <ul> <li> message
        const message = messagevalue.map((v: string) => `<li>${v}</li>`).join("");
        document.querySelector(`#actionarea-${key}`)!.innerHTML = message;
      }
      else {
        document.querySelector(`#actionarea-${key}`)!.innerHTML = messagevalue;
      }
    }
    
    ftml.postMessage({ value: sideftml, type: "side" });
    ftml.postMessage({ value: topftml, type: "top" });
  }
  loadFtml();

  const FtmlStorageItem = localStorage.getItem("FtmlStorage");
  if (FtmlStorageItem) {
    const FtmlStorage = JSON.parse(FtmlStorageItem);
    edittitleField.value = FtmlStorage.title;
    editpageField.value = FtmlStorage.page;
    editsideField.value = FtmlStorage.side;
    if (FtmlStorage.page) {
      const type = "page"
      ftml.postMessage({ value: FtmlStorage.page, type: type });
    }
    if (FtmlStorage.side) {
      const type = "side"
      ftml.postMessage({ value: FtmlStorage.side, type: type });
    }
    if (FtmlStorage.title) {
      document.querySelector("#page-title")!.innerHTML = FtmlStorage.title;
    }
  }
  const FtmlStrageItem = localStorage.getItem("FtmlStrage");
  if (FtmlStrageItem) {
    localStorage.removeItem("FtmlStrage");
  }
});
