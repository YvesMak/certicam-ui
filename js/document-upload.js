// Document Upload JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const filePreview = document.getElementById('file-preview');
    const fileName = document.getElementById('file-name');
    const fileSize = document.getElementById('file-size');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const removeFileBtn = document.getElementById('remove-file');
    const submitBtn = document.getElementById('submit-btn');
    const cancelBtn = document.querySelector('.btn-cancel');
    
    // Category dropdown elements
    const categorySection = document.getElementById('category-section');
    const dropdownBtn = document.getElementById('dropdown-btn');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const dropdownText = document.querySelector('.dropdown-text');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    
    // Tag elements
    const tagSection = document.getElementById('tag-section');
    const tagText = document.getElementById('tag-text');
    const tagClose = document.getElementById('tag-close');
    
    // Modal elements
    const modalOverlay = document.getElementById('modal-overlay');
    const addAnotherBtn = document.getElementById('add-another-btn');
    const understandBtn = document.getElementById('understand-btn');

    // State variables
    let currentFile = null;
    let uploadComplete = false;
    let selectedCategory = null;

    // Initialize - disable submit button
    submitBtn.disabled = true;

    // File upload handlers
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    // File handling
    function handleFile(file) {
        currentFile = file;
        fileName.textContent = file.name;
        fileSize.textContent = formatFileSize(file.size);
        
        // Show file preview
        filePreview.classList.add('show');
        dropZone.style.display = 'none';
        
        // Show category selection with animation
        categorySection.style.display = 'block';
        setTimeout(() => {
            categorySection.classList.add('show');
        }, 10);
        
        // Start upload simulation
        simulateUpload();
    }

    function simulateUpload() {
        let progress = 0;
        const progressContainer = document.querySelector('.progress-text');
        progressContainer.innerHTML = '<span>Téléchargement en cours...</span><span class="progress-percentage">0%</span>';
        
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                uploadComplete = true;
                clearInterval(interval);
                progressContainer.innerHTML = '<span>Téléchargement terminé</span><span class="progress-percentage">100%</span>';
                updateSubmitButton();
            }
            
            progressFill.style.width = progress + '%';
            document.querySelector('.progress-percentage').textContent = Math.floor(progress) + '%';
        }, 100);
    }

    // Dropdown functionality
    dropdownBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown();
    });

    function toggleDropdown() {
        dropdownBtn.classList.toggle('active');
        dropdownMenu.classList.toggle('show');
    }

    // Dropdown item selection
    dropdownItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            selectCategory(item.textContent, item.getAttribute('data-value'));
        });
    });

    function selectCategory(categoryName, categoryValue) {
        selectedCategory = categoryValue;
        
        // Hide dropdown with animation
        dropdownBtn.classList.remove('active');
        dropdownMenu.classList.remove('show');
        categorySection.classList.remove('show');
        
        setTimeout(() => {
            categorySection.style.display = 'none';
            
            // Show selected tag with animation
            tagText.textContent = categoryName;
            tagSection.style.display = 'block';
            setTimeout(() => {
                tagSection.classList.add('show');
            }, 10);
            
            // Enable submit button if file is uploaded
            updateSubmitButton();
        }, 300);
    }

    // Tag close functionality
    tagClose?.addEventListener('click', () => {
        selectedCategory = null;
        tagSection.classList.remove('show');
        
        setTimeout(() => {
            tagSection.style.display = 'none';
            categorySection.style.display = 'block';
            setTimeout(() => {
                categorySection.classList.add('show');
            }, 10);
            updateSubmitButton();
        }, 300);
    });

    // Submit button state management
    function updateSubmitButton() {
        submitBtn.disabled = !(uploadComplete && selectedCategory);
    }

    // Submit form
    submitBtn.addEventListener('click', () => {
        if (uploadComplete && selectedCategory) {
            showSuccessModal();
        }
    });

    function showSuccessModal() {
        modalOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function hideModal() {
        modalOverlay.classList.remove('show');
        document.body.style.overflow = '';
    }

    // Modal button handlers
    addAnotherBtn?.addEventListener('click', () => {
        resetForm();
        hideModal();
    });

    understandBtn?.addEventListener('click', () => {
        hideModal();
        // Could redirect to another page or show success state
    });

    // Reset form to initial state
    function resetForm() {
        currentFile = null;
        uploadComplete = false;
        selectedCategory = null;
        
        filePreview.classList.remove('show');
        categorySection.classList.remove('show');
        tagSection.classList.remove('show');
        
        setTimeout(() => {
            categorySection.style.display = 'none';
            tagSection.style.display = 'none';
            dropZone.style.display = 'block';
            fileInput.value = '';
            
            progressFill.style.width = '0%';
            updateSubmitButton();
        }, 300);
    }

    // Remove file
    removeFileBtn.addEventListener('click', () => {
        resetForm();
    });

    // Cancel button
    cancelBtn.addEventListener('click', () => {
        resetForm();
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (dropdownBtn && !dropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownBtn.classList.remove('active');
            dropdownMenu.classList.remove('show');
        }
    });

    // Close modal when clicking overlay
    modalOverlay?.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            hideModal();
        }
    });

    // Utility functions
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }
});