class PodcastUtilities {
    constructor() { }
    parseUrlParam(url) {
        const params = new URLSearchParams(url);
        return params.get('slug');
    }

    formatTime(seconds, format = "12") {
        if (seconds < 0) {
            return "Invalid duration";
        }

        // Calculate hours, minutes, and seconds
        let hours = Math.floor(seconds / 3600);
        seconds %= 3600;
        let minutes = Math.floor(seconds / 60);
        seconds %= 60;

        // Format the duration based on the values
        if (hours > 0) {
            if (minutes > 0) {
                return `${hours > 10 ? `${hours}` : `0${hours}`} hr ${minutes > 10 ? `${minutes}` : `0${minutes}`} min`;
            } else {
                return `${hours > 10 ? `${hours}` : `0${hours}`} hr 00 min`;
            }
        } else if (minutes > 0) {
            if (seconds > 0) {
                return `${minutes > 10 ? `${minutes}` : `0${minutes}`} min ${seconds} sec`;
            } else {
                return `${minutes > 10 ? `${minutes}` : `0${minutes}`} min`;
            }
        } else {
            return `${seconds > 10 ? `${seconds}` : `0${seconds}`} sec`;
        }
    }

    podcastThumbnail() {
        return [
            "https://images.unsplash.com/photo-1559523161-0fc0d8b38a7a?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "https://images.pexels.com/photos/1181659/pexels-photo-1181659.jpeg?auto=compress&cs=tinysrgb&w=600",
            "https://plus.unsplash.com/premium_photo-1680037568203-08fb7b56926b?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "https://images.pexels.com/photos/6954162/pexels-photo-6954162.jpeg?auto=compress&cs=tinysrgb&w=600",
        ]
    }

    getYouTubeEmbedUrl(videoUrl) {
        const videoId = videoUrl.split('v=')[1];
        const ampersandPosition = videoId.indexOf('&');
        return ampersandPosition !== -1 ? videoId.substring(0, ampersandPosition) : videoId;
    }


    splitTextIntoParagraphs(text, maxSize = 1000) {
        // Split the text into words
        const words = text.split(' ');
        let paragraphs = [];
        let currentParagraph = [];

        words.forEach(word => {
            // If adding the next word exceeds the maxSize, start a new paragraph
            if (currentParagraph.join(' ').length + word.length + 1 > maxSize) {
                paragraphs.push(currentParagraph.join(' '));
                currentParagraph = [word];
            } else {
                currentParagraph.push(word);
            }
        });

        // Push the last paragraph if there are remaining words
        if (currentParagraph.length > 0) {
            paragraphs.push(currentParagraph.join(' '));
        }

        return paragraphs;
    }
}


class Podcast {
    constructor() {
        this.metadata = new MetaDataApi();
        this.utility = new PodcastUtilities();
    }
    init = async () => {
        await this.updateTheUiView();
    }

    async podcatId() {
        let slugItem = await this.metadata.updateHero.utility.parseUrlParam(`${window.location.href}`);
        console.log(slugItem)
        console.log(slugItem)
        return slugItem
    }

