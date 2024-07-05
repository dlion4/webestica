

class UtilityComponent {
    constructor() {
        this.randomDeveloperNames = ['Jeckonia', 'Milimo', 'Mirriam', 'Lee', 'Alvan', "Sammy"];
    }
    formatDate(isoDate, showTime = true) {
        const date = new Date(isoDate);
        let options = {}
        if (showTime) {
            // options.timeZone = 'UTC';
            // options.timeZoneName = 'short';
            // options.hour12 = false;
            // options.hourCycle = 'h12';
            // options.timeZoneOffsetMinutes = date.getTimezoneOffset();
            options.year = 'numeric';
            options.month = 'long';
            options.day = 'numeric';
            options.hour = '2-digit';
            options.minute = '2-digit';
            options.second = '2-digit';
        } else {
            options.year = 'numeric';
            options.month = 'long';
            options.day = 'numeric';
            // options.timeZoneName ='short';
            // options.hour12 = false;
            // options.hourCycle = 'h12';
            // options.timeZoneOffsetMinutes = date.getTimezoneOffset();
        }


        return date.toLocaleString('en-US', options);
    }

    randomName() {
        const randomIndex = Math.floor(Math.random() * this.randomDeveloperNames.length);
        return this.randomDeveloperNames[randomIndex];
    }

    truncateSentence(sentence, limit = 8) {
        const words = sentence.split(' ');

        if (words.length > limit) {
            return words.slice(0, limit).join(' ') + '...';
        }

        return sentence;
    }

    getYouTubeEmbedUrl(videoUrl) {
        const videoId = videoUrl.split('v=')[1];
        const ampersandPosition = videoId.indexOf('&');
        return ampersandPosition !== -1 ? videoId.substring(0, ampersandPosition) : videoId;
    }

    convertMillisecondsToTime(ms) {
        const seconds = Math.floor((ms) % 60).toString().padStart(2, '0');
        const minutes = Math.floor((ms / (60)) % 60).toString().padStart(2, '0');
        // const hours = Math.floor((ms / (1000 * 60 * 60)) % 24).toString().padStart(2, '0');

        return `${minutes}:${seconds}`;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    filterPostsByDateRange(posts, startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return posts.filter(post => {
            const postDate = new Date(post.created_at);
            return postDate >= start && postDate <= end;
        });
    }

    // Function to play timeout slide
    playTimeoutSlide(fn, timeout = 3000) {
        // Ensure fn is callable
        console.log(typeof fn)

        if (typeof fn !== 'function') {
            console.error('Provided fn is not a function');
            return;
        }

        fn(); // Initial call
        setInterval(() => { fn() }, timeout); // Repeated calls at the specified interval
    }

    videoLinks() {

        /**
         * 
         * <iframe width="1521" height="631" src="https://www.youtube.com/embed/x3pKuONCh7M" title="3 DAYS solo survival CAMPING; Catch and Cook, Fishing. Bushcraft Skills. Hammock Shelter" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
         * <iframe width="1521" height="631" src="https://www.youtube.com/embed/7Nd0vU2I5Kc" title="Meet The Strangest and Most Secretive Country In The World" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
         */
        return [
            'https://www.youtube.com/embed/tXHviS-4ygo',
            'https://www.youtube.com/embed/x3pKuONCh7M',
            'https://www.youtube.com/embed/7Nd0vU2I5Kc'
        ]
    }

    async parseUrlParam(url) {
        let pathname = new URL(url).pathname;
        let parts = pathname.split('/').filter(part => part); // Filter out empty parts
        return parts.length > 0 ? parts[parts.length - 1] : '';
    }
    capitalizeSentences(text) {
        // Split the text into sentences using a regular expression
        let sentences = text.split(/([.!?]\s*)/);

        // Capitalize the first letter of each sentence
        for (let i = 0; i < sentences.length; i++) {
            if (sentences[i].length > 0) {
                sentences[i] = sentences[i].charAt(0).toUpperCase() + sentences[i].slice(1);
            }
        }

        // Join the sentences back into a single string
        return sentences.join('');
    }

}

class MetaDataApi {
    constructor() {
        const API_VERSION = "1.0";
        this.base_url = `http://127.0.0.1:8001/api/${API_VERSION}`;
        this.updateHero = new UpdateHero();
        this.host = window.location.host;
    }

