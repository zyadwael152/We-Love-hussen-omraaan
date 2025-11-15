// INTRO ANIMATION
window.addEventListener('DOMContentLoaded', () => {
    const logo = document.getElementById('introLogo');
    const text = document.getElementById('introText');
    const intro = document.getElementById('intro');

    setTimeout(() => { logo.style.width="80px"; logo.style.opacity=1; }, 100);
    setTimeout(() => { text.style.opacity=1; text.style.transform="translateX(0)"; }, 1100);
    setTimeout(() => { 
        intro.style.opacity=0; 
        intro.style.transition="opacity 0.8s ease";
        setTimeout(()=>{ intro.style.display="none"; }, 800);
    }, 3000);
});

// DATA FOR MODAL
const data = {
    Paris: { img:"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=60", desc:"Paris is known for the Eiffel Tower, rich culture, fashion, and world-class cuisine. Explore art museums, romantic streets, and historical architecture." },
    Dubai: { img:"https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=60", desc:"Dubai offers futuristic skyscrapers, luxury shopping, desert adventures, and amazing nightlife. A perfect blend of modernity and tradition." },
    Maldives: { img:"https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=800&q=60", desc:"The Maldives is famous for crystal-clear waters, private resorts, and tropical marine life. Ideal for relaxation and unforgettable ocean experiences." },
    Tokyo: { img:"https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=800&q=60", desc:"Tokyo is a bustling metropolis where ancient temples sit next to neon-lit skyscrapers. Incredible food scene and unique neighborhoods to explore." }
};

function openModalByTitle(title){
    if(!title || !data[title]) return;
    const modal = document.getElementById('detailModal');
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalImg').src = data[title].img;
    document.getElementById('modalDesc').innerText = data[title].desc;
    modal.style.display='flex';
    modal.setAttribute('aria-hidden','false');
}

document.querySelectorAll('.card').forEach(card=>{
    const title = card.dataset.title;
    card.addEventListener('click',()=>openModalByTitle(title));
    card.addEventListener('keydown',(e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openModalByTitle(title); } });
});

function closeModal(){
    const modal = document.getElementById('detailModal');
    modal.style.display='none';
    modal.setAttribute('aria-hidden','true');
}
document.getElementById('closeBtn').addEventListener('click', closeModal);
document.addEventListener('keydown',(e)=>{ if(e.key==='Escape') closeModal(); });

document.getElementById('bookBtn').addEventListener('click',()=>{
    const title = document.getElementById('modalTitle').innerText || '';
    alert('Booking flow placeholder for: '+title);
});

// Search filter
document.getElementById('searchBtn').addEventListener('click',()=>{
    const q = document.getElementById('searchInput').value.trim().toLowerCase();
    document.querySelectorAll('.card').forEach(card=>{
        const t = (card.dataset.title||'').toLowerCase();
        card.style.display = t.includes(q)? 'flex':'none';
    });
});
