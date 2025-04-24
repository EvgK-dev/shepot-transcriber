document.addEventListener("DOMContentLoaded", () => {
    // Утилита для создания HTML-элементов
    function createElement(tag, attributes = {}, content = null) {
        const element = document.createElement(tag);
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
        if (content !== null) {
            if (content instanceof HTMLElement) {
                element.appendChild(content);
            } else {
                element.textContent = content;
            }
        }
        return element;
    }

    // Создание шапки
    function createHeader() {
        const header = createElement("header", { class: "header" });
        const titles = [
            "mopAi - локальная версия .exe исполняемый"
        ];
        titles.forEach(text => header.appendChild(createElement("h2", null, text)));

        const notes = [
            "* программа извлекает текст из аудио и видеофайлов",
            "* доступно большинство аудио и видеоформатов: ",
            "*.mp3;*.wav;*.ogg;*.flac;*.mp4;*.avi;*.mkv;*.mts;*.mov;*.m4a;*.wma;*.webm;*.aac;*.ac3;*.opus;*.mka;*.opus;*.alac;*.amr"
        ];
        notes.forEach(note => header.appendChild(createElement("span", null, note)));

        return header;
    }

    // Загрузка файла
    function createFileUploadSection() {
        const wrapper = createElement("div");

        wrapper.appendChild(createElement("h2", { class: "section-heading" }, "ЗАГРУЗИТЕ ФАЙЛ:"));

        const upload = createElement("div", { class: "file-upload" });
        upload.appendChild(createElement("button", {
            class: "upload-button",
            onclick: "open_filedownload_window()"
        }, "загрузить"));
        upload.appendChild(createElement("span", {
            class: "file-status",
            "data-filepath": "0"
        }, "файл не выбран"));

        wrapper.appendChild(upload);
        return wrapper;
    }

    // Выбор модели
    function createModelSelector() {
        const wrapper = createElement("div");

        wrapper.appendChild(createElement("h2", { class: "section-heading" }, "ВЫБЕРИТЕ ЯЗЫКОВУЮ МОДЕЛЬ:"));

        const models = createElement("div", { class: "language-model" });

        const baseModel = createModelOption("baseModel", "base", "Базовая", true);
        const mediumModel = createModelOption("mediumModel", "medium", "Медиум");

        models.appendChild(baseModel);
        models.appendChild(mediumModel);
        models.appendChild(createElement("span", null, " *языковая модель влияет на качество и скорость обработки "));

        wrapper.appendChild(models);
        return wrapper;
    }

    function createModelOption(id, value, label, checked = false) {
        const container = createElement("div");
        container.appendChild(createElement("input", {
            type: "radio",
            id,
            name: "model",
            value,
            checked
        }));
        container.appendChild(createElement("label", {
            class: "model-label",
            for: id
        }, label));
        return container;
    }

    // Кнопка "Пуск"
    function createSubmitButton() {
        const container = createElement("div", { class: "submit-button" });
        container.appendChild(createElement("button", {
            onclick: "send_data_to_whisper()"
        }, "пуск"));
        return container;
    }

    // Блок для результата
    function createResultBlock() {
        const block = createElement("div", { class: "block_text none" });
        block.appendChild(createElement("div", { class: "example_text" }));

        const textButton = createElement("div", { class: "text-button" });

        const download = createElement("div", { class: "submit-button" });
        download.appendChild(createElement("button", { onclick: "downloadText()" }, "скачать"));

        const copy = createElement("div", { class: "submit-button" });
        copy.appendChild(createElement("button", { onclick: "copyToClipboard()" }, "копировать"));

        textButton.appendChild(download);
        textButton.appendChild(copy);
        block.appendChild(textButton);

        return block;
    }

    // Основной контент
    function createMainSection() {
        const section = createElement("section", { class: "main-section" });

        section.appendChild(createElement("div", null, createElement("img", {
            class: "logo_img",
            src: "/img/skimg.png",
            alt: ""
        })));

        const content = createElement("div");
        content.appendChild(createFileUploadSection());
        content.appendChild(createModelSelector());
        content.appendChild(createSubmitButton());
        content.appendChild(createResultBlock());

        section.appendChild(content);

        section.appendChild(createElement("div", null, createElement("img", {
            class: "logo_img",
            src: "/img/RPS.png",
            alt: ""
        })));

        return section;
    }

    // Прелоадер
    function createLoader() {
        const loader = createElement("div", { class: "loading none" });
        loader.appendChild(createElement("span", { class: "loader" }));
        return loader;
    }

    // Подвал
    function createFooter() {
        const footer = createElement("footer", { class: "footer" });
        footer.appendChild(createElement("span", null, "+375 17 000 00 00"));
        footer.appendChild(createElement("span", null, "mopAi - все права защищены"));
        return footer;
    }

    // Добавление всех элементов в DOM
    document.body.appendChild(createHeader());
    document.body.appendChild(createMainSection());
    document.body.appendChild(createLoader());
    document.body.appendChild(createFooter());
});

// ==== eel функции ====

function open_filedownload_window() {
    eel.processFile();
}

eel.expose(add_filepath_to_html);
function add_filepath_to_html(filepath, filename) {
    const fileStatus = document.querySelector(".file-status");
    if (fileStatus) {
        fileStatus.setAttribute("data-filepath", filepath);
        fileStatus.textContent = filename;
    }
}

function getSelectedModel() {
    const models = document.getElementsByName("model");
    for (let model of models) {
        if (model.checked) return model.value;
    }
}

function send_data_to_whisper() {
    const fileStatus = document.querySelector(".file-status");
    const filepath = fileStatus.getAttribute("data-filepath");

    if (filepath === "0") return;

    document.querySelector(".loading").classList.remove("none");
    document.querySelector(".example_text").innerHTML = "";

    const resultBlock = document.querySelector(".block_text");
    if (resultBlock && !resultBlock.classList.contains("none")) {
        resultBlock.classList.add("none");
    }

    const model = getSelectedModel();
    eel.start_wishper(filepath, model);
}

function copyToClipboard() {
    const text = document.querySelector(".example_text").innerText;
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    alert("Текст скопирован в буфер обмена");
}

function downloadText() {
    const text = document.querySelector(".example_text").innerText;
    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");
    link.download = "SK_SOFT_text.txt";
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

eel.expose(add_text_to_html);
function add_text_to_html(text) {
    document.querySelector(".loading").classList.add("none");
    document.querySelector(".block_text").classList.remove("none");
    document.querySelector(".example_text").appendChild(document.createTextNode(text));
}
