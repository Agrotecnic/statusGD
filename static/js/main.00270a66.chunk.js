(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{18:function(e,t,a){e.exports=a(27)},26:function(e,t,a){},27:function(e,t,a){"use strict";a.r(t);var o=a(1),n=a.n(o),r=a(12),l=a(13),i=a.n(l),d=a(14),c=a(15),s=a(10),p=a.n(s);var m=e=>{let{onImageUpload:t,currentImage:a}=e;const r=Object(o.useCallback)(e=>{const a=e.target.files[0];if(a){const e=new FileReader;e.onloadend=(()=>{t(e.result)}),e.readAsDataURL(a)}},[t]);return n.a.createElement("div",{style:{width:"100%",height:"100%",minHeight:"200px"}},a?n.a.createElement("div",{style:{position:"relative",height:"100%"}},n.a.createElement("img",{src:a,alt:"\xc1rea",style:{width:"100%",height:"100%",objectFit:"cover",borderRadius:"8px"}}),n.a.createElement("input",{type:"file",onChange:r,accept:"image/*",style:{position:"absolute",bottom:"10px",left:"50%",transform:"translateX(-50%)",backgroundColor:"rgba(0,0,0,0.5)",color:"white",padding:"8px",borderRadius:"4px",cursor:"pointer"}})):n.a.createElement("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%"}},n.a.createElement("p",{style:{marginBottom:"10px"}},"Clique para adicionar uma foto"),n.a.createElement("input",{type:"file",onChange:r,accept:"image/*",style:{backgroundColor:"#2563eb",color:"white",padding:"8px",borderRadius:"4px",cursor:"pointer"}})))};var u=e=>{let{title:t,children:a,onClose:o}=e;return n.a.createElement("div",{style:{position:"fixed",top:0,left:0,right:0,bottom:0,backgroundColor:"rgba(0,0,0,0.5)",display:"flex",justifyContent:"center",alignItems:"center",zIndex:1e3}},n.a.createElement("div",{style:{backgroundColor:"white",padding:"24px",borderRadius:"8px",width:"90%",maxWidth:"600px",maxHeight:"90vh",overflow:"auto"}},n.a.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px",borderBottom:"1px solid #e5e7eb",paddingBottom:"16px"}},n.a.createElement("h3",{style:{fontSize:"20px",fontWeight:"600",margin:0}},t),n.a.createElement("button",{onClick:o,style:{border:"none",background:"none",fontSize:"24px",cursor:"pointer",color:"#666"}},"\xd7")),a))},g=a(16),b=a.n(g);var x=e=>{let{initialData:t,onSubmit:a}=e;const[r,l]=Object(o.useState)({...t}),i={button:{backgroundColor:"#2563eb",color:"white",padding:"8px 16px",border:"none",borderRadius:"4px",cursor:"pointer",marginRight:"8px",fontWeight:"500",transition:"background-color 0.2s"},input:{width:"100%",padding:"8px",border:"1px solid #e5e7eb",borderRadius:"4px",marginBottom:"8px",outline:"none",fontSize:"14px"}},d=e=>t=>{l(a=>({...a,[e]:t.target.value}))};return n.a.createElement("form",{onSubmit:async e=>{e.preventDefault();const t=b.a.currentUser();if(t)try{(await fetch("/.netlify/functions/saveData",{method:"POST",body:JSON.stringify(r),headers:{"Content-Type":"application/json",Authorization:`Bearer ${t.token.access_token}`}})).ok?(alert("Dados salvos com sucesso!"),a(r)):alert("Erro ao salvar dados")}catch(o){console.error("Erro:",o),alert("Erro ao enviar dados")}else alert("Por favor, fa\xe7a login primeiro")}},n.a.createElement("div",{style:{marginBottom:"16px"}},n.a.createElement("label",{style:{display:"block",marginBottom:"8px"}},"Nome do Representante",n.a.createElement("input",{value:r.nome,onChange:d("nome"),style:i.input,autoFocus:!0}))),n.a.createElement("div",{style:{marginBottom:"16px"}},n.a.createElement("label",{style:{display:"block",marginBottom:"8px"}},"Regional",n.a.createElement("input",{value:r.regional,onChange:d("regional"),style:i.input}))),n.a.createElement("div",{style:{marginBottom:"16px"}},n.a.createElement("label",{style:{display:"block",marginBottom:"8px"}},"Business Unit",n.a.createElement("input",{value:r.businessUnit,onChange:d("businessUnit"),style:i.input}))),n.a.createElement("div",{style:{marginBottom:"16px"}},n.a.createElement("label",{style:{display:"block",marginBottom:"8px"}},"Data de Atualiza\xe7\xe3o",n.a.createElement("input",{value:r.dataAtualizacao,onChange:d("dataAtualizacao"),style:i.input}))),n.a.createElement("button",{type:"submit",style:i.button},"Salvar"))};var y=e=>{let{initialData:t,onSubmit:a}=e;const[r,l]=Object(o.useState)({...t}),i={button:{backgroundColor:"#2563eb",color:"white",padding:"8px 16px",border:"none",borderRadius:"4px",cursor:"pointer",marginRight:"8px",fontWeight:"500",transition:"background-color 0.2s"},input:{width:"100%",padding:"8px",border:"1px solid #e5e7eb",borderRadius:"4px",marginBottom:"8px",outline:"none",fontSize:"14px"}},d=e=>t=>{l(a=>({...a,[e]:""===t.target.value?0:Number(t.target.value)}))};return n.a.createElement("form",{onSubmit:e=>{e.preventDefault(),a(r)}},n.a.createElement("div",{style:{marginBottom:"16px"}},n.a.createElement("label",{style:{display:"block",marginBottom:"8px"}},"\xc1reas em Acompanhamento",n.a.createElement("input",{type:"number",value:r.emAcompanhamento,onChange:d("emAcompanhamento"),style:i.input,autoFocus:!0}))),n.a.createElement("div",{style:{marginBottom:"16px"}},n.a.createElement("label",{style:{display:"block",marginBottom:"8px"}},"\xc1reas a Implantar",n.a.createElement("input",{type:"number",value:r.aImplantar,onChange:d("aImplantar"),style:i.input}))),n.a.createElement("div",{style:{marginBottom:"16px"}},n.a.createElement("label",{style:{display:"block",marginBottom:"8px"}},"Hectares por \xc1rea",n.a.createElement("input",{type:"number",value:r.hectaresPorArea,onChange:d("hectaresPorArea"),style:i.input}))),n.a.createElement("button",{type:"submit",style:i.button},"Salvar"))};var f=e=>{let{produto:t,onSubmit:a,onRemove:r}=e;const[l,i]=Object(o.useState)({...t}),d={button:{backgroundColor:"#2563eb",color:"white",padding:"8px 16px",border:"none",borderRadius:"4px",cursor:"pointer",marginRight:"8px",fontWeight:"500",transition:"background-color 0.2s"},removeButton:{backgroundColor:"#dc2626",color:"white",padding:"8px 16px",border:"none",borderRadius:"4px",cursor:"pointer",fontWeight:"500",transition:"background-color 0.2s"},input:{width:"100%",padding:"8px",border:"1px solid #e5e7eb",borderRadius:"4px",marginBottom:"8px",outline:"none",fontSize:"14px"}},c=e=>t=>{i(a=>({...a,[e]:"nome"===e?t.target.value:""===t.target.value?0:Number(t.target.value)}))};return n.a.createElement("form",{onSubmit:e=>{e.preventDefault(),a(l)}},n.a.createElement("div",{style:{marginBottom:"16px"}},n.a.createElement("label",{style:{display:"block",marginBottom:"8px"}},"Nome do Produto",n.a.createElement("input",{value:l.nome,onChange:c("nome"),style:d.input,autoFocus:!0}))),n.a.createElement("div",{style:{marginBottom:"16px"}},n.a.createElement("label",{style:{display:"block",marginBottom:"8px"}},"Valor Vendido",n.a.createElement("input",{type:"number",value:l.valorVendido,onChange:c("valorVendido"),style:d.input}))),n.a.createElement("div",{style:{marginBottom:"16px"}},n.a.createElement("label",{style:{display:"block",marginBottom:"8px"}},"Valor Bonificado",n.a.createElement("input",{type:"number",value:l.valorBonificado,onChange:c("valorBonificado"),style:d.input}))),n.a.createElement("div",{style:{marginBottom:"16px"}},n.a.createElement("label",{style:{display:"block",marginBottom:"8px"}},"N\xfamero de \xc1reas",n.a.createElement("input",{type:"number",value:l.areas,onChange:c("areas"),style:d.input}))),n.a.createElement("div",{style:{display:"flex",justifyContent:"space-between"}},n.a.createElement("button",{type:"submit",style:d.button},"Salvar"),n.a.createElement("button",{type:"button",onClick:r,style:d.removeButton},"Remover Produto")))},E=(a(26),a(17)),h=a(6);const v=Object(E.a)({apiKey:"AIzaSyA9kxKwLEdgRUwZNuR7yu7_j_4MUjTrCfg",authDomain:"status-gd.firebaseapp.com",projectId:"status-gd",storageBucket:"status-gd.firebasestorage.app",messagingSenderId:"956818896523",appId:"1:956818896523:web:81509b052009fddb22468e",measurementId:"G-ZS16WZWMPG"}),C=Object(h.b)(v),B=()=>{return n.a.createElement("button",{onClick:window.netlifyIdentity.currentUser()?()=>{console.log("Logout button clicked"),window.netlifyIdentity.logout()}:()=>{console.log("Login button clicked"),window.netlifyIdentity.open()},style:{backgroundColor:"#4CAF50",color:"white",padding:"10px 15px",border:"none",borderRadius:"5px",cursor:"pointer",position:"fixed",top:"20px",left:"20px",zIndex:1e3}},window.netlifyIdentity.currentUser()?"Log Out":"Log In")},k={button:{backgroundColor:"#2563eb",color:"white",padding:"8px 16px",border:"none",borderRadius:"4px",cursor:"pointer",marginRight:"8px",fontWeight:"500",transition:"background-color 0.2s"},card:{backgroundColor:"white",padding:"16px",borderRadius:"8px",boxShadow:"0 1px 3px rgba(0,0,0,0.1)",marginBottom:"16px"},photoContainer:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px",marginBottom:"20px",gridColumn:"span 2"},photoBox:{backgroundColor:"#f3f4f6",padding:"16px",borderRadius:"8px",textAlign:"center",minHeight:"200px",display:"flex",alignItems:"center",justifyContent:"center",border:"2px dashed #d1d5db"}};function w(){const[e,t]=Object(o.useState)(null),[a,r]=Object(o.useState)(!1),[l,s]=Object(o.useState)(null),[g,b]=Object(o.useState)(null),[E,v]=Object(o.useState)({area1:null,area2:null}),[w,S]=Object(o.useState)({nome:"",regional:"",businessUnit:"",dataAtualizacao:""}),[A,R]=Object(o.useState)({emAcompanhamento:0,aImplantar:0,hectaresPorArea:0}),[j,I]=Object(o.useState)([]),[O,z]=Object(o.useState)({totalVendido:0,totalBonificado:0,totalGeral:0,percentualVendido:0,percentualBonificado:0,totalAreas:0,totalHectares:0,valorMedioHectare:0,percentualImplantacao:0,ticketMedio:0,ticketMedioVendido:0,ticketMedioBonificado:0});Object(o.useEffect)(()=>{window.netlifyIdentity&&(window.netlifyIdentity.on("login",e=>t(e)),window.netlifyIdentity.on("logout",()=>t(null)),window.netlifyIdentity.init())},[]),Object(o.useEffect)(()=>{if(e){const t=Object(h.c)(C,`users/${e.id}`);Object(h.a)(t).then(e=>{if(e.exists()){const t=e.val();S(t.vendedorInfo||{}),R(t.areas||{}),I(t.produtos||[]),v(t.images||{})}})}},[e]);const W=Object(o.useCallback)(()=>{if(e){const t=Object(h.c)(C,`users/${e.id}`);Object(h.d)(t,{vendedorInfo:w,areas:A,produtos:j,images:E})}},[e,w,A,j,E]);Object(o.useEffect)(()=>{W()},[W]),Object(o.useEffect)(()=>{const e=j.reduce((e,t)=>e+t.valorVendido,0),t=j.reduce((e,t)=>e+t.valorBonificado,0),a=e+t,o=j.reduce((e,t)=>e+t.areas,0),n=o*A.hectaresPorArea,r=j.filter(e=>e.valorVendido>0),l=j.filter(e=>e.valorBonificado>0);z({totalVendido:e,totalBonificado:t,totalGeral:a,percentualVendido:a?e/a*100:0,percentualBonificado:a?t/a*100:0,totalAreas:o,totalHectares:n,valorMedioHectare:n?a/n:0,percentualImplantacao:A.emAcompanhamento/(A.emAcompanhamento+A.aImplantar)*100,ticketMedio:j.length?a/j.length:0,ticketMedioVendido:r.length?e/r.length:0,ticketMedioBonificado:l.length?t/l.length:0})},[j,A]);const V=Object(o.useCallback)(e=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(e),[]),P=Object(o.useCallback)(e=>`${e.toFixed(1)}%`,[]),D=Object(o.useCallback)((e,t)=>{"produto"===e?b(t.index):s(e)},[]),T=Object(o.useCallback)(()=>{b(null),s(null)},[]),H=Object(o.useCallback)(e=>t=>{v(a=>({...a,[e]:t})),W()},[W]),M=Object(o.useCallback)(()=>{const e={nome:"Novo Produto",valorVendido:0,valorBonificado:0,areas:0};I(t=>[...t,e]),b(j.length)},[j.length]),U=Object(o.useCallback)(()=>{const e=new i.a.Workbook,t=e.addWorksheet("Produtos");t.addRow(["Produto","Valor Vendido","Valor Bonificado","\xc1reas","Total"]),j.forEach(e=>{t.addRow([e.nome,e.valorVendido,e.valorBonificado,e.areas,e.valorVendido+e.valorBonificado])}),t.getColumn(2).numFmt='"R$"#,##0.00',t.getColumn(3).numFmt='"R$"#,##0.00',t.getColumn(5).numFmt='"R$"#,##0.00',e.xlsx.writeBuffer().then(e=>{const t=new Blob([e],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});Object(d.saveAs)(t,"produtos.xlsx")})},[j]),F=Object(o.useCallback)(()=>{r(!0),setTimeout(()=>{const e=document.getElementById("dashboard");p()(e,{scale:2,useCORS:!0,allowTaint:!0,scrollY:-window.scrollY,windowWidth:document.documentElement.offsetWidth,windowHeight:document.documentElement.offsetHeight}).then(e=>{const t=e.toDataURL("image/png"),a=new c.a({orientation:"portrait",unit:"mm",format:"a4"}),o=a.internal.pageSize.getWidth(),n=a.internal.pageSize.getHeight(),l=e.width,i=e.height,d=Math.min(o/l,n/i),s=(o-l*d)/2;a.addImage(t,"PNG",s,0,l*d,i*d),a.save("dashboard.pdf"),r(!1)})},100)},[]),N=Object(o.useCallback)(e=>{S(e),W(),s(null)},[W]),$=Object(o.useCallback)(e=>{R(e),W(),s(null)},[W]),G=Object(o.useCallback)((e,t)=>{const a=[...j];a[t]=e,I(a),W(),b(null)},[j,W]),L=Object(o.useCallback)(e=>{I(j.filter((t,a)=>a!==e)),W(),b(null)},[j,W]);return n.a.createElement("div",null,!a&&n.a.createElement(B,null),n.a.createElement("div",{id:"netlify-modal"}),n.a.createElement("div",{id:"dashboard",className:"print-dashboard",style:{padding:"24px",backgroundColor:"#f3f4f6",minHeight:"100vh",position:"relative",width:"100%",margin:"0 auto"}},!a&&n.a.createElement("div",{style:{position:"fixed",top:"20px",right:"20px",display:"flex",gap:"8px",zIndex:900}},n.a.createElement("button",{onClick:M,style:k.button},"Adicionar Produto"),n.a.createElement("button",{onClick:()=>D("areas",A),style:k.button},"Editar \xc1reas"),n.a.createElement("button",{onClick:U,style:k.button},"Exportar para Excel"),n.a.createElement("button",{onClick:F,style:k.button},"Exportar para PDF")),n.a.createElement("div",{style:{maxWidth:"1400px",margin:"0 auto",backgroundColor:"white",borderRadius:"12px",padding:"24px",boxShadow:"0 1px 3px rgba(0,0,0,0.1)"}},n.a.createElement("div",{style:{marginBottom:"24px",borderBottom:"1px solid #e5e7eb",paddingBottom:"16px",position:"relative"}},n.a.createElement("button",{onClick:()=>D("info",w),style:{...k.button,position:"absolute",right:"0",top:"0"}},"Editar"),n.a.createElement("h1",{style:{fontSize:"28px",fontWeight:"bold",textAlign:"center",marginBottom:"16px",color:"#1f2937"}},"Status Gera\xe7\xe3o de Demanda"),n.a.createElement("div",{style:{display:"flex",justifyContent:"center",gap:"32px"}},n.a.createElement("div",{style:{textAlign:"center"}},n.a.createElement("p",{style:{color:"#6b7280",fontSize:"14px"}},"Representante"),n.a.createElement("p",{style:{color:"#1f2937",fontWeight:"600"}},w.nome)),n.a.createElement("div",{style:{textAlign:"center"}},n.a.createElement("p",{style:{color:"#6b7280",fontSize:"14px"}},"Regional"),n.a.createElement("p",{style:{color:"#1f2937",fontWeight:"600"}},w.regional)),n.a.createElement("div",{style:{textAlign:"center"}},n.a.createElement("p",{style:{color:"#6b7280",fontSize:"14px"}},"Business Unit"),n.a.createElement("p",{style:{color:"#1f2937",fontWeight:"600"}},w.businessUnit)),n.a.createElement("div",{style:{textAlign:"center"}},n.a.createElement("p",{style:{color:"#6b7280",fontSize:"14px"}},"Atualizado em"),n.a.createElement("p",{style:{color:"#1f2937",fontWeight:"600"}},w.dataAtualizacao)))),n.a.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px",marginBottom:"20px"}},n.a.createElement("div",{style:k.card},n.a.createElement("h2",{style:{fontSize:"20px",fontWeight:"600",marginBottom:"16px"}},"Status das \xc1reas"),n.a.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"16px"}},n.a.createElement("div",{style:{backgroundColor:"#f0f9ff",padding:"16px",borderRadius:"8px",textAlign:"center"}},n.a.createElement("p",{style:{fontSize:"24px",fontWeight:"bold",color:"#0369a1"}},A.emAcompanhamento),n.a.createElement("p",{style:{color:"#1f2937"}},"Em Acompanhamento"),n.a.createElement("p",{style:{color:"#64748b",fontSize:"12px"}},A.emAcompanhamento*A.hectaresPorArea," hectares")),n.a.createElement("div",{style:{backgroundColor:"#fef9c3",padding:"16px",borderRadius:"8px",textAlign:"center"}},n.a.createElement("p",{style:{fontSize:"24px",fontWeight:"bold",color:"#ca8a04"}},A.aImplantar),n.a.createElement("p",{style:{color:"#1f2937"}},"A Implantar"),n.a.createElement("p",{style:{color:"#64748b",fontSize:"12px"}},A.aImplantar*A.hectaresPorArea," hectares"))),n.a.createElement("div",{style:{marginTop:"12px"}},n.a.createElement("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"4px"}},n.a.createElement("span",{style:{fontSize:"14px"}},"Progresso da Implanta\xe7\xe3o"),n.a.createElement("span",{style:{fontSize:"14px"}},P(O.percentualImplantacao))),n.a.createElement("div",{style:{width:"100%",height:"8px",backgroundColor:"#e5e7eb",borderRadius:"9999px",overflow:"hidden"}},n.a.createElement("div",{style:{width:`${O.percentualImplantacao}%`,height:"100%",backgroundColor:"#0369a1",borderRadius:"9999px"}})))),n.a.createElement("div",{style:k.card},n.a.createElement("h2",{style:{fontSize:"20px",fontWeight:"600",marginBottom:"16px"}},"Distribui\xe7\xe3o de Valores"),n.a.createElement("div",{style:{display:"flex",flexDirection:"column",gap:"12px"}},n.a.createElement("div",null,n.a.createElement("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"4px"}},n.a.createElement("span",{style:{color:"#2563eb"}},"Vendido"),n.a.createElement("span",{style:{fontWeight:"bold"}},V(O.totalVendido))),n.a.createElement("div",{style:{width:"100%",height:"8px",backgroundColor:"#e5e7eb",borderRadius:"9999px"}},n.a.createElement("div",{style:{width:`${O.percentualVendido}%`,backgroundColor:"#2563eb",height:"100%",borderRadius:"9999px"}}))),n.a.createElement("div",null,n.a.createElement("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"4px"}},n.a.createElement("span",{style:{color:"#16a34a"}},"Bonificado"),n.a.createElement("span",{style:{fontWeight:"bold"}},V(O.totalBonificado))),n.a.createElement("div",{style:{width:"100%",height:"8px",backgroundColor:"#e5e7eb",borderRadius:"9999px"}},n.a.createElement("div",{style:{width:`${O.percentualBonificado}%`,backgroundColor:"#16a34a",height:"100%",borderRadius:"9999px"}}))),n.a.createElement("div",{style:{textAlign:"center",marginTop:"8px",padding:"12px",backgroundColor:"#f8fafc",borderRadius:"8px"}},n.a.createElement("p",{style:{color:"#6b7280",marginBottom:"4px"}},"Valor Total"),n.a.createElement("p",{style:{fontSize:"24px",fontWeight:"bold",color:"#1f2937"}},V(O.totalGeral))))),n.a.createElement("div",{style:{...k.card,gridColumn:"span 2"}},n.a.createElement("h2",{style:{fontSize:"20px",fontWeight:"600",marginBottom:"16px"}},"Detalhamento por Produto"),n.a.createElement("div",{style:{overflowX:"auto"}},n.a.createElement("table",{style:{width:"100%",borderCollapse:"collapse"}},n.a.createElement("thead",null,n.a.createElement("tr",null,n.a.createElement("th",{style:{textAlign:"left",padding:"12px",borderBottom:"2px solid #e5e7eb"}},"Produto"),n.a.createElement("th",{style:{textAlign:"right",padding:"12px",borderBottom:"2px solid #e5e7eb"}},"Valor Vendido"),n.a.createElement("th",{style:{textAlign:"right",padding:"12px",borderBottom:"2px solid #e5e7eb"}},"Valor Bonificado"),n.a.createElement("th",{style:{textAlign:"center",padding:"12px",borderBottom:"2px solid #e5e7eb"}},"\xc1reas"),n.a.createElement("th",{style:{textAlign:"right",padding:"12px",borderBottom:"2px solid #e5e7eb"}},"Total"),!a&&n.a.createElement("th",{style:{textAlign:"center",padding:"12px",borderBottom:"2px solid #e5e7eb"}},"A\xe7\xf5es"))),n.a.createElement("tbody",null,j.map((e,t)=>n.a.createElement("tr",{key:t,style:{backgroundColor:t%2===0?"white":"#f8fafc"}},n.a.createElement("td",{style:{padding:"12px",borderBottom:"1px solid #e5e7eb"}},e.nome),n.a.createElement("td",{style:{padding:"12px",textAlign:"right",borderBottom:"1px solid #e5e7eb",color:"#2563eb"}},e.valorVendido>0?V(e.valorVendido):"-"),n.a.createElement("td",{style:{padding:"12px",textAlign:"right",borderBottom:"1px solid #e5e7eb",color:"#16a34a"}},e.valorBonificado>0?V(e.valorBonificado):"-"),n.a.createElement("td",{style:{padding:"12px",textAlign:"center",borderBottom:"1px solid #e5e7eb"}},e.areas),n.a.createElement("td",{style:{padding:"12px",textAlign:"right",borderBottom:"1px solid #e5e7eb",fontWeight:"bold"}},V(e.valorVendido+e.valorBonificado)),!a&&n.a.createElement("td",{style:{padding:"12px",textAlign:"center",borderBottom:"1px solid #e5e7eb"}},n.a.createElement("button",{onClick:()=>D("produto",{...e,index:t}),style:{padding:"4px 8px",backgroundColor:"#2563eb",color:"white",border:"none",borderRadius:"4px",cursor:"pointer"}},"Editar")))),n.a.createElement("tr",{style:{backgroundColor:"#f8fafc",fontWeight:"bold"}},n.a.createElement("td",{style:{padding:"12px"}},"Total Geral"),n.a.createElement("td",{style:{padding:"12px",textAlign:"right",color:"#2563eb"}},V(O.totalVendido)),n.a.createElement("td",{style:{padding:"12px",textAlign:"right",color:"#16a34a"}},V(O.totalBonificado)),n.a.createElement("td",{style:{padding:"12px",textAlign:"center"}},O.totalAreas),n.a.createElement("td",{style:{padding:"12px",textAlign:"right"}},V(O.totalGeral)),!a&&n.a.createElement("td",null)))))),n.a.createElement("div",{style:{...k.card,gridColumn:"span 2"}},n.a.createElement("h2",{style:{fontSize:"20px",fontWeight:"600",marginBottom:"16px"}},"Indicadores Chave"),n.a.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:"16px"}},n.a.createElement("div",{style:{backgroundColor:"#f0f9ff",padding:"16px",borderRadius:"8px",textAlign:"center"}},n.a.createElement("p",{style:{color:"#1f2937"}},"Valor M\xe9dio/Hectare"),n.a.createElement("p",{style:{fontSize:"24px",fontWeight:"bold",color:"#0369a1"}},V(O.valorMedioHectare))),n.a.createElement("div",{style:{backgroundColor:"#f0fdf4",padding:"16px",borderRadius:"8px",textAlign:"center"}},n.a.createElement("p",{style:{color:"#1f2937"}},"Total Hectares"),n.a.createElement("p",{style:{fontSize:"24px",fontWeight:"bold",color:"#16a34a"}},O.totalHectares)),n.a.createElement("div",{style:{backgroundColor:"#fef9c3",padding:"16px",borderRadius:"8px",textAlign:"center"}},n.a.createElement("p",{style:{color:"#1f2937"}},"Ticket M\xe9dio"),n.a.createElement("p",{style:{fontSize:"24px",fontWeight:"bold",color:"#ca8a04"}},V(O.ticketMedio))))),n.a.createElement("div",{style:k.photoContainer},n.a.createElement("div",{style:k.photoBox},n.a.createElement(m,{onImageUpload:H("area1"),currentImage:E.area1})),n.a.createElement("div",{style:k.photoBox},n.a.createElement(m,{onImageUpload:H("area2"),currentImage:E.area2})))))),"info"===l&&n.a.createElement(u,{title:"Editar Informa\xe7\xf5es",onClose:T},n.a.createElement(x,{initialData:w,onSubmit:N})),"areas"===l&&n.a.createElement(u,{title:"Editar \xc1reas",onClose:T},n.a.createElement(y,{initialData:A,onSubmit:$})),null!==g&&n.a.createElement(u,{title:"Editar Produto",onClose:T},n.a.createElement(f,{produto:j[g],onSubmit:e=>G(e,g),onRemove:()=>L(g)})))}const S=document.getElementById("root");Object(r.createRoot)(S).render(n.a.createElement(n.a.StrictMode,null,n.a.createElement(w,null)))}},[[18,1,2]]]);
//# sourceMappingURL=main.00270a66.chunk.js.map