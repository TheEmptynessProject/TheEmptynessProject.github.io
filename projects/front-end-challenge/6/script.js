const uploadZone = document.getElementById('uploadZone');
        const fileInput = document.getElementById('fileInput');
        const fileList = document.getElementById('fileList');
        const maxFileSize = 10 * 1024 * 1024;
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadZone.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadZone.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadZone.addEventListener(eventName, unhighlight, false);
        });

        function highlight(e) {
            uploadZone.classList.add('drag-over');
        }

        function unhighlight(e) {
            uploadZone.classList.remove('drag-over');
        }

        uploadZone.addEventListener('drop', handleDrop, false);
        fileInput.addEventListener('change', handleFiles, false);

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFiles({ target: { files } });
        }

        function handleFiles(e) {
            const files = [...e.target.files];
            files.forEach(validateAndUploadFile);
        }

        function validateAndUploadFile(file) {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            
            const fileInfo = document.createElement('div');
            fileInfo.className = 'file-info';
            
            if (!allowedTypes.includes(file.type)) {
                showError(fileInfo, 'Invalid file type. Please upload supported formats only.');
                fileItem.appendChild(fileInfo);
                fileList.insertBefore(fileItem, fileList.firstChild);
                return;
            }
            
            if (file.size > maxFileSize) {
                showError(fileInfo, 'File too large. Maximum size is 10MB.');
                fileItem.appendChild(fileInfo);
                fileList.insertBefore(fileItem, fileList.firstChild);
                return;
            }

            if (file.type.startsWith('image/')) {
                const preview = document.createElement('img');
                preview.className = 'file-preview';
                const reader = new FileReader();
                reader.onload = e => preview.src = e.target.result;
                reader.readAsDataURL(file);
                fileItem.appendChild(preview);
            } else {
                const preview = document.createElement('div');
                preview.className = 'file-preview';
                preview.innerHTML = '📄';
                fileItem.appendChild(preview);
            }

            const fileName = document.createElement('p');
            fileName.className = 'file-name';
            fileName.textContent = file.name;
            
            const fileSize = document.createElement('p');
            fileSize.className = 'file-size';
            fileSize.textContent = formatFileSize(file.size);
            
            const uploadSpeed = document.createElement('p');
            uploadSpeed.className = 'upload-speed';
            
            fileInfo.appendChild(fileName);
            fileInfo.appendChild(fileSize);
            fileInfo.appendChild(uploadSpeed);

            const progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';
            const progressBarFill = document.createElement('div');
            progressBarFill.className = 'progress-bar-fill';
            progressBar.appendChild(progressBarFill);
            fileInfo.appendChild(progressBar);

            fileItem.appendChild(fileInfo);
            fileList.insertBefore(fileItem, fileList.firstChild);

            uploadFileWithProgress(file, progressBarFill, uploadSpeed, fileInfo);
        }

        function uploadFileWithProgress(file, progressBar, speedElement, fileInfo) {
            const xhr = new XMLHttpRequest();
            let startTime = Date.now();
            let lastLoaded = 0;

            const reader = new FileReader();
            
            reader.onprogress = function(e) {
                if (e.lengthComputable) {
                    const progress = (e.loaded / e.total) * 100;
                    progressBar.style.width = `${progress}%`;
                    
                    const currentTime = Date.now();
                    const timeElapsed = (currentTime - startTime) / 1000;
                    const loadedSinceLastTime = e.loaded - lastLoaded;
                    const speed = loadedSinceLastTime / timeElapsed;
                    
                    speedElement.textContent = `Upload speed: ${formatFileSize(speed)}/s`;
                    
                    startTime = currentTime;
                    lastLoaded = e.loaded;
                }
            };

            reader.onload = function() {
                const success = document.createElement('p');
                success.className = 'success-message';
                success.textContent = 'Upload complete!';
                fileInfo.appendChild(success);
                progressBar.style.width = '100%';
            };

            reader.onerror = function() {
                showError(fileInfo, 'Error during upload. Please try again.');
            };

            reader.readAsArrayBuffer(file);
        }

        function showError(fileInfo, message) {
            const error = document.createElement('p');
            error.className = 'error-message';
            error.textContent = message;
            fileInfo.appendChild(error);
        }

        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }
