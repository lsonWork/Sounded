const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const title = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');
const start = $('.start');
const end = $('.end');
const volume = $('.icon-volume');
const progressVolume = $('#volume');
const dashboard = $('.dashboard');
const btnMode = $('.change-mode');
const iconMode = $('.icon-mode');
const body = $('body');

const black = getComputedStyle(document.documentElement).getPropertyValue('--main-color-dark');
const mint = getComputedStyle(document.documentElement).getPropertyValue('--main-color');

// var isLaptop = window.matchMedia('(min-width: 1024px)').matches;



const USER_STORAGE = 'Soundeii_user';
//hiểu là gán document.querySelector thành $ và All thành $$


const app = {
    currentIndex: 0,
    played: [], //không khai báo this ở trong played được vì this lúc này đang không trỏ ai, không phải thằng app đâu
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isDark: false,
    numVolume: 1,
    config: JSON.parse(localStorage.getItem(USER_STORAGE)) || {'currentIndex': 0},
    //hiểu th config là 1 đối tượng lưu trữ đối tượng USER_STORAGE 
    //được lưu trên localstorage
    //nếu không có(lần đầu) thì khởi tạo {}
    //những lần sau thì nó lấy thằng đã được lưu về
    //lấy về parse sang JSON và truy cập được các thuộc tính vd: config.isRandom
    songs: [
        {
            name: 'Viva La Vida',
            singer: 'Coldplay',
            path: './assets/songs/Coldplay  Viva la Vida Lyrics.mp3',
            image: 'https://upload.wikimedia.org/wikipedia/vi/2/25/Viva_la_Vida_or_Death_and_All_His_Friends.jpg',
        },
        {
            name: 'Sleep Well',
            singer: 'd4vd',
            path: './assets/songs/d4vd  Sleep Well Official Music Video.mp3',
            image: './assets/images/sleepWell.jpeg',
        },
        {
            name: 'Here With Me',
            singer: 'd4vd',
            path: './assets/songs/d4vd  Here With Me Official Music Video.mp3',
            image: './assets/images/hereWithMe.jpg',
        },
        {
            name: 'Numb Little Bug',
            singer: 'Em beihold',
            path: './assets/songs/Em Beihold  Numb Little Bug Official Lyric Video.mp3',
            image: './assets/images/numbLittleBug.jpg',
        },
        {
            name: 'My Love My All Mine',
            singer: 'Mitski',
            path: './assets/songs/Mitski  My Love Mine All Mine Official Lyric Video.mp3',
            image: './assets/images/myLoveMyAllMine.png',
        },
        {
            name: 'Chemical',
            singer: 'Post Malone',
            path: './assets/songs/Post Malone  Chemical Lyrics.mp3',
            image: './assets/images/chemical.png',
        },
        {
            name: 'Circles',
            singer: 'Post Malone',
            path: './assets/songs/Post Malone  Circles Lyrics.mp3',
            image: './assets/images/circle.jpg',
        },
        {
            name: 'Goodbyes',
            singer: 'Post Malone',
            path: './assets/songs/Post Malone  Goodbyes Lyrics ft Young Thug.mp3',
            image: './assets/images/goodbye.jpg',
        },
        {
            name: 'Kill Bill',
            singer: 'SZA',
            path: './assets/songs/SZA  Kill Bill Audio.mp3',
            image: './assets/images/killBill.jpg',
        },
        {
            name: 'Lover',
            singer: 'Taylor Swift',
            path: './assets/songs/Taylor Swift  Lover Official Music Video.mp3',
            image: './assets/images/lover.jpg',
        },
        {
            name: 'Pano',
            singer: 'Zack Tabudlo',
            path: './assets/songs/Zack Tabudlo  Pano Official Vietnamese Lyric Video.mp3',
            image: './assets/images/pano.jpg',
        },
    ],
    setConfig: function (key, value) { //lưu local theo từng user(trình duyệt) gom lại
        //thằng setConfig này sẽ lấy về các thuộc tính, gom vào đối tượng config
        //đẩy đối tượng USER_STORAGE với các thuộc
        //tính lên local
        this.config[key] = value;
        localStorage.setItem(USER_STORAGE, JSON.stringify(this.config));
        //này là đẩy thằng các thuộc tính của config lên dưới đại diện 
        //là thằng Soundeii user 
    },

    loadConfig: function () { //hàm này để lấy dữ liệu parse từ JSON ở config
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
        this.currentIndex = this.config.currentIndex;
        //load dữ liệu đó vào các thuộc tính isRandom và isRepeat của app
    },

    define: function () {
        Object.defineProperty(this, 'currentSong', { //nó tạo 1 thuộc tính mới tên currentSong cho thằng app
            get: function () { //thằng currentSong ấy có getter là 1 hàm
                return this.songs[this.currentIndex]
            }   //mặc định getter sẽ được gọi khi thuộc tính currentSong được truy cập => bỏ dấu () đi
        })
    },

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                    <div class="song ${index === app.currentIndex ? 'activeSong' : ''} ${app.isDark ? 'dark' : ''}" 
                    data-index="${index}" 
                    style="background-color: ${app.isDark ? black : 'white'}; 
                    box-shadow: ${app.isDark ? '0px 1px 5px #292929' : ''};
                    transition: all ease .8s">
                        <div class="thumb" style="background-image: url('${song.image}');">
                        </div>
                        <div class="body">
                            <h3 class="title">${song.name}</h3>
                            <p class="author">${song.singer}</p>
                        </div>
                        <div class="option">
                            <i class="fas fa-ellipsis-h ${index === this.currentIndex ? 'activeTitle' : ''}"></i>
                        </div>
                    </div>`
        });
        $('.playlist').innerHTML = htmls.join('');
    }, //hàm render ra cái view

    handleEvents: function () {
        //xử lý phóng to thu nhỏ CD
        const cdWidth = cd.offsetWidth; //để ở đây vì nó lấy mặc định 200 trừ đi
        document.onscroll = function () { //khi kéo thì chạy hàm
            const scrollValue = window.scrollY;
            const newWidth = cdWidth - scrollValue;

            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0;
            cd.style.opacity = newWidth / cdWidth;
            //cái opacity này là từ 0 -> 1, height càng cao opacity càng lớn
            //=> kthuoc cũ / kích thước mới => height càng cao kq càng lớn

            // cd.style.width = newWidth + 'px';
            //nếu khi kéo nhanh quá thì nó ra giá trị cực to => newWidth = âm thì phải
            //nếu newWidth lớn hơn 0 thì mới set, không thì cho bằng 0 luôn
        }

        //Xử lý quay CD
        //xử lý ở chỗ khi play khi pause
        //.animate() nhận đối số 1 là 1 cái mảng, trong mảng truyền các 
        //style của animation(css)
        //đối số thứ 2 là option thể hiện speed, easing, callback
        const rotateAnimation = cdThumb.animate({
            transform: 'rotate(360deg)'
        }, {
            duration: 10000,
            iterations: Infinity
        })
        //3 thuộc tính này đều của css
        //hiểu thằng animate giúp js tạo animation bằng style css
        //.animate nó sẽ trả về 1 đối tượng, có thể tương tác animate qua đối tượng đó

        rotateAnimation.pause();


        //Xử lý play/pause
        playBtn.onclick = function () {
            if (app.isPlaying) {
                audio.pause(); //khi chạy dòng này thì chạy tiếp onpause
                rotateAnimation.pause();
            } else {
                rotateAnimation.play();
                audio.play(); //khi chạy dòng này thì chạy tiếp onplay
            }
        }

        //Khi song được play 
        audio.onplay = function () {
            app.isPlaying = true;
            $('.player').classList.add('playing');
        }
        //Khi song bị pause
        audio.onpause = function () {
            app.isPlaying = false;
            $('.player').classList.remove('playing');
        }


        //Bắt sự kiện khi tiến độ bài hát thay đổi
        let isSeeking = false;
        progress.oninput = function () { //cái này bắt khi value của range thay đổi
            //xử lí gán cái thumb với line
            document.documentElement.style.setProperty('--percent', (progress.value) + '%');
            // start.innerHTML = app.convert(Number(audio.currentTime));
            // console.log(app.convert((progress.value * audio.duration) / 100));
            start.innerHTML = app.convert((progress.value * audio.duration) / 100);
            isSeeking = true;
        }
        // progress.onmouseup = function() {
        //     isSeeking = false;
        // }
        //ở đây dùng oninput vì trên điện thoại làm gì có onmousedown

        //bắt thời gian phát của phương tiện thay đổi
        audio.ontimeupdate = function () { //cái này chỉ update khi người dùng không bấm chuột tua
            if (audio.duration && !isSeeking) { //đang không tua thì mới update
                // progress.value = audio.currentTime;
                // progress.max = audio.duration;
                // console.log(progress.value)
                //cách này đơn giản chỉ lấy thời gian hiện tại làm các value
                //nhưng phải để max là duration
                //cách này nó chạy theo từng giây tích tắc nên nó đi nhanh hơn

                const percent = Math.round((audio.currentTime / audio.duration) * 100);
                progress.value = percent;
                document.documentElement.style.setProperty('--percent', (progress.value) + '%');
                // console.log(progress.value)
                //cách này tính tỉ lệ thời gian hiện tại theo % và phải để
                //max là 100
                //cách này chạy theo % 1%, 2%, 3% => đi chậm hơn

                //nên dùng tỉ lệ cho khớp vì cái currentTime trả số xấu quá
                start.innerHTML = app.convert(Number(audio.currentTime));
                end.innerHTML = app.convert(Number(audio.duration));
                //thời gian cứ thay đổi là lại tính và update
            }
        }

        //Xử lý tua song
        progress.onchange = function () {
            //progress value ở đây nó là số % của bài hát
            const seekTime = (progress.value * audio.duration) / 100;
            //thời gian tua phải tính dựa trên tỉ lệ tua
            //%tua      ?
            //tổng100%  duration
            audio.currentTime = seekTime; //gán thời gian hiện tại bằng thời gian tua
            isSeeking = false;
            //giờ phải tính số giây ở hiện tại
            //ví dụ bấm vào 43% thì phải tính ra số giây
            //43    ?       ==> basic nhân chéo chia ngang
            //100   242

        }

        //có 1 cái cần xử lý, có những lúc mình click tua, nó sẽ chạy hàm onchange
        //nhưng cái hàm ontimeupdate lại chạy đúng lúc đấy => mất cái hành vi tua => không lọt vào onchange
        //có thể hiểu đơn giản, ông onTimeUpdate, mỗi khi bài hát tăng tiến độ
        //cái value được làm mới và nó làm mất cái hành vi mình đang click chọn value
        //nó sẽ không lọt vào onchange
        //đặt điều kiện, ông ontimeupdate chỉ chạy khi không tua, khi đang tua thì
        //ông ý không chạy tăng tiến độ 

        //Bắt sự kiện next song
        nextBtn.onclick = function () {
            if (!app.isRandom) { //nếu không random
                app.nextSong(); //đến đây phải play lại bài mới vì nó đổi suộc nhạc
                progress.value = 0;
                document.documentElement.style.setProperty('--percent', '0%');
                rotateAnimation.play();
            } else {
                app.playRandomSong();
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();
            app.setConfig('currentIndex', app.currentIndex);
        }

        //Bắt sự kiện prev song
        prevBtn.onclick = function () {
            if (!app.isRandom) { //nếu không random
                app.prevSong(); //đến đây phải play lại bài mới vì nó đổi suộc nhạc
                progress.value = 0;
                document.documentElement.style.setProperty('--percent', '0%');
                rotateAnimation.play();
            } else {
                app.playRandomSong();
            }
            audio.play();
            app.scrollToActiveSong();
            app.setConfig('currentIndex', app.currentIndex);
        }

        //lắng nghe sự kiện random bật tắt
        randomBtn.onclick = function () {
            app.isRandom = !app.isRandom
            app.setConfig('isRandom', app.isRandom) //lưu vào local storage
            randomBtn.classList.toggle('active');
        }

        //Xử lý song khi end
        audio.onended = function () {
            //khi end, nếu repeat thì phát lại không thì bài next
            if (app.isRepeat) {
                audio.play();
            } else {
                nextBtn.onclick();
            }
        }

        //Xử lý khi bấm lặp lại 1 song
        repeatBtn.onclick = function () {
            app.isRepeat = !app.isRepeat
            app.setConfig('isRepeat', app.isRepeat)
            repeatBtn.classList.toggle('active');
        }

        //Bắt sự kiện chọn song, click ở đâu trong playlist cũng được
        playlist.onclick = function (e) {
            //closest trả về element 1 là chính nó 2 là thẻ cha của nó
            //nếu không thấy element thì trả về null
            //nó sẽ xét chính thằng được click, nếu không có class song thì
            //nó duyệt lên cha lên ông, tìm thằng nào có class song
            //có thể hiểu closest là tìm thằng cha có khớp với selector (class or id)
            if (e.target.closest('.song:not(.activeSong)') || e.target.closest('.option')) { //trừ thằng đang active
                //thằng nào không active hoặc đã active nhưng bấm vào option thì hiện

                //Xử lý khi click vào song => play và load song đó 
                //bonus thêm gán cái index song đó vào local storage
                if (e.target.closest('.song')) {
                    app.currentIndex = Number(e.target.closest('.song').dataset.index);
                    //mục đích đặt attribute là data-... là để dùng data set
                    //chỉ cần vào object dataset, truy vấn các thuộc tính của nó
                    //đã đặt data- thì dùng data set
                    app.loadCurrentSong();
                    app.render();
                    rotateAnimation.play();
                    app.scrollToActiveSong();
                    audio.play();
                    app.setConfig('currentIndex', app.currentIndex);
                    //cái này để gán thuộc tính vào Soundeii_user
                }

                //Xử lý khi click vào option
                if (e.target.closest('.option')) {

                }

            }
        }

        //bắt sự kiện click vào cd thì show bài hát đang phát bằng scrollToView
        cdThumb.onclick = function () {
            app.scrollToActiveSong();
        }

        //bắt sự kiện volume, thay đổi giá trị thanh bar
        progressVolume.oninput = function () {
            //gán giá trị cho biến toàn cục của volumeprogress
            document.documentElement.style.setProperty('--percentVolume', (progressVolume.value) + '%');
            // console.log(progressVolume.value / 100);
            audio.volume = progressVolume.value / 100; //gán volumn vào giá trị mình chọn
            if (audio.volume >= 0.5 && audio.volume <= 1) {
                volume.classList.add('fa-volume-high');
            } else if (audio.volume < 0.5 && audio.volume > 0) {
                volume.classList.remove('fa-volume-high');
                volume.classList.remove('fa-volume-xmark');
                volume.classList.add('fa-volume-low');
            } else {
                volume.classList.remove('fa-volume-low');
                volume.classList.add('fa-volume-xmark');
            }
            app.numVolume = audio.volume;
            // console.log(audio.volume)
        }

        //click để mute
        volume.onclick = function (e) {
            // console.log(e.target);
            //phải bấm vào volumn thì mới ẩn hiện
            if (e.target.classList.contains('icon-volume')) {
                if (volume.classList.contains('disable')) { //nếu đang bị mute
                    audio.volume = app.numVolume;
                    document.documentElement.style.setProperty('--percentVolume', app.numVolume * 100 + '%');
                    progressVolume.value = app.numVolume * 100;
                    // console.log(app.numVolume)
                    volume.classList.remove('disable');
                    volume.classList.remove('fa-volume-xmark');
                    volume.classList.add((app.numVolume < 0.5 ? 'fa-volume-low' : 'fa-volume-high'));
                } else { //nếu đang không mute
                    audio.volume = 0;
                    document.documentElement.style.setProperty('--percentVolume', 0);
                    progressVolume.value = 0;
                    volume.classList.add('disable');
                    volume.classList.add('fa-volume-xmark');
                    volume.classList.remove('fa-volume-high');
                    volume.classList.remove('fa-volume-low');
                }
            }
        }


        // if (isLaptop) {
        volume.onmouseover = function () {
            progressVolume.style.opacity = 1;
        }

        volume.onmouseout = function () {
            progressVolume.style.opacity = 0;
        }
        // }

        //click để change mode
        btnMode.onclick = function (e) {
            app.isDark = !app.isDark;
            console.log(app.isDark);
            const listSong = $$('.song');
            if (e.target.classList.contains('fa-moon')) { //chuyển tối
                iconMode.classList.toggle('fa-sun');
                iconMode.classList.toggle('fa-moon');
                dashboard.style.backgroundColor = black;
                dashboard.style.color = 'white';
                dashboard.style.boxShadow = '0px 1px 5px #292929';
                repeatBtn.style.color = 'white';
                prevBtn.style.color = 'white';
                nextBtn.style.color = 'white';
                randomBtn.style.color = 'white';
                volume.style.color = 'white';
                start.style.color = 'white';
                end.style.color = 'white';
                body.style.backgroundColor = '#111111';
                setTimeout(() => {
                    app.render();
                }, 80);
            } else { //chuyển sáng
                iconMode.classList.toggle('fa-moon');
                iconMode.classList.toggle('fa-sun');
                dashboard.style.boxShadow = '';
                dashboard.style.color = '';
                dashboard.style.backgroundColor = 'white';
                repeatBtn.style.color = '';
                prevBtn.style.color = '';
                nextBtn.style.color = '';
                randomBtn.style.color = '';
                volume.style.color = '';
                start.style.color = '';
                end.style.color = '';
                body.style.backgroundColor = '#e8e8e8';
                setTimeout(() => {
                    app.render();
                }, 80);
            }

        }
    },

    //Xử lý convert giây sang phút giây
    convert: function (seconds) {
        var minutes = Math.floor(seconds / 60);
        var remainingSeconds = Math.floor(seconds % 60);
        return minutes + (remainingSeconds >= 10 ? ':' : ':0') + remainingSeconds;
    },

    //Xử lý next/previous
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
        this.render();
    },

    loadCurrentSong: function () { //load bài hát hiện tại vào UI(giao diện)
        title.innerHTML = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;
        //vì là getter nên auto nó chạy currentSong
    },

    playRandomSong: function () { //generate random index và chạy luôn
        let randomIndex;
        // console.log(this.currentIndex)
        // console.log(this.played)
        do {
            randomIndex = Math.floor(Math.random() * this.songs.length);

            //check xem đã phát chưa
            if (this.played.includes(randomIndex)) { //nếu đã có rồi
                do {
                    console.log('trùng: ' + randomIndex);
                    randomIndex = Math.floor(Math.random() * this.songs.length);
                    if (this.played.length === this.songs.length) {
                        this.played.splice(0, this.played.length);
                    }
                } while (this.played.includes(randomIndex)); //check xem đã phát chưa
                console.log('gán lại ra ' + randomIndex);
                this.played.push(randomIndex);
            } else {
                this.played.push(randomIndex);
            }
        }
        while (randomIndex === this.currentIndex); //check xem có trùng với current không
        console.log(this.played)
        this.currentIndex = randomIndex;
        console.log('hợp lệ: ' + randomIndex);
        this.loadCurrentSong();
        this.render();
    },

    //hàm kéo cái song đang phát lên nếu nó bị khuất
    scrollToActiveSong: function () { //này là 1 HTML DOM element
        setTimeout(function () {
            $('.song.activeSong').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            })
        }, 500)
    },

    start: function () { //hàm tổng
        //hàm này định nghĩa các thuộc tính bonus cho object
        // console.log(this.currentIndex);
        // console.log(this.currentSong);
        this.loadConfig();
        this.define();
        this.render();
        this.loadCurrentSong();
        this.handleEvents();
        this.played.push(this.currentIndex);


        //đoạn này để check xem trạng thái và render ra
        if (this.isRandom) {
            randomBtn.classList.add('active');
        } else {
            randomBtn.classList.remove('active');
        }
        if (this.isRepeat) {
            repeatBtn.classList.add('active');
        } else {
            repeatBtn.classList.remove('active');
        }
        document.documentElement.style.setProperty('--percentVolume', '100%');
    }
}

app.start();