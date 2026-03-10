// imageService.js - Με πολλαπλά fallback URLs
const IMAGES = {
    hotels: [{
            url: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
            fallback: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
        },
        {
            url: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
            fallback: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400",
        },
        {
            url: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg",
            fallback: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400",
        },
        {
            url: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
            fallback: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400",
        },
        {
            url: "https://images.pexels.com/photos/2507010/pexels-photo-2507010.jpeg",
            fallback: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400",
        },
        {
            url: "https://images.pexels.com/photos/2034335/pexels-photo-2034335.jpeg",
            fallback: "https://images.unsplash.com/photo-1455587734955-081b22074882?w=400",
        },
        {
            url: "https://images.pexels.com/photos/2029719/pexels-photo-2029719.jpeg",
            fallback: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400",
        },
        {
            url: "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg",
            fallback: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400",
        },
    ],
    cities: [{
            url: "https://images.pexels.com/photos/161963/chicago-illinois-skyline-skyscrapers-161963.jpeg",
            fallback: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
        },
        {
            url: "https://images.pexels.com/photos/373912/pexels-photo-373912.jpeg",
            fallback: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400",
        },
        {
            url: "https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg",
            fallback: "https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=400",
        },
        {
            url: "https://images.pexels.com/photos/1033729/pexels-photo-1033729.jpeg",
            fallback: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400",
        },
        {
            url: "https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg",
            fallback: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400",
        },
        {
            url: "https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg",
            fallback: "https://images.unsplash.com/photo-1507525425510-1fad9d0a8f1b?w=400",
        },
    ],
    rooms: [{
            url: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg",
            fallback: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400",
        },
        {
            url: "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg",
            fallback: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=400",
        },
        {
            url: "https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg",
            fallback: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400",
        },
        {
            url: "https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg",
            fallback: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400",
        },
    ],
};

class ImageService {
    constructor() {
        this.imageCache = new Map();
        this.failedUrls = new Set();
    }

    // Επιστρέφει μια τυχαία εικόνα με τα URLs της
    getRandomImage(type = "hotel") {
        const images = IMAGES[type] || IMAGES.hotels;
        const randomIndex = Math.floor(Math.random() * images.length);
        return {...images[randomIndex] };
    }

    // Παίρνει τυχαίες εικόνες για ξενοδοχεία
    async getHotelImages(hotelName, count = 3) {
        // Δημιουργούμε ένα seed βασισμένο στο όνομα του ξενοδοχείου για σταθερότητα
        const seed = hotelName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

        // Ανακάτεμα με βάση το seed
        const shuffled = [...IMAGES.hotels]
            .map((img, index) => ({ img, sort: Math.sin(seed + index) }))
            .sort((a, b) => a.sort - b.sort)
            .map((item) => item.img);

        return shuffled.slice(0, count).map((img) => ({
            url: img.url,
            large: img.url,
            original: img.url,
            fallback: img.fallback,
        }));
    }

    // Παίρνει εικόνες για πόλεις
    async getCityImages(cityName) {
        const seed = cityName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const index = Math.abs(seed) % IMAGES.cities.length;
        const cityImg = IMAGES.cities[index];

        return [{
            url: cityImg.url,
            large: cityImg.url,
            fallback: cityImg.fallback,
        }, ];
    }

    // Παίρνει εικόνες για δωμάτια
    async getRoomImages() {
        const shuffled = [...IMAGES.rooms].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 2).map((img) => ({
            url: img.url,
            fallback: img.fallback,
        }));
    }

    // Ελέγχει αν ένα URL έχει αποτύχει στο παρελθόν
    hasFailed(url) {
        return this.failedUrls.has(url);
    }

    // Σημειώνει ένα URL ως αποτυχημένο
    markAsFailed(url) {
        this.failedUrls.add(url);
    }

    // Παίρνει fallback URL για μια εικόνα
    getFallbackUrl(imageObj) {
        if (imageObj && imageObj.fallback) {
            return imageObj.fallback;
        }
        return "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400";
    }
}

const imageServiceInstance = new ImageService();
export default imageServiceInstance;