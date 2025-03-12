export default class FileUploadComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // Шаблон для компонента
    this.shadowRoot.innerHTML = `
                <style>
                    /* Подключаем шрифт Inter */
                :host {
                    font-family: 'Inter', sans-serif;
                  }
                /* Общие стили для модального окна */
                .modal {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: linear-gradient(to bottom, #5F5CF0, #DDDCFC, #FFFFFF); /* Градиент от #DDDCFC к #5F5CF0 */
                    padding: 12px;
                    border-radius: 20px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                    width: 342px;
                    height: 512px;
                    text-align: center;
                    z-index: 1000;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    opacity: 1;
                    visibility: visible;
                    transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s ease;;
                }

                /* Окно с информацией о загрузке */
                .result-modal {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: linear-gradient(to bottom, #5F5CF0, #8F8DF4); /* Градиент от #DDDCFC к #5F5CF0 */
                    padding: 20px;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                    width: 342px;
                    height: 264px;
                    text-align: center;
                    z-index: 1001;
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s ease;
                }

                /* Градиент при ошибке */
                .result-modal.error {
                    background: linear-gradient(to bottom, #F05C5C, #8F8DF4); 
                }

                /* Анимация появления окна */
                .result-modal.visible {
                    opacity: 1;
                    visibility: visible;
                    transform: translate(-50%, -50%);
                }
                .result-modal.hidden {
                    opacity: 0;
                    visibility: hidden;
                    transform: translate(-50%, -60%);
                }

                /* Анимация скрытия окна */
                .modal.hidden {
                    opacity: 0;
                    visibility: hidden;
                    transform: translate(-50%, -60%);
                }

                /* Заголовок */
                .modal-title {
                    font-size: 24px;
                    color: white;
                    margin-bottom: 10px;
                    font-weight: 600;
                }

                /* Динамическая подпись */
                .modal-subtitle {
                    font-size: 14px;
                    color: white;
                    margin-bottom: 10px;
                    font-weight: 400;
                }

                /* Крестик для закрытия */
                .close-btn {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    cursor: pointer;
                    font-size: 20px;
                    color: white;
                }

                .close-btn:hover {
                    color: #333;
                }

                /* Поле для ввода имени файла */
                .file-name-input {
                    width: 90%;
                    padding: 10px;
                    margin-bottom: 15px;
                    border: 1px solid #ccc;
                    border-radius: 12px;
                    font-size: 14px;
                    margin-left: 8px;
                    font-family: 'Inter', sans-serif;
                    color: #5F5CF0;
                }

                /* Область для добавления файла */
                .file-drop-area {
                    width: 100%;
                    height: 100%;
                    margin: 0 auto 5px;
                    border: 1px solid grey; 
                    border-radius: 30px;
                    background-image: url('https://cdn-icons-png.flaticon.com/512/3767/3767094.png'); 
                    background-size: 50%;
                    background-position: center;
                    background-repeat: no-repeat;
                    cursor: pointer;
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    text-align: center;
                    color: #5F5CF0;
                    font-size: 15px;
                    font-family: 'Inter', sans-serif;
                    background-color: rgba(255, 255, 255, 0.5); 
                }

                .file-drop-area.dragover {
                    border-color: #5F5CF0;
                    background-color: rgba(95, 92, 240, 0.1); 
                }

                /* Поле для отображения имени файла */
                .file-name-display {
                    margin-bottom: 15px;
                    color: #5F5CF0;
                    font-weight: 500;
                    font-family: 'Inter', sans-serif;
                }

                /* Кнопка загрузки */
                .upload-btn {
                    width: 100%;
                    padding: 15px;
                    background-color: #5F5CF0; 
                    color: white;
                    border: none;
                    border-radius: 30px;
                    cursor: pointer;
                    font-size: 14px;
                    font-family: 'Inter', sans-serif;
                    transition: background-color 0.3s ease;
                    margin-top: auto; /* Смещаем кнопку вниз */
                }

                .upload-btn:disabled {
                    background-color: #BBB9D2; 
                    cursor: not-allowed;
                }

                .upload-btn:hover:not(:disabled) {
                    background-color: #4a148c;
                }

                /* Полоска загрузки */
                .progress-bar {
                    width: 100%;
                    height: 10px;
                    background-color: #f1f1f1;
                    border-radius: 5px;
                    margin-bottom: 15px;
                    overflow: hidden;
                    position: relative;
                    display: none ; 
                    transition: opacity 0.3s ease, transform 0.3s ease;
                    opacity: 0;
                    transform: scaleY(0);
                }

                .progress-bar-fill {
                    height: 100%;
                    background-color: #5F5CF0;
                    width: 0%;
                    transition: width 0.3s ease; 
                }
                .progress-bar.visible {
                    display: block; 
                    opacity: 1;
                    transform: scaleY(1);
                }

                /* Анимация перехода между окнами */
                .modal {
                  transition: opacity 1.5s ease, visibility 1.5s ease;
                }

                .result-modal {
                  transition: opacity 1.5s ease, visibility 1.5s ease;
                }

                /* Окно результата */
                .result-modal .message {
                    margin-bottom: 15px;
                    font-size: 16px;
                    color: white;
                    font-family: 'Inter', sans-serif;
                }

                .result-modal .file-info {
                    text-align: left;
                    margin-top: 15px;
                    padding: 10px;
                    background-color: rgba(255, 255, 255, 0.8);
                    border-radius: 6px;
                    font-size: 14px;
                    font-family: 'Inter', sans-serif;
                }

                .result-modal .close-btn {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    cursor: pointer;
                    font-size: 20px;
                    color: white;
                    font-family: 'Inter', sans-serif;
                }

                .result-modal .close-btn:hover {
                    color: #333;
                }
            </style>

            <!-- Модальное окно загрузки -->
            <div class="modal" id="upload-modal">
                <span class="close-btn" id="close-upload-modal">×</span>
                <div class="modal-title">Загрузочное окно</div>
                <div class="modal-subtitle" id="modal-subtitle">Перед загрузкой дайте имя файлу</div>
                <input type="text" class="file-name-input" id="file-name" placeholder="Название файла">
                <div class="file-drop-area" id="file-drop-area">
                    <p>Перенесите ваш файл в область ниже</p>
                </div>
                <div class="file-name-display" id="file-name-display"></div>
                <div class="progress-bar" id="progress-bar">
                    <div class="progress-bar-fill"></div>
                </div>
                <button class="upload-btn" id="upload-btn" disabled>Загрузить</button>
            </div>

            <!-- Окно результата -->
            <div class="result-modal" id="result-modal">
                <span class="close-btn" id="close-result-modal">×</span>
                <div class="message" id="result-message"></div>
                <div class="file-info" id="file-info"></div>
            </div>
      `;

    // Элементы
    this.uploadModal = this.shadowRoot.getElementById("upload-modal");
    this.fileNameInput = this.shadowRoot.getElementById("file-name");
    this.fileDropArea = this.shadowRoot.getElementById("file-drop-area");
    this.fileNameDisplay = this.shadowRoot.getElementById("file-name-display");
    this.progressBar = this.shadowRoot.getElementById("progress-bar");
    this.progressBarFill = this.progressBar.querySelector(".progress-bar-fill");
    this.uploadBtn = this.shadowRoot.getElementById("upload-btn");
    this.resultModal = this.shadowRoot.getElementById("result-modal");
    this.resultMessage = this.shadowRoot.getElementById("result-message");
    this.fileInfo = this.shadowRoot.getElementById("file-info");
    this.modalSubtitle = this.shadowRoot.getElementById("modal-subtitle");

    // Закрытие модальных окон
    this.shadowRoot
      .getElementById("close-upload-modal")
      .addEventListener("click", () => this.closeModal());
    this.shadowRoot
      .getElementById("close-result-modal")
      .addEventListener("click", () => this.closeResultModal());

    // Обработка выбора файла
    this.fileDropArea.addEventListener("click", () => this.triggerFileInput());
    this.fileDropArea.addEventListener("dragover", (e) =>
      this.handleDragOver(e)
    );
    this.fileDropArea.addEventListener("drop", (e) => this.handleDrop(e));

    // Скрытый input для выбора файла
    this.fileInput = document.createElement("input");
    this.fileInput.type = "file";
    this.fileInput.accept = ".txt,.json,.csv";
    this.fileInput.style.display = "none";
    this.fileInput.addEventListener("change", () => this.handleFileChange());
    this.shadowRoot.appendChild(this.fileInput);

    // Обработка отправки формы
    this.uploadBtn.addEventListener("click", (e) => this.handleUpload(e));

    // Отслеживаем ввод имени файла
    this.fileNameInput.addEventListener("input", () => this.updateSubtitle());
  }

  // Обновление подписи в зависимости от действий пользователя
  updateSubtitle() {
    const hasFile = this.fileInput.files.length > 0;
    const hasName = this.fileNameInput.value.trim() !== "";

    // Активируем кнопку, если есть файл и имя
    this.uploadBtn.disabled = !(hasFile && hasName);

    // Обновляем подпись
    if (hasFile && hasName) {
      this.modalSubtitle.textContent = "Загрузите ваш файл";
    } else if (hasFile) {
      this.modalSubtitle.textContent = "Введите имя файла";
    } else if (hasName) {
      this.modalSubtitle.textContent = "Перенесите ваш файл в область ниже";
    } else {
      this.modalSubtitle.textContent = "Перед загрузкой дайте имя файлу";
    }
  }

  // Открытие файлового диалога
  triggerFileInput() {
    this.fileInput.click();
  }

  // Обработка перетаскивания файла
  handleDragOver(e) {
    e.preventDefault();
    this.fileDropArea.classList.add("dragover");
  }

  handleDrop(e) {
    e.preventDefault();
    this.fileDropArea.classList.remove("dragover");
    const file = e.dataTransfer.files[0];
    this.handleFile(file);
  }

  // Обработка выбора файла
  handleFileChange() {
    const file = this.fileInput.files[0];
    this.handleFile(file);
  }

  handleFile(file) {
    if (file) {
      this.fileNameDisplay.textContent = `Выбран файл: ${file.name}`;
      this.updateSubtitle(); // Активируем кнопку, если имя введено
    }
  }

  // Обработка отправки файла на сервер
  async handleUpload(e) {
    e.preventDefault();

    const file = this.fileInput.files[0];
    const name = this.fileNameInput.value;

    if (!file || !name) {
      this.showResult("Пожалуйста, заполните все поля.");
      return;
    }

    // Проверка размера файла
    if (file.size > 1024) {
      this.showResult("Файл слишком большой. Максимальный размер - 1 КБ.", {
        error: "Файл слишком большой. Максимальный размер - 1 КБ.",
      });
      return;
    }

    // Проверка типа файла
    const allowedTypes = ["text/plain", "application/json", "text/csv"];
    if (!allowedTypes.includes(file.type)) {
      this.showResult(
        "Недопустимый формат файла. Разрешены только .txt, .json, .csv."
      );
      return;
    }

    // Блокируем интерфейс
    this.uploadBtn.disabled = true;
    this.progressBar.setAttribute("class", "progress-bar visible");
    this.progressBarFill.style.width = "0%"; // Сбрасываем прогресс

    // Формируем FormData
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);

    // Используем XMLHttpRequest для отслеживания прогресса
    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      "https://file-upload-server-mc26.onrender.com/api/v1/upload",
      true
    );

    // Отслеживаем прогресс загрузки
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const percent = (e.loaded / e.total) * 100;
        this.progressBarFill.style.width = `${percent}%`;
      }
    });

    // Обрабатываем ответ
    xhr.onload = () => {
      if (xhr.status === 200) {
        const result = JSON.parse(xhr.responseText);
        this.showResult("Файл успешно загружен", result);
      } else {
        this.showResult("Ошибка в загрузке файла", { error: xhr.statusText });
      }
      this.uploadBtn.disabled = false;
      this.progressBar.classList.remove("visible");
    };

    // Обрабатываем ошибки
    xhr.onerror = () => {
      this.showResult("Ошибка сети или сервера", { error: "Network error" });
      this.uploadBtn.disabled = false;
      this.progressBar.classList.remove("visible");
    };

    // Отправляем запрос
    xhr.send(formData);
  }

  // Закрытие модальных окон
  closeModal() {
    this.uploadModal.classList.add("hidden");
  }

  closeResultModal() {
    // Скрываем окно результата и показываем окно выбора файла
    this.resultModal.classList.remove("visible");
    this.resultModal.classList.add("hidden");
    this.uploadModal.classList.remove("hidden");
    this.progressBar.classList.remove("visible"); // Скрываем полоску
  }

  // Отображение результата
  showResult(message, result) {
    // Скрываем окно загрузки и показываем окно результата
    this.uploadModal.classList.add("hidden");
    this.resultModal.classList.remove("hidden");
    this.resultModal.classList.add("visible");

    // Если есть ошибка, добавляем класс для стилизации окна ошибки
    if (result?.error) {
      this.resultModal.classList.add("error");
    } else {
      this.resultModal.classList.remove("error");
    }

    // Отображаем сообщение
    this.resultMessage.textContent = message;

    // Отображаем информацию о файле
    if (result) {
      if (result.error) {
        // Окно ошибки
        this.fileInfo.innerHTML = `
          <p><strong>error:</strong> ${result.error}</p>
          <p><strong>"${message}"</strong></p>
        `;
      } else {
        // Окно успешной загрузки
        this.fileInfo.innerHTML = `
          <p><strong>name:</strong> ${result.nameField || "Нет данных"}</p>
          <p><strong>filename:</strong> ${result.filename || "Нет данных"}</p>
          <p><strong>timestamp:</strong> ${result.timestamp || "Нет данных"}</p>
          <p><strong>message:</strong> ${result.message || "Нет данных"}</p>
        `;
      }
    } else {
      this.fileInfo.innerHTML = "";
    }
  }
}