    retrievePodcast = async (id) => {
        const response = await fetch(`${this.metadata.base_url}/podcasts/${id}`)
        const data = await response.json()
        const embedVideoUrl = this.utility.getYouTubeEmbedUrl(data.video_url)
        const videoIds = [
            "TsQZOTSteK8",
            "ego0crnoRjY",
            "zws5ssxJOZc",
            "UTJnu6lAhvM",
        ]
        console.log(data)


        const randomVideo = (videoIds) => {
            return videoIds[Math.floor(Math.random() * videoIds.length)];
        }

        console.log(randomVideo(videoIds))


        const updateHeroSection = (data) => {
            const podcastThumbnail = document.getElementById("podcastthumbnail")
            const podcastHost = document.getElementById("podcast-host")
            const podcastVideo = document.getElementById("podcastVideo")
            const podcastVideoOverlay = document.getElementById("podcastVideoOverlay");
            // Assuming you have your utility object and podcastThumbnail element defined
            // podcastThumbnail.classList.add('fade');

            const changeImage = () => {
                let newImage = this.utility.podcastThumbnail()[Math.floor(Math.random() * this.utility.podcastThumbnail().length)];

                podcastThumbnail.classList.add('hidden');
                setTimeout(() => {
                    podcastThumbnail.src = newImage;
                    podcastThumbnail.classList.remove('hidden');
                    podcastThumbnail.classList.remove('fade');
                }, 10000); // Match this timeout with your CSS transition duration
            }

            // Initial image setup
            // changeImage();

            setInterval(() => {
                // changeImage();
            }, 10000);

            podcastHost.innerHTML = this.metadata.updateHero.utility.truncateSentence(data.profile.full_name, 1)
            podcastVideo.href = data.video_url;



            console.log(embedVideoUrl)

            podcastVideoOverlay.innerHTML = `
                <iframe width="100%" height="100%" 
                    src="https://www.youtube.com/embed/${embedVideoUrl}"
                    title="${data.title}" 
                    frameborder="0" 
                    allow="accelerometer; 
                    autoplay; clipboard-write;
                    encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerpolicy="strict-origin-when-cross-origin" allowfullscreen
                ></iframe>
            
            `;

            // handle the aduio player

            const handlePodcastAudioPlayer = (data) => {
                const audioPlayer = document.getElementById("audioPlayer")
                const audioPlayersource = document.getElementById("audioPlayersource")
                audioPlayersource.src = data.audio_url


                const updatePodcastCard = (data) => {
                    const podcastTitles = document.querySelectorAll(".podcastTitle")
                    const podcastDuration = document.getElementById("podcastDuration")
                    const podcastHost = document.getElementById("podcastHost")
                    const podcastHostProfilePic = document.getElementById("podcastHostProfilePic")
                    // Assuming you have your utility object and podcastHostProfilePic element defined

                    podcastTitles.forEach((podcast_title) => {
                        podcast_title.innerHTML = data.title
                    });

                    const updatePodcastBodyTranscript = (data) => {
                        const podcastBodyTranscript = document.querySelector(".podcasttranscript")

                        const displayTranscript = (data) => {
                            const transcript = data.video_transcript;
                            // Get the paragraphs
                            const paragraphs = this.utility.splitTextIntoParagraphs(transcript);

                            function getRandomInt(max) {
                                return Math.floor(Math.random() * max);
                            }

                            let embedVideo = randomVideo(videoIds);
                            setInterval(() => {
                                embedVideo = randomVideo(videoIds)
                            }, 30000);

                            // Create the HTML content
                            let content = '';
                            const videoEmbed = `<div class="video">
                                <iframe width="100%" height="350" 
                                    src="https://www.youtube.com/embed/${embedVideo}" 
                                    title="" 
                                    frameborder="0" allow="accelerometer; autoplay; 
                                    clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                    referrerpolicy="strict-origin-when-cross-origin" allowfullscreen="allowfullscreen"
                                ></iframe>
                            </div>`;
                            const adEmbed = `<div class="podcast-ad">
                             <section class="pt-4">
                                <div class="container">
                                    <div class="row">
                                    <div class="col-lg-8 mx-auto">
                                        <a href="#" class="card-img-flash d-block">
                                        <img src="/static/assets/images/adv-1.png" alt="adv"/>
                                        </a>
                                        <!-- Link text -->
                                        <div class="smaller text-end mt-2">
                                        ads via
                                        <a href="#" class="text-body">
                                            <u>Bootstrap</u>
                                        </a>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                </section>
                            
                            </div>`;

                            paragraphs.forEach(paragraph => {
                                content += `<p class="my-2 py-2">${paragraph}</p>`;
                                // Randomly insert video or ad
                                if (getRandomInt(2) === 0) {
                                    if (getRandomInt(2) === 0) {
                                        content += videoEmbed;
                                    } else {
                                        content += adEmbed;
                                    }
                                }
                            });

                            // Set the innerHTML
                            podcastBodyTranscript.innerHTML = content;

                        }

                        displayTranscript(data)

                    }

                    updatePodcastBodyTranscript(data)


                    podcastDuration.innerHTML = this.utility.formatTime(data.duration)
                    podcastHost.innerHTML = this.metadata.updateHero.utility.truncateSentence(data.profile.full_name, 2)
                    // podcastHostProfilePic.src = data.profile.image_url
                    podcastHostProfilePic.alt = data.profile.full_name


                }



                updatePodcastCard(data)
            };

            // call the function the audio player
            handlePodcastAudioPlayer(data)


        }


        updateHeroSection(data)

        return data;
    }

    async updateTheUiView() {
        await this.retrievePodcast(await this.podcatId())
    }


}

const podcast = new Podcast()

podcast.init()