    get_auth_url() {
        return this.base_url
    }

    async serverCallRequest(data = {}, method = 'GET', endpoint = '/', additionalHeaders = {}) {

        const defaultHeaders = {
            "Content-Type": "application/json",
            // Example: "Authorization": `Bearer ${this.main.get_access_token()}`
        };

        const headers = {
            ...defaultHeaders,
            ...additionalHeaders
        };

        const pathname = `${this.get_auth_url()}${endpoint}`
        // Placeholder for server-side call
        // Replace with actual server-side call
        let response;
        if (method === 'GET') {
            response = await fetch(`${pathname}`, {
                method: method,
                headers: headers
            });
        }
        else if (method === 'POST') {
            response = await fetch(`${pathname}`, {
                method: method,
                headers: headers,
                body: JSON.stringify(data)
            });
        }
        const result = await response.json();
        // console.log(data)
        return result;
    }
}

class UpdateHero {
    constructor() {
        this.utility = new UtilityComponent();
        this.currentIndex = 0;
    }

    validateArray(items) {
        if (!items || !Array.isArray(items)) {
            console.error('Invalid :', items);
            return;
        }
    }

    updateTodayTopHighLight(posts) {

        const todayTopHighLight = document.querySelector('#top-highlight');


        // now hanlde the post
        // console.log(todayTopHighLight)
        if (!posts || !Array.isArray(posts)) {
            console.log("Not posts array could be fetched. Kindlt check your server", posts);
            return;
        }

        todayTopHighLight.innerHTML = '';

        for (let index = 0; index < 2; index++) {
            const post = posts[this.currentIndex];
            if (!post) break; // Break if there are no more posts to display


            const postItem = document.createElement('div');
            postItem.classList.add(...['col-sm-6']);
            postItem.innerHTML = `
                    <!-- Card item START -->
                    <div class="card">
                    <div class="position-relative">
                        <img class="card-img" src="/static/assets/images/blog/4by3/01.jpg" alt="${post.title}"/>
                        <div class="card-img-overlay d-flex align-items-start flex-column p-3">
                            <!-- Card overlay Top -->
                            <div class="w-100 mb-auto d-flex justify-content-end">
                                <div class="text-end ms-auto">
                                    <!-- Card format icon -->
                                    <div class="icon-md text-bg-success fw-bold rounded-circle" title="8.5 rating">
                                        ${Math.floor(Math.random() * 10)} <!-- <i class="fas fa-video"></i> -->
                                    </div>
                                </div>
                            </div>
                            <!-- Card overlay bottom -->
                            <div class="w-100 mt-auto">
                                <!-- Card category -->
                                <a href="#" class="badge text-bg-${post.template ? post.template.category.color : 'success'} mb-2">
                                    <i class="fas fa-circle me-2 small fw-bold"></i>
                                    ${post.template ? post.template.category.title : 'Uncategorized'}
                                </a>
                            </div>
                        </div>
                    </div>
    
                  <div class="card-body px-0 pt-3">
                    <h4 class="card-title">
                      <a href="/posts/${post.slug}" class="btn-link text-reset fw-bold">
                      ${this.utility.truncateSentence(post.title)}
                      </a>
                    </h4>
                    <p class="card-text">${this.utility.truncateSentence(post.summary, 30)}</p>
                    <!-- Card info -->
                    <ul class="nav nav-divider align-items-center d-none d-sm-inline-block">
                      <li class="nav-item">
                        <div class="nav-link">
                          <div class="d-flex align-items-center position-relative">
                            <div class="avatar avatar-xs">
                              <img class="avatar-img rounded-circle" src="/static/assets/images/avatar/01.jpg" alt="${post.profile ? post.profile.user.username : this.utility.randomName()}"/>
                            </div>
                            <span class="ms-3">by
                              <a href="#" class="stretched-link text-reset btn-link">${post.profile ? post.profile.user.username : this.utility.randomName()}</a>
                            </span>
                          </div>
                        </div>
                      </li>
                      <li class="nav-item">${this.utility.formatDate(post.created_at)}</li>
                      <li class="nav-item">
                        <a href="#" class="btn-link"><i class="far fa-comment-alt me-1"></i>5</a>
                      </li>
                    </ul>
                  </div>
                  </div>
                <!-- Card item END -->
                  `
            todayTopHighLight.appendChild(postItem)
            // Increment index for the next post
            this.currentIndex = (this.currentIndex + 1) % posts.length;

        }


    }

