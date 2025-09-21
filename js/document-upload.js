// Document Upload JavaScript - Matching Design
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const filePreview = document.getElementById('file-preview');
    const fileName = document.getElementById('file-name');
    const fileSize = document.getElementById('file-size');
    const progressFill = document.getElementById('progress-fill');
    const removeFileBtn = document.getElementById('remove-file');
    
    // Category elements
    const categorySection = document.getElementById('category-section');
    const categoryBtn = document.getElementById('category-btn');
    const categoryMenu = document.getElementById('category-menu');
    const categoryText = document.getElementById('category-text');
    const categoryItems = document.querySelectorAll('.category-item');
    
    // Tag elements
    const categoryTag = document.getElementById('category-tag');
    const tagText = document.getElementById('tag-text');
    const tagClose = document.getElementById('tag-close');
    
    // Button elements
    const submitBtn = document.getElementById('submit-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    
    // Modal elements
    const modalOverlay = document.getElementById('modal-overlay');
    const addAnotherBtn = document.getElementById('add-another');
    const understoodBtn = document.getElementById('understood');

    // State
    let currentFile = null;
    let selectedCategory = null;

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
        if (file.type !== 'application/pdf') {
            alert('Seuls les fichiers PDF sont acceptés.');
            return;
        }

        currentFile = file;
        fileName.textContent = file.name;
        fileSize.textContent = formatFileSize(file.size);
        
        // Show file preview
        filePreview.style.display = 'block';
        
        // Simulate upload
        simulateUpload();
        
        // Show category selection
        setTimeout(() => {
            categorySection.style.display = 'block';
        }, 1000);
    }

    function simulateUpload() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
            }
            progressFill.style.width = progress + '%';
        }, 100);
    }

    // Category dropdown
    categoryBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        categoryMenu.classList.toggle('show');
    });

    // Category selection
    categoryItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const categoryName = item.textContent;
            const categoryValue = item.getAttribute('data-value');
            
            selectCategory(categoryName, categoryValue);
        });
    });

    function selectCategory(name, value) {
        selectedCategory = value;
        
        // Hide dropdown and category section
        categoryMenu.classList.remove('show');
        categorySection.style.display = 'none';
        
        // Show selected tag
        tagText.textContent = name;
        categoryTag.style.display = 'inline-flex';
        
        // Enable submit button
        updateSubmitButton();
    }

    // Tag close
    tagClose?.addEventListener('click', () => {
        selectedCategory = null;
        categoryTag.style.display = 'none';
        categorySection.style.display = 'block';
        updateSubmitButton();
    });

    // Remove file
    removeFileBtn?.addEventListener('click', () => {
        resetForm();
    });

    // Submit button
    submitBtn?.addEventListener('click', () => {
        if (currentFile && selectedCategory) {
            showSuccessModal();
        }
    });

    // Cancel button
    cancelBtn?.addEventListener('click', () => {
        if (confirm('Voulez-vous vraiment annuler ? Les modifications seront perdues.')) {
            resetForm();
            // Redirect or close
            window.history.back();
        }
    });

    // Modal handlers
    addAnotherBtn?.addEventListener('click', () => {
        hideModal();
        resetForm();
    });

    understoodBtn?.addEventListener('click', () => {
        hideModal();
        // Redirect back to checker dashboard
        window.location.href = 'checker.html';
    });

    // Update submit button state
    function updateSubmitButton() {
        submitBtn.disabled = !(currentFile && selectedCategory);
    }

    // Show success modal
    function showSuccessModal() {
        modalOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    // Hide modal
    function hideModal() {
        modalOverlay.classList.remove('show');
        document.body.style.overflow = '';
    }

    // Reset form
    function resetForm() {
        currentFile = null;
        selectedCategory = null;
        
        filePreview.style.display = 'none';
        categorySection.style.display = 'none';
        categoryTag.style.display = 'none';
        categoryMenu.classList.remove('show');
        
        fileInput.value = '';
        progressFill.style.width = '0%';
        
        updateSubmitButton();
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        categoryMenu?.classList.remove('show');
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

    // Initialize
    updateSubmitButton();
});