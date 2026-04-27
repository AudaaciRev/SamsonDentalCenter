const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'services', 'ServicesList.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const localImages = [
    '/images/services/gallery-consultation.jpg',
    '/images/services/service-chair-close.jpg',
    '/images/services/service-chair-tree.jpg',
    '/images/services/service-chair-scenic.jpg',
    '/images/services/service-lab-work.jpg',
    '/images/services/service-exam.jpg',
    '/images/services/gallery-chairs-row.jpg',
    '/images/services/gallery-chair-red.jpg',
    '/images/services/gallery-equipment.jpg'
];

let imageIndex = 0;

content = content.replace(/image:\s*'https:\/\/images\.unsplash\.com\/[^']+'/g, (match) => {
    const replacement = `image: '${localImages[imageIndex % localImages.length]}'`;
    imageIndex++;
    return replacement;
});

fs.writeFileSync(filePath, content);
console.log('Replaced ' + imageIndex + ' images in ServicesList.jsx');