    async updateCategorySection(categories) {
        const categorySection = document.querySelector("#category-heading")
        const headerTitle = document.createElement("h2")
        headerTitle.textContent = "Earnkraft Art"

        categorySection.appendChild(headerTitle)

        this.validateArray(categories)

        categories.forEach(category => {
            let categoryItem = document.createElement('div');
            categoryItem.classList.add(...[
                'd-flex',
                'justify-content-between',
                'align-items-center',
                `bg-${category.color}`,
                'bg-opacity-15',
                'rounded',
                'p-2',
                'position-relative'
            ]);

            let postCount = category.posts.length < 10 ? `0${category.posts.length}` : `${category.posts.length}`;
            categoryItem.innerHTML = `<h6 class="m-0 text-${category.color}">${category.title}</h6>
                                        <a href="/categories/${category.slug}/" class="badge bg-${category.color} text-light stretched-link">${postCount}</a>
                                    `
            categorySection.appendChild(categoryItem)
        });
    }

    trendingPopularArchivedAndMostReadPost(posts) {
        const trendingPostSection = document.querySelector("#trending-post")
        const headerTitle = document.createElement("h2")
        headerTitle.textContent = "Trending Posts"

        const trending = posts.filter(post => post.trending === true);
        const popular = posts.filter(post => post.popular === true);
        const archived = posts.filter(post => post.archived === true);
        const mostRead = posts.filter(post => post.popular === true);

        const editorsPickSponsored = posts.filter(post => post.editorsPick === true && post.sponsored === true);

        const editorsPickNoSponsored = posts.filter(post => post.editorsPick === true);

        const sponsoredPosts = posts.filter(post => post.sponsored === true);


        const recommededPost = posts.filter(post => post.recommeded === true);



        if (!trending) return;
        if (!popular) return;
        if (!archived) return;
        if (!mostRead) return;
        if (!editorsPickSponsored) return;
        if (!editorsPickNoSponsored) return;
        if (!recommededPost) return;

        this.SummaryArticleListFn(trending, "#trending .trending-inner");
        this.SummaryArticleListFn(popular, "#popular .popular-inner");
        this.SummaryArticleListFn(archived, "#archived .archived-inner");

        this.SummaryArticleListFn(mostRead, "#mostRead .mostRead-inner");

        // sidebar list most read
        // this.SummaryArticleListFn(mostRead, "#mostRead-sidebar.mostRead", true);
        // setInterval(() => { this.SummaryArticleListFn(mostRead, "#mostRead-sidebar.mostRead", true) }, 8000)
        this.utility.playTimeoutSlide(() => this.SummaryArticleListFn(mostRead, "#mostRead-sidebar.mostRead", true), 8000)


        // this.sponsoredEditorPick(editorsPickSponsored)
        // setInterval(() => { this.sponsoredEditorPick(editorsPickSponsored) }, 7000);
        this.utility.playTimeoutSlide(() => this.sponsoredEditorPick(editorsPickSponsored), 7000)

        // this.editorPickNoSponsor(editorsPickNoSponsored)
        // setInterval(() => { this.editorPickNoSponsor(editorsPickNoSponsored) }, 7000);
        this.utility.playTimeoutSlide(() => this.editorPickNoSponsor(editorsPickNoSponsored), 7000)



        this.utility.playTimeoutSlide(() => this.sponsoredNews(sponsoredPosts, "#sponsorednewswithvideo", true), 50000)
        // this.sponsoredNews(sponsoredPosts, "#sponsorednewswithvideo", true)
        // setInterval(() => { this.sponsoredNews(sponsoredPosts, "#sponsorednewswithvideo", true) }, 50000)


        this.recommenedSliderPost(recommededPost) // recommeded posts

        this.sponsoredNews(sponsoredPosts, "#sponsoredNews") // sponsored news

    }

