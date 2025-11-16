/* ==============================================
 * CODE FOR TASK #3: Mock Data Creation & Display Setup
 * This code fetches data from mock.json and renders the cards.
 * ==============================================
 */

// ننتظر حتى يتم تحميل محتوى الصفحة بالكامل
document.addEventListener('DOMContentLoaded', () => {
    
    // نستدعي الدالة التي ستقوم بجلب وعرض البيانات
    renderMockData();

});

/**
 * @function renderMockData
 * يجلب البيانات من data/mock.json ويعرضها كبطاقات
 */
async function renderMockData() {
    
    // 1. نحصل على الحاوية (div) التي سنضيف البطاقات بداخلها
    const gridContainer = document.getElementById('destination-grid');

    // (احتياطي) نتأكد إن الحاوية موجودة قبل ما نكمل
    if (!gridContainer) {
        console.error("Error: Could not find element with id 'destination-grid'");
        return; 
    }

    try {
        // 2. نقرأ ملف mock.json
        const response = await fetch('data/mock.json');
        
        // نتأكد إن الملف اتقرأ بنجاح
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        // نحول الاستجابة إلى JSON
        const destinations = await response.json();

        // 3. نعرض البطاقات
        gridContainer.innerHTML = ''; 

        // 4. نلف على كل "وجهة" (destination) جتلنا من الملف
        destinations.forEach(dest => {
            const card = document.createElement('div');
            card.className = 'card'; // نستخدم نفس اسم الكلاس

            const cardContent = `
                <img src="${dest.img}" alt="${dest.name}">
                <div class="body">
                    <h3>${dest.name}</h3>
                    <p>${dest.desc}</p>
                </div>
            `;
            card.innerHTML = cardContent;
            gridContainer.appendChild(card);
        });

    } catch (error) {
        // لو حصل مشكلة في قراءة الملف، نظهر رسالة في الكونسول
        console.error('Failed to fetch mock data:', error);
        gridContainer.innerHTML = '<p style="color: red; text-align: center;">Error loading destinations. Please try again later.</p>';
    }
}