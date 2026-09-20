document.querySelectorAll('.rig').forEach(rig=>{
  const btn=rig.querySelector('.detail-btn');
  const hide=rig.querySelector('.hide-btn');
  const gpu=rig.querySelector('.gpu-3d');
  btn.addEventListener('click',()=>{
    rig.classList.add('open');
    setTimeout(()=>{rig.scrollIntoView({behavior:'smooth',block:'start'})},120);
  });
  if(hide) hide.addEventListener('click',()=>rig.classList.remove('open'));
  if(gpu){
    document.addEventListener('mousemove',e=>{
      const r=rig.getBoundingClientRect();
      const dx=(e.clientX-(r.left+r.width/2))/r.width;
      const dy=(e.clientY-(r.top+r.height/2))/r.height;
      gpu.style.transform=`rotateY(${dx*22}deg) rotateX(${-dy*22}deg)`;
    });
  }
  const ord=rig.querySelector('.order-pc');
  if(ord) ord.addEventListener('click',()=>{
    const price=rig.querySelector('.rig-price').textContent;
    showToast('Заявка принята: '+price+' (демо — оплата ненастоящая). Жди связи!');
  });
});

const sel=document.getElementById('rig-select');
const btnOrd=document.getElementById('order-btn');
btnOrd.addEventListener('click',()=>{
  const t=sel.options[sel.selectedIndex].text;
  showToast('Заказ на сборку «'+t+'» оформлен (фейк). Пришлём на почту из портфолио. Космос ждёт!');
});

function showToast(txt){
  let t=document.querySelector('.toast');
  if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}
  t.textContent=txt;t.classList.add('show');
  clearTimeout(window.__tt);
  window.__tt=setTimeout(()=>t.classList.remove('show'),3600);
}

const drifts=document.querySelectorAll('.drift');
drifts.forEach(d=>{
  const s=Math.random()*2.5+.6;
  d.style.animationDuration=s+'s';
});