    SummaryArticleListFn(posts, selectorChoice, sidebar = false) {
        const parent = document.querySelector(`${selectorChoice}`)
        const sidebarHeading = document.createElement("h5")
        this.currentIndex = 0;

        sidebarHeading.classList.add(...['mt-5', 'mt-3'])
        sidebarHeading.textContent = `Most Read`

        this.validateArray(posts)

        if (sidebar) {
            parent.innerHTML = '';
            const shuffledPosts = this.utility.shuffleArray(posts)
            this.currentIndex = 0;

            parent.appendChild(sidebarHeading)

            for (let index = 0; index < 8; index++) {
                let post = shuffledPosts[this.currentIndex];
                if (!post) break;

                let element = document.createElement('div');

                element.classList.add(...[
                    'd-flex', 'position-relative', 'mb-3'
                ])

                element.innerHTML = `
                        <span class="me-3 mt-n1 fa-fw fw-bold fs-3 opacity-5">${index + 1 < 10 ? `0${index + 1}` : `${index + 1}`}</span>
                        <h6>
                            <a href="/posts/${post.slug}" class="stretched-link text-reset btn-link">
                            ${this.utility.truncateSentence(post.title, 11)}
                            </a>
                        </h6>
                    `;

                parent.appendChild(element)

                this.currentIndex = (this.currentIndex + 1) % shuffledPosts.length;
            }
            return;
        }

        posts.forEach((post, index) => {
            let articleItem = document.createElement('div');
            articleItem.classList.add(...['col-md-4']);

            articleItem.innerHTML = `
                <!-- Tab items group START -->
                    <!-- Item -->
                    <div class="d-flex position-relative mb-3">
                        <span class="me-3 mt-n1 fa-fw fw-bold fs-3 opacity-5">${index + 1 < 10 ? `0${index + 1}` : `${index + 1}`}</span>
                        <h5>
                            <a href="${!post.archived ? `/posts/${post.slug}` : '#'}" class="stretched-link text-reset btn-link">
                            ${this.utility.truncateSentence(post.title, 10)}
                            </a>
                        </h5>
                    </div>
                <!-- Tab items group END -->
                `;
            parent.appendChild(articleItem)
        })


    }

    sponsoredEditorPick(posts) {
        const parent = document.getElementById("editorSponsor")
        this.currentIndex = 0

        this.validateArray(posts)

        parent.innerHTML = '';

        for (let i = 0; i < 2; i++) {
            const post = posts[this.currentIndex]
            if (!post) break;

            let postItem = document.createElement('div');

            postItem.classList.add(...[
                'card',
                'mb-3'
            ])

            postItem.innerHTML = `
                    <!-- Card item big START -->
                        <div class="card mb-4">
                            <div class="card-body p-4 border rounded-3">
                                <div class="d-flex justify-content-between mb-2">
                                    <a href="/posts/${post.pk}" class="badge text-bg-${post.template ? `${post.template.category.color}` : 'info'}">
                                        <i class="fas fa-circle me-2 small fw-bold"></i>
                                        ${post.template ? `${post.template.category.title}` : 'uncategorized'}
                                    </a>
                                    <a
                                        href="#!"
                                        class="text-body"
                                        tabindex="0"
                                        role="button"
                                        data-bs-container="body"
                                        data-bs-toggle="popover"
                                        data-bs-trigger="focus"
                                        data-bs-placement="top"
                                        data-bs-content="You're seeing this ad because your activity meets the intended audience of our site.">
                                    <i class="bi bi-info-circle pe-1"></i> Sponsored
                                </a>
                            </div>
                            <h4 class="card-title">
                                <a href="/posts/${post.slug}" class="btn-link text-reset fw-bold">
                                    ${this.utility.truncateSentence(post.title, 13)}
                                </a>
                            </h4>
                            <p class="card-text">${this.utility.truncateSentence(post.summary, 15)}</p>
                            <!-- Card info -->
                            <ul class="nav nav-divider align-items-center d-none d-sm-inline-block" >
                                <li class="nav-item">
                                    <div class="nav-link">
                                    <div class="d-flex align-items-center position-relative">
                                        <div class="avatar avatar-xs">
                                        <img
                                            class="avatar-img rounded-circle"
                                            src="/static/assets/images/avatar/01.jpg"
                                            alt="avatar"
                                        />
                                        </div>
                                        <span class="ms-3">by
                                            <a href="#" class="stretched-link text-reset btn-link">
                                            ${post.profile ? `${post.profile.user.username}` : `${this.utility.randomName()}`}
                                            </a>
                                        </span>
                                    </div>
                                    </div>
                                </li>
                                <li class="nav-item">${this.utility.formatDate(post.created_at)}</li>
                            </ul>
                        </div>
                        </div>
                    <!-- Card item big END -->

                `;

            parent.appendChild(postItem)

            this.currentIndex = (this.currentIndex + 1) % posts.length
        }


    }

