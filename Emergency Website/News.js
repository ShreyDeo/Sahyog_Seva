const newsContainer = document.getElementById('news-container');
const showLoader = () => {
    const loader = document.createElement('div');
    loader.className = 'loader';
    newsContainer.appendChild(loader);
    
   
    newsContainer.classList.add('loading');
};

const hideLoader = () => {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.remove();
        
       
        newsContainer.classList.remove('loading');
    }
};
showLoader();
fetch('https://newsapi.org/v2/everything?q=natural%20disaster&sortBy=popularity&apiKey=c2e768b3e75b4aa2a0405e7faace49dd')
    .then(response => response.json())
    .then(data => {
        hideLoader();

        if (data.status === 'ok') {
            const articles = data.articles;
            const newsContainer = document.getElementById('news-container');
            const itemsPerPage = 6;
            let currentPage = 1;

            const displayArticles = (page) => {
                const startIndex = (page - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                const displayedArticles = articles.slice(startIndex, endIndex);

                newsContainer.innerHTML = "";

                for (const article of displayedArticles) {
                    const newsBox = createNewsBox(article);
                    newsContainer.appendChild(newsBox);
                }
            };

            const createNewsBox = (article) => {
                const newsBox = document.createElement('div');
                newsBox.className = 'news-box';

                const newsImg = document.createElement('div');
                newsImg.className = 'news-img';
                newsImg.innerHTML = `<img alt="news" src="${article.urlToImage}" style="width: 100%; height: 150px;">`;

                const newsText = document.createElement('div');
                newsText.className = 'news-text';
                newsText.innerHTML = `
                    <span>${new Date(article.publishedAt).toLocaleDateString()} / ${article.source.name}</span>
                    <a href="${article.url}" target="_blank" class="news-title">${article.title}</a>
                    <p>${article.description}</p>
                    <a href="${article.url}" target="_blank">Read More</a>
                `;

                newsBox.appendChild(newsImg);
                newsBox.appendChild(newsText);

                return newsBox;
            };

            const updatePagination = () => {
                const totalPages = Math.ceil(articles.length / itemsPerPage);
                const paginationContainer = document.getElementById('pagination-container') || createPaginationContainer();

                paginationContainer.innerHTML = "";

                for (let i = 1; i <= totalPages; i++) {
                    const pageButton = createPageButton(i);
                    paginationContainer.appendChild(pageButton);
                }
            };

            const createPaginationContainer = () => {
                const newPaginationContainer = document.createElement('div');
                newPaginationContainer.id = 'pagination-container';
                newPaginationContainer.className = 'pagination';
                newsContainer.parentNode.insertBefore(newPaginationContainer, newsContainer.nextSibling);
                return newPaginationContainer;
            };

            const createPageButton = (pageNumber) => {
                const pageButton = document.createElement('button');
                pageButton.textContent = pageNumber;
                pageButton.addEventListener('click', () => {
                    currentPage = pageNumber;
                    displayArticles(currentPage);
                    updatePagination();
                });
                return pageButton;
            };

            displayArticles(currentPage);
            updatePagination();
        } else {
            console.error('Failed to fetch news headlines:', data.message);
        }
    })
    .catch(error => {
        hideLoader();
        console.error('Error fetching news headlines:', error.message);
    });
