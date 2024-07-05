"use strict";

class ExternalChannelToEarnkraftPosts {
    constructor() {
        this.metadata = new MetaDataApi();
    }

    todayTopHighLight(posts) {
        // Assuming updateTodayTopHighLight(posts) returns a function to update the UI
        this.metadata.updateHero.updateTodayTopHighLight(posts)
        setInterval(() => {
            this.metadata.updateHero.updateTodayTopHighLight(posts)
        }, 6000);

    }

    init = async () => {

        let categories = await this.fetchCategory(`categories`)
        this.metadata.updateHero.utility.playTimeoutSlide(async () => {
            categories = await this.fetchCategory(`categories`)
        }, 500000
        )


        let posts = await this.fetchPosts(`posts`);
        this.metadata.updateHero.utility.playTimeoutSlide(async () => {
            posts = await this.fetchPosts(`posts`)
        }, 500000)

        await this.handlePostPodcast("podcasts")


        this.metadata.updateHero.updateCategorySection(categories)

        this.todayTopHighLight(posts)

        this.metadata.updateHero.trendingPopularArchivedAndMostReadPost(posts)

        return {
            posts,
            categories
        }
    }

    cleanHtml(content) {
        // Remove HTML tags using a regular expression
        return content.replace(/<[^>]*>/g, '');
    }

    async fetchPosts(endpoint) {
        let posts = localStorage.getItem('EarnkraftPosts');

        if (posts === null) {
            return this.handleUpdateLocalStore(`${this.metadata.base_url}/${endpoint}`, "EarnkraftPosts")
        }
        console.log("From local storage")
        let data = JSON.parse(localStorage.getItem("EarnkraftPosts"));
        return data;
    }

    handleUpdateLocalStore = async (url, storageKey) => {
        const response = await fetch(`${url}`);
        const data = await response.json();
        if (!data) {
            console.error("No data received from the API.");
            return;
        }
        localStorage.setItem(storageKey, JSON.stringify(data));
        console.log("From the server", storageKey)
        return await JSON.parse(localStorage.getItem(storageKey));
    }

    async fetchCategory(endpoint) {
        let categories = localStorage.getItem('EarnkraftPostCategories');

        if (categories === null) {
            return await this.handleUpdateLocalStore(`${this.metadata.base_url}/${endpoint}`, 'EarnkraftPostCategories')
        }
        console.log("From local storage")

        let data = JSON.parse(localStorage.getItem("EarnkraftPostCategories"));

        return data;
    }

    handlePostPodcast = async (endpoint) => {
        // Assuming handlePostPodcast() returns a function to post the podcast
        console.log("load pod cst");
        const posdcastFilterBox = document.querySelector(".podcast-slider");

        const response = await fetch(`${this.metadata.base_url}/${endpoint}`)

        const data = await response.json()

        console.log(data)

        const listinPodcastfilter = async (podcats) => {

            podcats.filter(
                (podcat) => podcat.is_verified === true)
                .filter((podcast) => !(podcast.video_transcript.includes("Something went wrong")
                    || podcast.video_transcript.includes("DeepgramApiError"))
                ).forEach((podcat) => {
                    const podcastDiv = document.createElement('div');
                    podcastDiv.innerHTML = `
                          <!-- Card item START -->
                            <div class="card card-fold bg-light">
                                <div class="card-body p-4">
                                    <ul class="nav nav-divider align-items-center d-none d-sm-inline-block small mb-2">
                                        <li class="nav-item">
                                            <i class="bi bi-clock-history"></i>
                                            ${this.metadata.updateHero.utility.convertMillisecondsToTime(podcat.duration)}
                                        </li>
                                        <li class="nav-item">
                                            With <a href="#"> ${this.metadata.updateHero.utility.truncateSentence(podcat.profile.full_name, 1)}</a>
                                        </li>
                                    </ul>
                                    <h4 class="card-title">
                                        <a href="/podcasts/${podcat.id}" class="stretched-link text-reset">
                                            ${this.metadata.updateHero.utility.truncateSentence(podcat.title, 4)}
                                        </a>
                                    </h4>
                                    <p class="m-0">
                                        ${this.metadata.updateHero.utility.truncateSentence(podcat.video_transcript, 4)}
                                    </p>
                                </div>
                                <img src="/static/assets/images/blog/16by9/small/04.jpg" class="card-img-bottom" alt="${this.metadata.updateHero.utility.truncateSentence(podcat.title, 20)}"/>
                            </div>
                         <!-- Card item END -->
                    `;
                    posdcastFilterBox.appendChild(podcastDiv)
                })

        }

        await listinPodcastfilter(data)
        this.metadata.updateHero.initializeSlider('podcast-slider', 3, 24)

        return data

    };

}


const earnkraftArticles = new ExternalChannelToEarnkraftPosts()

earnkraftArticles.init()