    editorPickNoSponsor(posts) {
        const parent = document.getElementById("editorPickNoSponsor")
        this.currentIndex = 0

        this.validateArray(posts)

        const shuffledPosts = this.utility.shuffleArray(posts).slice(0, 4);

        parent.innerHTML = '';

        for (let index = 0; index < 4; index++) {
            const post = shuffledPosts[this.currentIndex]
            if (!post) break;

            let postItem = document.createElement('div');
            postItem.classList.add(...[
                'card',
                'mb-1'
            ])

            postItem.innerHTML = `
                    <div class="card-body px-0 border-bottom">
                        <a href="#" class="badge text-bg-${post.template ? `${post.template.category.color}` : 'success'} mb-2">
                            <i class="fas fa-circle me-2 small fw-bold"></i>
                            ${post.template ? `${post.template.category.title}` : 'uncategorized'}
                        </a>
                        <h5>
                            <a href="post-single-3.html" class="btn-link stretched-link text-reset">
                            ${this.utility.truncateSentence(post.title, 8)}
                            </a>
                        </h5>
                        <!-- Card info -->
                        <ul class="nav nav-divider align-items-center d-none d-sm-inline-block small">
                            <li class="nav-item">
                                <div class="nav-link">
                                    <div class="d-flex align-items-center position-relative">
                                        <div class="avatar avatar-xs">
                                            <img class="avatar-img rounded-circle" src="/static/assets/images/avatar/05.jpg" alt="${post.profile ? `${post.profile.user.username}` : `${post.title} author image`}"/>
                                        </div>
                                        <span class="ms-3">by
                                            <a href="#" class="stretched-link text-reset btn-link">
                                                ${post.profile ? `${post.profile.user.username}` : `${this.utility.randomName()}`}
                                            </a>
                                        </span>
                                    </div>
                                </div>
                                </li>
                                <li class="nav-item">${this.utility.formatDate(post.created_at)}</li>
                        </ul>
                    </div>
                `;

            parent.appendChild(postItem)

            this.currentIndex = (this.currentIndex + 1) % posts.length

        }







    }

