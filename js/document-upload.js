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
    
    // Category area for relocation
    const categoryArea = document.querySelector('.category-area');
    
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

    // Cancel modal elements
    const cancelModalOverlay = document.getElementById('cancel-modal-overlay');
    const cancelStayBtn = document.getElementById('cancel-stay');
    const cancelConfirmBtn = document.getElementById('cancel-confirm');

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
        
        // Move category section to category area and show it
        setTimeout(() => {
            if (categoryArea && categorySection) {
                // Move the category section to the category area
                categoryArea.appendChild(categorySection);
                categorySection.style.display = 'block';
                
                // Add animation class
                categorySection.classList.add('category-moved');
                
                // Reset category selection
                categorySection.style.marginBottom = '0';
            }
        }, 1000);
        
        // Update submit button state
        updateSubmitButton();
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
        const isOpen = categoryMenu.classList.contains('open');
        
        if (isOpen) {
            categoryMenu.classList.remove('open');
            categoryBtn.classList.remove('open');
        } else {
            categoryMenu.classList.add('open');
            categoryBtn.classList.add('open');
        }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        categoryMenu.classList.remove('open');
        categoryBtn.classList.remove('open');
    });

    // Handle Escape key for modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (cancelModalOverlay.classList.contains('show')) {
                hideCancelModal();
            } else if (modalOverlay.classList.contains('show')) {
                hideModal();
            }
        }
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
        
        // Hide dropdown menu
        categoryMenu.classList.remove('open');
        categoryBtn.classList.remove('open');
        
        // Update button text
        categoryText.textContent = name;
        
        // Show selected tag
        tagText.textContent = name;
        categoryTag.style.display = 'inline-flex';
        
        // Enable submit button
        updateSubmitButton();
    }
    
    function updateSubmitButton() {
        if (currentFile && selectedCategory) {
            submitBtn.disabled = false;
            submitBtn.classList.add('ready');
        } else {
            submitBtn.disabled = true;
            submitBtn.classList.remove('ready');
        }
    }

    // Tag close
    tagClose?.addEventListener('click', () => {
        selectedCategory = null;
        categoryTag.style.display = 'none';
        
        // Reset category button text
        categoryText.textContent = 'Choisissez la catégorie du document';
        
        // Show category section again if file is present
        if (currentFile) {
            categorySection.style.display = 'block';
        }
        
        updateSubmitButton();
    });

    // Remove file
    removeFileBtn?.addEventListener('click', () => {
        resetForm();
    });
    
    function resetForm() {
        currentFile = null;
        selectedCategory = null;
        
        // Hide file preview
        filePreview.style.display = 'none';
        
        // Hide category tag
        categoryTag.style.display = 'none';
        
        // Move category section back to original position and hide it
        const originalParent = document.querySelector('.upload-section');
        const filePreviewElement = document.getElementById('file-preview');
        
        if (categorySection && originalParent && filePreviewElement) {
            originalParent.insertBefore(categorySection, filePreviewElement.nextSibling);
            categorySection.style.display = 'none';
            categorySection.classList.remove('category-moved');
            categorySection.style.marginBottom = 'var(--spacing-lg)';
        }
        
        // Reset category text
        categoryText.textContent = 'Choisissez la catégorie du document';
        
        // Reset progress bar
        progressFill.style.width = '0%';
        
        // Reset file input
        fileInput.value = '';
        
        // Update submit button
        updateSubmitButton();
    }

    // Submit button
    submitBtn?.addEventListener('click', () => {
        if (currentFile && selectedCategory) {
            showSuccessModal();
        }
    });

    // Cancel button
    cancelBtn?.addEventListener('click', () => {
        // Check if there's any data to lose
        if (currentFile || selectedCategory) {
            showCancelModal();
        } else {
            // Direct redirection if no data
            window.location.href = 'agent-dashboard.html';
        }
    });

    // Cancel modal handlers
    cancelStayBtn?.addEventListener('click', () => {
        hideCancelModal();
    });

    cancelConfirmBtn?.addEventListener('click', () => {
        hideCancelModal();
        // Redirect to agent dashboard
        window.location.href = 'agent-dashboard.html';
    });

    // Modal handlers
    addAnotherBtn?.addEventListener('click', () => {
        hideModal();
        resetForm();
    });

    understoodBtn?.addEventListener('click', () => {
        hideModal();
        // Redirect back to agent dashboard
        window.location.href = 'agent-dashboard.html';
    });

    // Cancel button
    cancelBtn?.addEventListener('click', () => {
        // Check if there's any data to lose
        if (currentFile || selectedCategory) {
            showCancelModal();
        } else {
            // Direct redirection if no data
            window.location.href = 'agent-dashboard.html';
        }
    });

    // Cancel modal handlers
    cancelStayBtn?.addEventListener('click', () => {
        hideCancelModal();
    });

    cancelConfirmBtn?.addEventListener('click', () => {
        hideCancelModal();
        // Redirect to agent dashboard
        window.location.href = 'agent-dashboard.html';
    });

    // Update submit button state
    function updateSubmitButton() {
        submitBtn.disabled = !(currentFile && selectedCategory);
    }

    // Show success modal
    function showSuccessModal() {
        // Update modal content with current file and category
        if (currentFile && selectedCategory) {
            const modalTitle = document.getElementById('modal-title');
            const modalSubtitle = document.getElementById('modal-subtitle');
            
            if (modalTitle) {
                modalTitle.textContent = currentFile.name;
            }
            
            if (modalSubtitle) {
                // Get the selected category name from the tag text
                const categoryName = tagText.textContent || 'Document';
                modalSubtitle.textContent = `${categoryName} ajouté avec succès au portefeuille !`;
            }
        }
        
        modalOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    // Hide modal
    function hideModal() {
        modalOverlay.classList.remove('show');
        document.body.style.overflow = '';
    }

    // Show cancel confirmation modal
    function showCancelModal() {
        cancelModalOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    // Hide cancel modal
    function hideCancelModal() {
        cancelModalOverlay.classList.remove('show');
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