    sponsoredNews(posts, selectorChoice, withvideo = false) {
        const parent = document.querySelector(`${selectorChoice}`)
        this.currentIndex = 0
        this.validateArray(posts)

        const shuffledVideos = this.utility.shuffleArray(this.utility.videoLinks())
        const shuffledPosts = this.utility.shuffleArray(posts)

        // parent.innerHTML = ''

        if (withvideo) {
            this.currentIndex = 0;

            parent.innerHTML = '';

            for (let index = 0; index < 1; index++) {
                const videoLink = shuffledVideos[this.currentIndex]
                const post = shuffledPosts[this.currentIndex]

                if (!post) break;

                const element = document.createElement("div");
                element.classList.add(...['row', 'g-3'])

                element.innerHTML = `
                        <div class="col-md-6 order-sm-2">
                            <div class="rounded-3 overflow-hidden">
                                <div class="ratio ratio-16x9">
                                    <iframe width="560" height="315" src="${videoLink}" title="${post.title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="d-sm-flex justify-content-sm-between mb-2">
                                <a href="#" class="badge bg-${post.template ? `${post.template.category.color}` : 'warning'}">
                                    <i class="fas fa-circle me-2 small fw-bold"></i>
                                    ${post.template ? `${post.template.category.title}` : 'uncategorized'}
                                </a>
                                <a href="#!" class="text-body" tabindex="0" role="button" data-bs-container="body" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="You're seeing this ad because your activity meets the intended audience of our site.">
                                    <i class="bi bi-info-circle pe-1"></i> Sponsored
                                </a>
                            </div>
                            <h3>
                                <a href="/posts/${post.slug}" class="btn-link text-reset fw-bold">
                                    ${this.utility.truncateSentence(post.title, 11)}
                                </a>
                            </h3>
                            <p> ${this.utility.truncateSentence(post.summary, 33)}</p>
                            <!-- Card info -->
                            <ul class="nav nav-divider align-items-center d-none d-sm-inline-block">
                                <li class="nav-item">
                                    <div class="nav-link">
                                        <div class="d-flex align-items-center position-relative">
                                            <div class="avatar avatar-xs">
                                                <img class="avatar-img rounded-circle" src="/static/assets/images/avatar/06.jpg" alt="${post.profile ? `${post.profile.full_name}` : `${this.utility.randomName()}`}"/>
                                            </div>
                                            <span class="ms-3">by
                                                <a href="#" class="stretched-link text-reset btn-link">${post.profile ? `${post.profile.full_name}` : `${this.utility.randomName()}`}</a>
                                            </span>
                                        </div>
                                    </div>
                                </li>
                                <li class="nav-item">${this.utility.formatDate(post.created_at, false)}</li>
                                <li class="nav-item"><a href="#" class="btn-link"><i class="far fa-comment-alt me-1"></i>14</a></li>
                            </ul>
                        </div>
                    `;

                parent.appendChild(element)

                this.currentIndex = (this.currentIndex + 1) % shuffledPosts.length
            }

            return;
        }


        const renderPosts = (posts) => {
            const sliderContainer = document.querySelector('.sponsoredNews');

            if (posts.length > 1) {
                const sliderContainerTitle = document.getElementById("sponsoredNews-title");
                sliderContainer.innerHTML = ''

                posts.forEach((post) => {
                    const postItem = document.createElement('div');
                    postItem.classList.add('card');
                    postItem.innerHTML = `
                            <div class="position-relative">
                            <img class="card-img" src="${post.image_url ? `${post.image_url}` : `/static/assets/images/blog/4by3/07.jpg`}" alt="${post.title}">
                                <div class="card-img-overlay d-flex align-items-start flex-column p-3">
                                    <!-- Card overlay Top -->
                                    <div class="w-100 mb-auto d-flex justify-content-end">
                                        <div class="text-end ms-auto">
                                            <!-- Card format icon -->
                                            <div class="icon-md bg-white bg-opacity-10 bg-blur text-white fw-bold rounded-circle" title="${Math.floor(Math.random() * 10)} rating">
                                                ${Math.floor(Math.random() * 10)}
                                            </div>
                                        </div>
                                    </div>
                                    <!-- Card overlay bottom -->
                                    <div class="w-100 mt-auto">
                                        <a href="#" class="badge text-bg-${post.template ? `${post.template.category.color}` : 'info'} mb-2">
                                            <i class="fas fa-circle me-2 small fw-bold"></i>
                                            ${post.template ? `${post.template.category.title}` : 'uncategorized'}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        <div class="card-body px-0 pt-3">
                            <h5 class="card-title">
                            <a href="post-single-3.html" class="btn-link text-reset fw-bold">
                                ${this.utility.truncateSentence(post.title, 8)}
                            </a>
                            </h5>
                            <!-- Card info -->
                            <ul class="nav nav-divider align-items-center d-none d-sm-inline-block">
                                <li class="nav-item">
                                    <div class="nav-link">
                                        <div class="d-flex align-items-center position-relative">
                                                <div class="avatar avatar-xs">
                                                    <img class="avatar-img rounded-circle" src="/static/assets/images/avatar/07.jpg" alt="${post.profile ? `${post.profile.full_name}` : `${this.utility.randomName()}`}">
                                                </div>
                                                <span class="ms-3">by
                                                <a href="#" class="stretched-link text-reset btn-link">
                                                    ${post.profile ? `${post.profile.full_name}` : `${post.profile.full_name}`}
                                                </a>
                                            </span>
                                        </div>
                                    </div>
                                </li>
                                <li class="nav-item">${this.utility.formatDate(post.created_at)}</li>
                            </ul>
                        </div>
                        `;
                    sliderContainer.appendChild(postItem);
                })
            }



        }

        renderPosts(posts);
        this.initializeSlider('sponsoredNews', 4, 10, {
            640: {
                edgePadding: 20,
                gutter: 20,
                items: 2
            },
            700: {
                gutter: 30
            },
            900: {
                items: 3
            },
            585: {
                items: 2
            },
            300: {
                items: 1
            }
        });
    }

    recommenedSliderPost(posts) {
        this.truncateSentence = (words, limit = 8) => {
            return this.utility.truncateSentence(words, limit);
        };

        if (posts.length < 1) {
            const recommendationBox = document.getElementById("recommeded-box");
            recommendationBox.textContent = ''
        }
        // Function to initialize the Tiny Slider

        // Function to dynamically render posts
        const renderPosts = (posts) => {
            const sliderContainer = document.querySelector('.recommended-slider');

            // Clear existing content
            sliderContainer.innerHTML = '';

            posts.forEach(post => {
                const postItem = document.createElement('div');
                postItem.classList.add('card');
                postItem.innerHTML = `
                      <!-- Card img -->
                        <div class="position-relative">
                            <img class="card-img" src="/static/assets/images/blog/4by3/07.jpg" alt="${post.title}"/>
                            <div class="card-img-overlay d-flex align-items-start flex-column p-3">
                                <!-- Card overlay Top -->
                                <div class="w-100 mb-auto d-flex justify-content-end">
                                    <div class="text-end ms-auto">
                                    <!-- Card format icon -->
                                    <div class="icon-md bg-white bg-opacity-10 bg-blur text-white fw-bold rounded-circle" title="${Math.floor(Math.random() * 10)} rating">
                                        ${Math.floor(Math.random() * 10)}
                                    </div>
                                    </div>
                                </div>
                                <!-- Card overlay bottom -->
                                <div class="w-100 mt-auto">
                                    <a href="#" class="badge text-bg-${post.template ? `${post.template.category.color}` : `info`} mb-2">
                                        <i class="fas fa-circle me-2 small fw-bold"></i>
                                        ${post.template ? `${post.template.category.title}` : `uncategorized`}
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="card-body p-0 pt-3">
                            <h5 class="card-title">
                                <a href="/posts/${post.slug}" class="btn-link text-reset fw-bold">
                                    ${this.truncateSentence(post.title, 6)}
                                </a>
                            </h5>
                        </div>
                    `;
                sliderContainer.appendChild(postItem);
            });
        }

        renderPosts(posts);
        this.initializeSlider('recommended-slider');

    }
    // slider intialier for global slide shows
    initializeSlider(selectorChoice, items = 1, gutter = 1, responsive = {
        280: { items: 1, container: `.${selectorChoice}`, },
        350: { items: 1, container: `.${selectorChoice}`, },
        600: { items: 1, container: `.${selectorChoice}`, },
        700: { items: 2, container: `.${selectorChoice}`, },
        900: { items: 3, container: `.${selectorChoice}`, }
    }) {
        tns({
            container: `.${selectorChoice}`,
            items: `${items}`,
            navPosition: 'bottom',
            autoplay: true,
            gutter: gutter,
            autoplayButtonOutput: false,
            rewind: true,
            responsive: responsive,
        });
    }

}

