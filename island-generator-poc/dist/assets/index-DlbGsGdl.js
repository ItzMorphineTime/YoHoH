(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();const fu=Math.sqrt(3),Ud=.5*(fu-1),Ls=(3-fu)/6,gl=s=>Math.floor(s)|0,vl=new Float64Array([1,1,-1,1,1,-1,-1,-1,1,0,-1,0,1,0,-1,0,0,1,0,-1,0,1,0,-1]);function Fd(s=Math.random){const e=Nd(s),t=new Float64Array(e).map(i=>vl[i%12*2]),n=new Float64Array(e).map(i=>vl[i%12*2+1]);return function(r,o){let a=0,l=0,c=0;const h=(r+o)*Ud,u=gl(r+h),d=gl(o+h),f=(u+d)*Ls,g=u-f,v=d-f,m=r-g,p=o-v;let _,x;m>p?(_=1,x=0):(_=0,x=1);const M=m-_+Ls,y=p-x+Ls,b=m-1+2*Ls,T=p-1+2*Ls,L=u&255,S=d&255;let E=.5-m*m-p*p;if(E>=0){const z=L+e[S],D=t[z],N=n[z];E*=E,a=E*E*(D*m+N*p)}let C=.5-M*M-y*y;if(C>=0){const z=L+_+e[S+x],D=t[z],N=n[z];C*=C,l=C*C*(D*M+N*y)}let U=.5-b*b-T*T;if(U>=0){const z=L+1+e[S+1],D=t[z],N=n[z];U*=U,c=U*U*(D*b+N*T)}return 70*(a+l+c)}}function Nd(s){const t=new Uint8Array(512);for(let n=0;n<512/2;n++)t[n]=n;for(let n=0;n<512/2-1;n++){const i=n+~~(s()*(256-n)),r=t[n];t[n]=t[i],t[i]=r}for(let n=256;n<512;n++)t[n]=t[n-256];return t}class Od{constructor(e=null){this.seed=e??Math.floor(Math.random()*4294967295),this.state=this.seed}next(){let e=this.state+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}nextInt(e,t){return Math.floor(this.next()*(t-e+1))+e}nextFloat(e,t){return e+this.next()*(t-e)}reset(){this.state=this.seed}getSeed(){return this.seed}}const ar={prefix:["Dead Man's","Skull","Devil's","Black","Blood","Rum","Treasure","Ghost","Cursed","Hidden"],body:["Cay","Island","Key","Reef","Harbor","Cove","Port","Bay","Sands","Rock"]};function Ba(s={}){const{gridSize:e=128,tileSize:t=8,elevationScale:n=1.2,islandRadius:i=.42,noiseOctaves:r=5,frequency:o=2.2,persistence:a=.45,lacunarity:l=2.1,seed:c=null,seaLevel:h=.12,coastFalloff:u=2.2,coastIrregularity:d=.35,elongation:f=.5,terrainRoughness:g=.7,tileVariation:v=0,chunkSize:m}=s,p=Math.max(2,Math.min(Math.floor(e/2),t??m??8)),_=Math.floor(e/p),x=Math.floor(e/p),M=_*p,y=new Od(c),b=y.getSeed(),T=Fd(()=>y.next()),L=f<=.5?1+(.5-f)*1.5:1,S=f>=.5?1+(f-.5)*1.5:1,E=[];for(let V=0;V<x;V++){const J=[];for(let ce=0;ce<_;ce++){const ve=(ce+.5)/_-.5,fe=(V+.5)/x-.5,Se=ve/L,Pe=fe/S,Ee=Math.sqrt(Se*Se+Pe*Pe),We=d>0?T(ve*8+b*.01,fe*8+b*.02)*d:0,W=i*.5*(1+We),_t=Ee/W,Ae=Math.max(0,1-Math.pow(_t,u));let De=0,Me=1,st=o,Oe=0;for(let w=0;w<r;w++){const G=ve*st*_*.02+b*.001+w*50,re=fe*st*x*.02+b*.002+w*70;De+=T(G,re)*Me,Oe+=Me,Me*=a,st*=l}De=(De/Oe+1)*.5;const R=Math.max(0,De*Ae*n*g+h);J.push(R)}E.push(J)}const C=[];for(let V=0;V<=M;V++){const J=[];for(let ce=0;ce<=M;ce++){const ve=Math.min(_-1,Math.floor(ce/p)),fe=Math.min(x-1,Math.floor(V/p));let Se=E[fe][ve];if(v>0){const Pe=ce/M-.5,Ee=V/M-.5,We=T(Pe*20+b*.01,Ee*20+b*.02)*v;Se=Math.max(0,Se+We)}J.push(Se)}C.push(J)}const U=y.next()<.15,z=!U&&y.next()<.25,D=`${ar.prefix[Math.floor(y.next()*ar.prefix.length)]} ${ar.body[Math.floor(y.next()*ar.body.length)]}`,N=U?"A treacherous place. Sailors speak of it in hushed tones.":z?"A welcoming port with fair winds and friendly faces.":"An unremarkable stop along the trade routes.",H=U?Math.min(3,1+Math.floor(y.next()*2)):Math.floor(y.next()*2),Z=y.next(),B=z&&Z<.6?Z<.3?"harbor":"outpost":Z<.2?"outpost":"none",X=["none","reefs","storms","treacherous"],$=U&&y.next()<.6?X[1+Math.floor(y.next()*3)]:"none",te=["neutral","british","spanish","french","pirate"],Q=te[Math.floor(y.next()*te.length)];return{heightMap:C,config:{gridSize:M,tileSize:p,tilesX:_,tilesY:x,elevationScale:n,islandRadius:i,noiseOctaves:r,frequency:o,persistence:a,lacunarity:l,seaLevel:h,coastFalloff:u,coastIrregularity:d,elongation:f,terrainRoughness:g,tileVariation:v,chunkSize:p},seed:b,name:D,description:N,dangerous:U,appealing:z,treasureLevel:H,portType:B,hazard:$,faction:Q,rumors:""}}/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const za="160",sn={ROTATE:0,DOLLY:1,PAN:2},Vi={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Bd=0,_l=1,zd=2,Hd=0,pu=1,kd=2,Wn=3,di=0,Jt=1,rn=2,Wt=0,ms=1,_a=2,xl=3,Ml=4,mu=5,Xn=100,Vd=101,Gd=102,yl=103,Sl=104,xa=200,Wd=201,Xd=202,Yd=203,Ma=204,ya=205,gu=206,jd=207,vu=208,qd=209,Zd=210,Kd=211,$d=212,Qd=213,Jd=214,ef=0,tf=1,nf=2,Kr=3,sf=4,rf=5,of=6,af=7,ao=0,lf=1,cf=2,ci=0,_u=1,xu=2,Mu=3,Ha=4,hf=5,yu=6,El="attached",uf="detached",Su=300,xs=301,Ms=302,$r=303,Sa=304,lo=306,Di=1e3,on=1001,Ea=1002,Lt=1003,bl=1004,So=1005,dn=1006,df=1007,Xs=1008,hi=1009,ff=1010,pf=1011,ka=1012,Eu=1013,si=1014,Dn=1015,wn=1016,bu=1017,Tu=1018,ui=1020,mf=1021,pn=1023,wu=1024,gf=1025,Pi=1026,Ui=1027,Au=1028,Pu=1029,vf=1030,Ru=1031,Cu=1033,Eo=33776,bo=33777,To=33778,wo=33779,Tl=35840,wl=35841,Al=35842,Pl=35843,Lu=36196,Rl=37492,Cl=37496,Ll=37808,Il=37809,Dl=37810,Ul=37811,Fl=37812,Nl=37813,Ol=37814,Bl=37815,zl=37816,Hl=37817,kl=37818,Vl=37819,Gl=37820,Wl=37821,Ao=36492,Xl=36494,Yl=36495,_f=36283,jl=36284,ql=36285,Zl=36286,Qr=2300,Jr=2301,Po=2302,Kl=2400,$l=2401,Ql=2402,xf=2500,Iu=3e3,Ri=3001,Mf=3200,yf=3201,co=0,Sf=1,mn="",Pt="srgb",jn="srgb-linear",Va="display-p3",ho="display-p3-linear",eo="linear",dt="srgb",to="rec709",no="p3",Gi=7680,Jl=519,Ef=512,bf=513,Tf=514,Du=515,wf=516,Af=517,Pf=518,Rf=519,ec=35044,tc="300 es",ba=1035,Yn=2e3,io=2001;class Bi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const i=this._listeners[e];if(i!==void 0){const r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,e);e.target=null}}}const kt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let nc=1234567;const gs=Math.PI/180,ys=180/Math.PI;function pi(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(kt[s&255]+kt[s>>8&255]+kt[s>>16&255]+kt[s>>24&255]+"-"+kt[e&255]+kt[e>>8&255]+"-"+kt[e>>16&15|64]+kt[e>>24&255]+"-"+kt[t&63|128]+kt[t>>8&255]+"-"+kt[t>>16&255]+kt[t>>24&255]+kt[n&255]+kt[n>>8&255]+kt[n>>16&255]+kt[n>>24&255]).toLowerCase()}function Ot(s,e,t){return Math.max(e,Math.min(t,s))}function Ga(s,e){return(s%e+e)%e}function Cf(s,e,t,n,i){return n+(s-e)*(i-n)/(t-e)}function Lf(s,e,t){return s!==e?(t-s)/(e-s):0}function ks(s,e,t){return(1-t)*s+t*e}function If(s,e,t,n){return ks(s,e,1-Math.exp(-t*n))}function Df(s,e=1){return e-Math.abs(Ga(s,e*2)-e)}function Uf(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*(3-2*s))}function Ff(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*s*(s*(s*6-15)+10))}function Nf(s,e){return s+Math.floor(Math.random()*(e-s+1))}function Of(s,e){return s+Math.random()*(e-s)}function Bf(s){return s*(.5-Math.random())}function zf(s){s!==void 0&&(nc=s);let e=nc+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Hf(s){return s*gs}function kf(s){return s*ys}function Ta(s){return(s&s-1)===0&&s!==0}function Vf(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function so(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function Gf(s,e,t,n,i){const r=Math.cos,o=Math.sin,a=r(t/2),l=o(t/2),c=r((e+n)/2),h=o((e+n)/2),u=r((e-n)/2),d=o((e-n)/2),f=r((n-e)/2),g=o((n-e)/2);switch(i){case"XYX":s.set(a*h,l*u,l*d,a*c);break;case"YZY":s.set(l*d,a*h,l*u,a*c);break;case"ZXZ":s.set(l*u,l*d,a*h,a*c);break;case"XZX":s.set(a*h,l*g,l*f,a*c);break;case"YXY":s.set(l*f,a*h,l*g,a*c);break;case"ZYZ":s.set(l*g,l*f,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function ls(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function jt(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const zt={DEG2RAD:gs,RAD2DEG:ys,generateUUID:pi,clamp:Ot,euclideanModulo:Ga,mapLinear:Cf,inverseLerp:Lf,lerp:ks,damp:If,pingpong:Df,smoothstep:Uf,smootherstep:Ff,randInt:Nf,randFloat:Of,randFloatSpread:Bf,seededRandom:zf,degToRad:Hf,radToDeg:kf,isPowerOfTwo:Ta,ceilPowerOfTwo:Vf,floorPowerOfTwo:so,setQuaternionFromProperEuler:Gf,normalize:jt,denormalize:ls};class _e{constructor(e=0,t=0){_e.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ot(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*i+e.x,this.y=r*i+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Qe{constructor(e,t,n,i,r,o,a,l,c){Qe.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,o,a,l,c)}set(e,t,n,i,r,o,a,l,c){const h=this.elements;return h[0]=e,h[1]=i,h[2]=a,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],g=n[8],v=i[0],m=i[3],p=i[6],_=i[1],x=i[4],M=i[7],y=i[2],b=i[5],T=i[8];return r[0]=o*v+a*_+l*y,r[3]=o*m+a*x+l*b,r[6]=o*p+a*M+l*T,r[1]=c*v+h*_+u*y,r[4]=c*m+h*x+u*b,r[7]=c*p+h*M+u*T,r[2]=d*v+f*_+g*y,r[5]=d*m+f*x+g*b,r[8]=d*p+f*M+g*T,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8];return t*o*h-t*a*c-n*r*h+n*a*l+i*r*c-i*o*l}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=h*o-a*c,d=a*l-h*r,f=c*r-o*l,g=t*u+n*d+i*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return e[0]=u*v,e[1]=(i*c-h*n)*v,e[2]=(a*n-i*o)*v,e[3]=d*v,e[4]=(h*t-i*l)*v,e[5]=(i*r-a*t)*v,e[6]=f*v,e[7]=(n*l-c*t)*v,e[8]=(o*t-n*r)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-i*c,i*l,-i*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(Ro.makeScale(e,t)),this}rotate(e){return this.premultiply(Ro.makeRotation(-e)),this}translate(e,t){return this.premultiply(Ro.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Ro=new Qe;function Uu(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function Ys(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Wf(){const s=Ys("canvas");return s.style.display="block",s}const ic={};function Vs(s){s in ic||(ic[s]=!0,console.warn(s))}const sc=new Qe().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),rc=new Qe().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),lr={[jn]:{transfer:eo,primaries:to,toReference:s=>s,fromReference:s=>s},[Pt]:{transfer:dt,primaries:to,toReference:s=>s.convertSRGBToLinear(),fromReference:s=>s.convertLinearToSRGB()},[ho]:{transfer:eo,primaries:no,toReference:s=>s.applyMatrix3(rc),fromReference:s=>s.applyMatrix3(sc)},[Va]:{transfer:dt,primaries:no,toReference:s=>s.convertSRGBToLinear().applyMatrix3(rc),fromReference:s=>s.applyMatrix3(sc).convertLinearToSRGB()}},Xf=new Set([jn,ho]),lt={enabled:!0,_workingColorSpace:jn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(s){if(!Xf.has(s))throw new Error(`Unsupported working color space, "${s}".`);this._workingColorSpace=s},convert:function(s,e,t){if(this.enabled===!1||e===t||!e||!t)return s;const n=lr[e].toReference,i=lr[t].fromReference;return i(n(s))},fromWorkingColorSpace:function(s,e){return this.convert(s,this._workingColorSpace,e)},toWorkingColorSpace:function(s,e){return this.convert(s,e,this._workingColorSpace)},getPrimaries:function(s){return lr[s].primaries},getTransfer:function(s){return s===mn?eo:lr[s].transfer}};function vs(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Co(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let Wi;class Fu{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Wi===void 0&&(Wi=Ys("canvas")),Wi.width=e.width,Wi.height=e.height;const n=Wi.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=Wi}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Ys("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=vs(r[o]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(vs(t[n]/255)*255):t[n]=vs(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Yf=0;class Nu{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Yf++}),this.uuid=pi(),this.data=e,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?r.push(Lo(i[o].image)):r.push(Lo(i[o]))}else r=Lo(i);n.url=r}return t||(e.images[this.uuid]=n),n}}function Lo(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?Fu.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let jf=0;class Bt extends Bi{constructor(e=Bt.DEFAULT_IMAGE,t=Bt.DEFAULT_MAPPING,n=on,i=on,r=dn,o=Xs,a=pn,l=hi,c=Bt.DEFAULT_ANISOTROPY,h=mn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:jf++}),this.uuid=pi(),this.name="",this.source=new Nu(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new _e(0,0),this.repeat=new _e(1,1),this.center=new _e(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Qe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(Vs("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===Ri?Pt:mn),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Su)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Di:e.x=e.x-Math.floor(e.x);break;case on:e.x=e.x<0?0:1;break;case Ea:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Di:e.y=e.y-Math.floor(e.y);break;case on:e.y=e.y<0?0:1;break;case Ea:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return Vs("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Pt?Ri:Iu}set encoding(e){Vs("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=e===Ri?Pt:mn}}Bt.DEFAULT_IMAGE=null;Bt.DEFAULT_MAPPING=Su;Bt.DEFAULT_ANISOTROPY=1;class at{constructor(e=0,t=0,n=0,i=1){at.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*i+o[15]*r,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r;const l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],g=l[9],v=l[2],m=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+v)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const x=(c+1)/2,M=(f+1)/2,y=(p+1)/2,b=(h+d)/4,T=(u+v)/4,L=(g+m)/4;return x>M&&x>y?x<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(x),i=b/n,r=T/n):M>y?M<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(M),n=b/i,r=L/i):y<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(y),n=T/r,i=L/r),this.set(n,i,r,t),this}let _=Math.sqrt((m-g)*(m-g)+(u-v)*(u-v)+(d-h)*(d-h));return Math.abs(_)<.001&&(_=1),this.x=(m-g)/_,this.y=(u-v)/_,this.z=(d-h)/_,this.w=Math.acos((c+f+p-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class qf extends Bi{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new at(0,0,e,t),this.scissorTest=!1,this.viewport=new at(0,0,e,t);const i={width:e,height:t,depth:1};n.encoding!==void 0&&(Vs("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===Ri?Pt:mn),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:dn,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new Bt(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(e,t,n=1){(this.width!==e||this.height!==t||this.depth!==n)&&(this.width=e,this.height=t,this.depth=n,this.texture.image.width=e,this.texture.image.height=t,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.texture.isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Nu(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ln extends qf{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Ou extends Bt{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Lt,this.minFilter=Lt,this.wrapR=on,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Zf extends Bt{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Lt,this.minFilter=Lt,this.wrapR=on,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ft{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,o,a){let l=n[i+0],c=n[i+1],h=n[i+2],u=n[i+3];const d=r[o+0],f=r[o+1],g=r[o+2],v=r[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u;return}if(a===1){e[t+0]=d,e[t+1]=f,e[t+2]=g,e[t+3]=v;return}if(u!==v||l!==d||c!==f||h!==g){let m=1-a;const p=l*d+c*f+h*g+u*v,_=p>=0?1:-1,x=1-p*p;if(x>Number.EPSILON){const y=Math.sqrt(x),b=Math.atan2(y,p*_);m=Math.sin(m*b)/y,a=Math.sin(a*b)/y}const M=a*_;if(l=l*m+d*M,c=c*m+f*M,h=h*m+g*M,u=u*m+v*M,m===1-a){const y=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=y,c*=y,h*=y,u*=y}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,i,r,o){const a=n[i],l=n[i+1],c=n[i+2],h=n[i+3],u=r[o],d=r[o+1],f=r[o+2],g=r[o+3];return e[t]=a*g+h*u+l*f-c*d,e[t+1]=l*g+h*d+c*u-a*f,e[t+2]=c*g+h*f+a*d-l*u,e[t+3]=h*g-a*u-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(i/2),u=a(r/2),d=l(n/2),f=l(i/2),g=l(r/2);switch(o){case"XYZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"YZX":this._x=d*h*u+c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u-d*f*g;break;case"XZY":this._x=d*h*u-c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=n+a+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(o-i)*f}else if(n>a&&n>u){const f=2*Math.sqrt(1+n-a-u);this._w=(h-l)/f,this._x=.25*f,this._y=(i+o)/f,this._z=(r+c)/f}else if(a>u){const f=2*Math.sqrt(1+a-n-u);this._w=(r-c)/f,this._x=(i+o)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+u-n-a);this._w=(o-i)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ot(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+o*a+i*c-r*l,this._y=i*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-i*a,this._w=o*h-n*a-i*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,i=this._y,r=this._z,o=this._w;let a=o*e._w+n*e._x+i*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=i,this._z=r,this;const l=1-a*a;if(l<=Number.EPSILON){const f=1-t;return this._w=f*o+t*this._w,this._x=f*n+t*this._x,this._y=f*i+t*this._y,this._z=f*r+t*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-t)*h)/c,d=Math.sin(t*h)/c;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=i*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=Math.random(),t=Math.sqrt(1-e),n=Math.sqrt(e),i=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(t*Math.cos(i),n*Math.sin(r),n*Math.cos(r),t*Math.sin(i))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class I{constructor(e=0,t=0,n=0){I.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(oc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(oc.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*i-a*n),h=2*(a*t-r*i),u=2*(r*n-o*t);return this.x=t+l*c+o*u-a*h,this.y=n+l*h+a*c-r*u,this.z=i+l*u+r*h-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=i*l-r*a,this.y=r*o-n*l,this.z=n*a-i*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Io.copy(this).projectOnVector(e),this.sub(Io)}reflect(e){return this.sub(Io.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ot(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=(Math.random()-.5)*2,t=Math.random()*Math.PI*2,n=Math.sqrt(1-e**2);return this.x=n*Math.cos(t),this.y=n*Math.sin(t),this.z=e,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Io=new I,oc=new ft;class zi{constructor(e=new I(1/0,1/0,1/0),t=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(vn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(vn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=vn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,vn):vn.fromBufferAttribute(r,o),vn.applyMatrix4(e.matrixWorld),this.expandByPoint(vn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),cr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),cr.copy(n.boundingBox)),cr.applyMatrix4(e.matrixWorld),this.union(cr)}const i=e.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,vn),vn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Is),hr.subVectors(this.max,Is),Xi.subVectors(e.a,Is),Yi.subVectors(e.b,Is),ji.subVectors(e.c,Is),qn.subVectors(Yi,Xi),Zn.subVectors(ji,Yi),xi.subVectors(Xi,ji);let t=[0,-qn.z,qn.y,0,-Zn.z,Zn.y,0,-xi.z,xi.y,qn.z,0,-qn.x,Zn.z,0,-Zn.x,xi.z,0,-xi.x,-qn.y,qn.x,0,-Zn.y,Zn.x,0,-xi.y,xi.x,0];return!Do(t,Xi,Yi,ji,hr)||(t=[1,0,0,0,1,0,0,0,1],!Do(t,Xi,Yi,ji,hr))?!1:(ur.crossVectors(qn,Zn),t=[ur.x,ur.y,ur.z],Do(t,Xi,Yi,ji,hr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,vn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(vn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Bn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Bn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Bn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Bn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Bn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Bn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Bn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Bn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Bn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Bn=[new I,new I,new I,new I,new I,new I,new I,new I],vn=new I,cr=new zi,Xi=new I,Yi=new I,ji=new I,qn=new I,Zn=new I,xi=new I,Is=new I,hr=new I,ur=new I,Mi=new I;function Do(s,e,t,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){Mi.fromArray(s,r);const a=i.x*Math.abs(Mi.x)+i.y*Math.abs(Mi.y)+i.z*Math.abs(Mi.z),l=e.dot(Mi),c=t.dot(Mi),h=n.dot(Mi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}const Kf=new zi,Ds=new I,Uo=new I;class bs{constructor(e=new I,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Kf.setFromPoints(e).getCenter(n);let i=0;for(let r=0,o=e.length;r<o;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ds.subVectors(e,this.center);const t=Ds.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(Ds,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Uo.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ds.copy(e.center).add(Uo)),this.expandByPoint(Ds.copy(e.center).sub(Uo))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const zn=new I,Fo=new I,dr=new I,Kn=new I,No=new I,fr=new I,Oo=new I;class er{constructor(e=new I,t=new I(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,zn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=zn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(zn.copy(this.origin).addScaledVector(this.direction,t),zn.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){Fo.copy(e).add(t).multiplyScalar(.5),dr.copy(t).sub(e).normalize(),Kn.copy(this.origin).sub(Fo);const r=e.distanceTo(t)*.5,o=-this.direction.dot(dr),a=Kn.dot(this.direction),l=-Kn.dot(dr),c=Kn.lengthSq(),h=Math.abs(1-o*o);let u,d,f,g;if(h>0)if(u=o*l-a,d=o*a-l,g=r*h,u>=0)if(d>=-g)if(d<=g){const v=1/h;u*=v,d*=v,f=u*(u+o*d+2*a)+d*(o*u+d+2*l)+c}else d=r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(Fo).addScaledVector(dr,d),f}intersectSphere(e,t){zn.subVectors(e.center,this.origin);const n=zn.dot(this.direction),i=zn.dot(zn)-n*n,r=e.radius*e.radius;if(i>r)return null;const o=Math.sqrt(r-i),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,o,a,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,i=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,i=(e.min.x-d.x)*c),h>=0?(r=(e.min.y-d.y)*h,o=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,o=(e.min.y-d.y)*h),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),u>=0?(a=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(a=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,zn)!==null}intersectTriangle(e,t,n,i,r){No.subVectors(t,e),fr.subVectors(n,e),Oo.crossVectors(No,fr);let o=this.direction.dot(Oo),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Kn.subVectors(this.origin,e);const l=a*this.direction.dot(fr.crossVectors(Kn,fr));if(l<0)return null;const c=a*this.direction.dot(No.cross(Kn));if(c<0||l+c>o)return null;const h=-a*Kn.dot(Oo);return h<0?null:this.at(h/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Le{constructor(e,t,n,i,r,o,a,l,c,h,u,d,f,g,v,m){Le.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,o,a,l,c,h,u,d,f,g,v,m)}set(e,t,n,i,r,o,a,l,c,h,u,d,f,g,v,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=i,p[1]=r,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=g,p[11]=v,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Le().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,i=1/qi.setFromMatrixColumn(e,0).length(),r=1/qi.setFromMatrixColumn(e,1).length(),o=1/qi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const d=o*h,f=o*u,g=a*h,v=a*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=f+g*c,t[5]=d-v*c,t[9]=-a*l,t[2]=v-d*c,t[6]=g+f*c,t[10]=o*l}else if(e.order==="YXZ"){const d=l*h,f=l*u,g=c*h,v=c*u;t[0]=d+v*a,t[4]=g*a-f,t[8]=o*c,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=f*a-g,t[6]=v+d*a,t[10]=o*l}else if(e.order==="ZXY"){const d=l*h,f=l*u,g=c*h,v=c*u;t[0]=d-v*a,t[4]=-o*u,t[8]=g+f*a,t[1]=f+g*a,t[5]=o*h,t[9]=v-d*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){const d=o*h,f=o*u,g=a*h,v=a*u;t[0]=l*h,t[4]=g*c-f,t[8]=d*c+v,t[1]=l*u,t[5]=v*c+d,t[9]=f*c-g,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){const d=o*l,f=o*c,g=a*l,v=a*c;t[0]=l*h,t[4]=v-d*u,t[8]=g*u+f,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-c*h,t[6]=f*u+g,t[10]=d-v*u}else if(e.order==="XZY"){const d=o*l,f=o*c,g=a*l,v=a*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+v,t[5]=o*h,t[9]=f*u-g,t[2]=g*u-f,t[6]=a*h,t[10]=v*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose($f,e,Qf)}lookAt(e,t,n){const i=this.elements;return tn.subVectors(e,t),tn.lengthSq()===0&&(tn.z=1),tn.normalize(),$n.crossVectors(n,tn),$n.lengthSq()===0&&(Math.abs(n.z)===1?tn.x+=1e-4:tn.z+=1e-4,tn.normalize(),$n.crossVectors(n,tn)),$n.normalize(),pr.crossVectors(tn,$n),i[0]=$n.x,i[4]=pr.x,i[8]=tn.x,i[1]=$n.y,i[5]=pr.y,i[9]=tn.y,i[2]=$n.z,i[6]=pr.z,i[10]=tn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],g=n[2],v=n[6],m=n[10],p=n[14],_=n[3],x=n[7],M=n[11],y=n[15],b=i[0],T=i[4],L=i[8],S=i[12],E=i[1],C=i[5],U=i[9],z=i[13],D=i[2],N=i[6],H=i[10],Z=i[14],B=i[3],X=i[7],$=i[11],te=i[15];return r[0]=o*b+a*E+l*D+c*B,r[4]=o*T+a*C+l*N+c*X,r[8]=o*L+a*U+l*H+c*$,r[12]=o*S+a*z+l*Z+c*te,r[1]=h*b+u*E+d*D+f*B,r[5]=h*T+u*C+d*N+f*X,r[9]=h*L+u*U+d*H+f*$,r[13]=h*S+u*z+d*Z+f*te,r[2]=g*b+v*E+m*D+p*B,r[6]=g*T+v*C+m*N+p*X,r[10]=g*L+v*U+m*H+p*$,r[14]=g*S+v*z+m*Z+p*te,r[3]=_*b+x*E+M*D+y*B,r[7]=_*T+x*C+M*N+y*X,r[11]=_*L+x*U+M*H+y*$,r[15]=_*S+x*z+M*Z+y*te,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],f=e[14],g=e[3],v=e[7],m=e[11],p=e[15];return g*(+r*l*u-i*c*u-r*a*d+n*c*d+i*a*f-n*l*f)+v*(+t*l*f-t*c*d+r*o*d-i*o*f+i*c*h-r*l*h)+m*(+t*c*u-t*a*f-r*o*u+n*o*f+r*a*h-n*c*h)+p*(-i*a*h-t*l*u+t*a*d+i*o*u-n*o*d+n*l*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],f=e[11],g=e[12],v=e[13],m=e[14],p=e[15],_=u*m*c-v*d*c+v*l*f-a*m*f-u*l*p+a*d*p,x=g*d*c-h*m*c-g*l*f+o*m*f+h*l*p-o*d*p,M=h*v*c-g*u*c+g*a*f-o*v*f-h*a*p+o*u*p,y=g*u*l-h*v*l-g*a*d+o*v*d+h*a*m-o*u*m,b=t*_+n*x+i*M+r*y;if(b===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const T=1/b;return e[0]=_*T,e[1]=(v*d*r-u*m*r-v*i*f+n*m*f+u*i*p-n*d*p)*T,e[2]=(a*m*r-v*l*r+v*i*c-n*m*c-a*i*p+n*l*p)*T,e[3]=(u*l*r-a*d*r-u*i*c+n*d*c+a*i*f-n*l*f)*T,e[4]=x*T,e[5]=(h*m*r-g*d*r+g*i*f-t*m*f-h*i*p+t*d*p)*T,e[6]=(g*l*r-o*m*r-g*i*c+t*m*c+o*i*p-t*l*p)*T,e[7]=(o*d*r-h*l*r+h*i*c-t*d*c-o*i*f+t*l*f)*T,e[8]=M*T,e[9]=(g*u*r-h*v*r-g*n*f+t*v*f+h*n*p-t*u*p)*T,e[10]=(o*v*r-g*a*r+g*n*c-t*v*c-o*n*p+t*a*p)*T,e[11]=(h*a*r-o*u*r-h*n*c+t*u*c+o*n*f-t*a*f)*T,e[12]=y*T,e[13]=(h*v*i-g*u*i+g*n*d-t*v*d-h*n*m+t*u*m)*T,e[14]=(g*a*i-o*v*i-g*n*l+t*v*l+o*n*m-t*a*m)*T,e[15]=(o*u*i-h*a*i+h*n*l-t*u*l-o*n*d+t*a*d)*T,this}scale(e){const t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),r=1-n,o=e.x,a=e.y,l=e.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-i*l,c*l+i*a,0,c*a+i*l,h*a+n,h*l-i*o,0,c*l-i*a,h*l+i*o,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,o){return this.set(1,n,r,0,e,1,o,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,h=o+o,u=a+a,d=r*c,f=r*h,g=r*u,v=o*h,m=o*u,p=a*u,_=l*c,x=l*h,M=l*u,y=n.x,b=n.y,T=n.z;return i[0]=(1-(v+p))*y,i[1]=(f+M)*y,i[2]=(g-x)*y,i[3]=0,i[4]=(f-M)*b,i[5]=(1-(d+p))*b,i[6]=(m+_)*b,i[7]=0,i[8]=(g+x)*T,i[9]=(m-_)*T,i[10]=(1-(d+v))*T,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;let r=qi.set(i[0],i[1],i[2]).length();const o=qi.set(i[4],i[5],i[6]).length(),a=qi.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),e.x=i[12],e.y=i[13],e.z=i[14],_n.copy(this);const c=1/r,h=1/o,u=1/a;return _n.elements[0]*=c,_n.elements[1]*=c,_n.elements[2]*=c,_n.elements[4]*=h,_n.elements[5]*=h,_n.elements[6]*=h,_n.elements[8]*=u,_n.elements[9]*=u,_n.elements[10]*=u,t.setFromRotationMatrix(_n),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,i,r,o,a=Yn){const l=this.elements,c=2*r/(t-e),h=2*r/(n-i),u=(t+e)/(t-e),d=(n+i)/(n-i);let f,g;if(a===Yn)f=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===io)f=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,i,r,o,a=Yn){const l=this.elements,c=1/(t-e),h=1/(n-i),u=1/(o-r),d=(t+e)*c,f=(n+i)*h;let g,v;if(a===Yn)g=(o+r)*u,v=-2*u;else if(a===io)g=r*u,v=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=v,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const qi=new I,_n=new Le,$f=new I(0,0,0),Qf=new I(1,1,1),$n=new I,pr=new I,tn=new I,ac=new Le,lc=new ft;class Kt{constructor(e=0,t=0,n=0,i=Kt.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,r=i[0],o=i[4],a=i[8],l=i[1],c=i[5],h=i[9],u=i[2],d=i[6],f=i[10];switch(t){case"XYZ":this._y=Math.asin(Ot(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ot(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ot(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Ot(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Ot(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-Ot(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return ac.makeRotationFromQuaternion(e),this.setFromRotationMatrix(ac,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return lc.setFromEuler(this),this.setFromQuaternion(lc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Kt.DEFAULT_ORDER="XYZ";class Wa{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Jf=0;const cc=new I,Zi=new ft,Hn=new Le,mr=new I,Us=new I,ep=new I,tp=new ft,hc=new I(1,0,0),uc=new I(0,1,0),dc=new I(0,0,1),np={type:"added"},ip={type:"removed"};class ut extends Bi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Jf++}),this.uuid=pi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ut.DEFAULT_UP.clone();const e=new I,t=new Kt,n=new ft,i=new I(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Le},normalMatrix:{value:new Qe}}),this.matrix=new Le,this.matrixWorld=new Le,this.matrixAutoUpdate=ut.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ut.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Wa,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Zi.setFromAxisAngle(e,t),this.quaternion.multiply(Zi),this}rotateOnWorldAxis(e,t){return Zi.setFromAxisAngle(e,t),this.quaternion.premultiply(Zi),this}rotateX(e){return this.rotateOnAxis(hc,e)}rotateY(e){return this.rotateOnAxis(uc,e)}rotateZ(e){return this.rotateOnAxis(dc,e)}translateOnAxis(e,t){return cc.copy(e).applyQuaternion(this.quaternion),this.position.add(cc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(hc,e)}translateY(e){return this.translateOnAxis(uc,e)}translateZ(e){return this.translateOnAxis(dc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Hn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?mr.copy(e):mr.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),Us.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Hn.lookAt(Us,mr,this.up):Hn.lookAt(mr,Us,this.up),this.quaternion.setFromRotationMatrix(Hn),i&&(Hn.extractRotation(i.matrixWorld),Zi.setFromRotationMatrix(Hn),this.quaternion.premultiply(Zi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(np)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(ip)),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Hn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Hn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Hn),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Us,e,ep),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Us,tp,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++){const r=t[n];(r.matrixWorldAutoUpdate===!0||e===!0)&&r.updateMatrixWorld(e)}}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const i=this.children;for(let r=0,o=i.length;r<o;r++){const a=i[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),i.maxGeometryCount=this._maxGeometryCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(e),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));i.material=a}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];i.animations.push(r(e.animations,l))}}if(t){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),h=o(e.images),u=o(e.shapes),d=o(e.skeletons),f=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=i,n;function o(a){const l=[];for(const c in a){const h=a[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}ut.DEFAULT_UP=new I(0,1,0);ut.DEFAULT_MATRIX_AUTO_UPDATE=!0;ut.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const xn=new I,kn=new I,Bo=new I,Vn=new I,Ki=new I,$i=new I,fc=new I,zo=new I,Ho=new I,ko=new I;let gr=!1;class fn{constructor(e=new I,t=new I,n=new I){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),xn.subVectors(e,t),i.cross(xn);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){xn.subVectors(i,t),kn.subVectors(n,t),Bo.subVectors(e,t);const o=xn.dot(xn),a=xn.dot(kn),l=xn.dot(Bo),c=kn.dot(kn),h=kn.dot(Bo),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;const d=1/u,f=(c*l-a*h)*d,g=(o*h-a*l)*d;return r.set(1-f-g,g,f)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,Vn)===null?!1:Vn.x>=0&&Vn.y>=0&&Vn.x+Vn.y<=1}static getUV(e,t,n,i,r,o,a,l){return gr===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),gr=!0),this.getInterpolation(e,t,n,i,r,o,a,l)}static getInterpolation(e,t,n,i,r,o,a,l){return this.getBarycoord(e,t,n,i,Vn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Vn.x),l.addScaledVector(o,Vn.y),l.addScaledVector(a,Vn.z),l)}static isFrontFacing(e,t,n,i){return xn.subVectors(n,t),kn.subVectors(e,t),xn.cross(kn).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return xn.subVectors(this.c,this.b),kn.subVectors(this.a,this.b),xn.cross(kn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return fn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return fn.getBarycoord(e,this.a,this.b,this.c,t)}getUV(e,t,n,i,r){return gr===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),gr=!0),fn.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}getInterpolation(e,t,n,i,r){return fn.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return fn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return fn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,r=this.c;let o,a;Ki.subVectors(i,n),$i.subVectors(r,n),zo.subVectors(e,n);const l=Ki.dot(zo),c=$i.dot(zo);if(l<=0&&c<=0)return t.copy(n);Ho.subVectors(e,i);const h=Ki.dot(Ho),u=$i.dot(Ho);if(h>=0&&u<=h)return t.copy(i);const d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),t.copy(n).addScaledVector(Ki,o);ko.subVectors(e,r);const f=Ki.dot(ko),g=$i.dot(ko);if(g>=0&&f<=g)return t.copy(r);const v=f*c-l*g;if(v<=0&&c>=0&&g<=0)return a=c/(c-g),t.copy(n).addScaledVector($i,a);const m=h*g-f*u;if(m<=0&&u-h>=0&&f-g>=0)return fc.subVectors(r,i),a=(u-h)/(u-h+(f-g)),t.copy(i).addScaledVector(fc,a);const p=1/(m+v+d);return o=v*p,a=d*p,t.copy(n).addScaledVector(Ki,o).addScaledVector($i,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Bu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Qn={h:0,s:0,l:0},vr={h:0,s:0,l:0};function Vo(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class Ne{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Pt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,lt.toWorkingColorSpace(this,t),this}setRGB(e,t,n,i=lt.workingColorSpace){return this.r=e,this.g=t,this.b=n,lt.toWorkingColorSpace(this,i),this}setHSL(e,t,n,i=lt.workingColorSpace){if(e=Ga(e,1),t=Ot(t,0,1),n=Ot(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=Vo(o,r,e+1/3),this.g=Vo(o,r,e),this.b=Vo(o,r,e-1/3)}return lt.toWorkingColorSpace(this,i),this}setStyle(e,t=Pt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Pt){const n=Bu[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=vs(e.r),this.g=vs(e.g),this.b=vs(e.b),this}copyLinearToSRGB(e){return this.r=Co(e.r),this.g=Co(e.g),this.b=Co(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Pt){return lt.fromWorkingColorSpace(Vt.copy(this),e),Math.round(Ot(Vt.r*255,0,255))*65536+Math.round(Ot(Vt.g*255,0,255))*256+Math.round(Ot(Vt.b*255,0,255))}getHexString(e=Pt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=lt.workingColorSpace){lt.fromWorkingColorSpace(Vt.copy(this),t);const n=Vt.r,i=Vt.g,r=Vt.b,o=Math.max(n,i,r),a=Math.min(n,i,r);let l,c;const h=(a+o)/2;if(a===o)l=0,c=0;else{const u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(i-r)/u+(i<r?6:0);break;case i:l=(r-n)/u+2;break;case r:l=(n-i)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=lt.workingColorSpace){return lt.fromWorkingColorSpace(Vt.copy(this),t),e.r=Vt.r,e.g=Vt.g,e.b=Vt.b,e}getStyle(e=Pt){lt.fromWorkingColorSpace(Vt.copy(this),e);const t=Vt.r,n=Vt.g,i=Vt.b;return e!==Pt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(Qn),this.setHSL(Qn.h+e,Qn.s+t,Qn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Qn),e.getHSL(vr);const n=ks(Qn.h,vr.h,t),i=ks(Qn.s,vr.s,t),r=ks(Qn.l,vr.l,t);return this.setHSL(n,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*i,this.g=r[1]*t+r[4]*n+r[7]*i,this.b=r[2]*t+r[5]*n+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Vt=new Ne;Ne.NAMES=Bu;let sp=0;class mi extends Bi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:sp++}),this.uuid=pi(),this.name="",this.type="Material",this.blending=ms,this.side=di,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ma,this.blendDst=ya,this.blendEquation=Xn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ne(0,0,0),this.blendAlpha=0,this.depthFunc=Kr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Jl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Gi,this.stencilZFail=Gi,this.stencilZPass=Gi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ms&&(n.blending=this.blending),this.side!==di&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ma&&(n.blendSrc=this.blendSrc),this.blendDst!==ya&&(n.blendDst=this.blendDst),this.blendEquation!==Xn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Kr&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Jl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Gi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Gi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Gi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(t){const r=i(e.textures),o=i(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class In extends mi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ne(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=ao,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Ct=new I,_r=new _e;class An{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=ec,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=Dn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)_r.fromBufferAttribute(this,t),_r.applyMatrix3(e),this.setXY(t,_r.x,_r.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Ct.fromBufferAttribute(this,t),Ct.applyMatrix3(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Ct.fromBufferAttribute(this,t),Ct.applyMatrix4(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ct.fromBufferAttribute(this,t),Ct.applyNormalMatrix(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ct.fromBufferAttribute(this,t),Ct.transformDirection(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=ls(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=jt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=ls(t,this.array)),t}setX(e,t){return this.normalized&&(t=jt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=ls(t,this.array)),t}setY(e,t){return this.normalized&&(t=jt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=ls(t,this.array)),t}setZ(e,t){return this.normalized&&(t=jt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=ls(t,this.array)),t}setW(e,t){return this.normalized&&(t=jt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=jt(t,this.array),n=jt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=jt(t,this.array),n=jt(n,this.array),i=jt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=jt(t,this.array),n=jt(n,this.array),i=jt(i,this.array),r=jt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==ec&&(e.usage=this.usage),e}}class Xa extends An{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class zu extends An{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class it extends An{constructor(e,t,n){super(new Float32Array(e),t,n)}}let rp=0;const hn=new Le,Go=new ut,Qi=new I,nn=new zi,Fs=new zi,Nt=new I;class St extends Bi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:rp++}),this.uuid=pi(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Uu(e)?zu:Xa)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Qe().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return hn.makeRotationFromQuaternion(e),this.applyMatrix4(hn),this}rotateX(e){return hn.makeRotationX(e),this.applyMatrix4(hn),this}rotateY(e){return hn.makeRotationY(e),this.applyMatrix4(hn),this}rotateZ(e){return hn.makeRotationZ(e),this.applyMatrix4(hn),this}translate(e,t,n){return hn.makeTranslation(e,t,n),this.applyMatrix4(hn),this}scale(e,t,n){return hn.makeScale(e,t,n),this.applyMatrix4(hn),this}lookAt(e){return Go.lookAt(e),Go.updateMatrix(),this.applyMatrix4(Go.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Qi).negate(),this.translate(Qi.x,Qi.y,Qi.z),this}setFromPoints(e){const t=[];for(let n=0,i=e.length;n<i;n++){const r=e[n];t.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new it(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new zi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const r=t[n];nn.setFromBufferAttribute(r),this.morphTargetsRelative?(Nt.addVectors(this.boundingBox.min,nn.min),this.boundingBox.expandByPoint(Nt),Nt.addVectors(this.boundingBox.max,nn.max),this.boundingBox.expandByPoint(Nt)):(this.boundingBox.expandByPoint(nn.min),this.boundingBox.expandByPoint(nn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new bs);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new I,1/0);return}if(e){const n=this.boundingSphere.center;if(nn.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){const a=t[r];Fs.setFromBufferAttribute(a),this.morphTargetsRelative?(Nt.addVectors(nn.min,Fs.min),nn.expandByPoint(Nt),Nt.addVectors(nn.max,Fs.max),nn.expandByPoint(Nt)):(nn.expandByPoint(Fs.min),nn.expandByPoint(Fs.max))}nn.getCenter(n);let i=0;for(let r=0,o=e.count;r<o;r++)Nt.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(Nt));if(t)for(let r=0,o=t.length;r<o;r++){const a=t[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Nt.fromBufferAttribute(a,c),l&&(Qi.fromBufferAttribute(e,c),Nt.add(Qi)),i=Math.max(i,n.distanceToSquared(Nt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.array,i=t.position.array,r=t.normal.array,o=t.uv.array,a=i.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new An(new Float32Array(4*a),4));const l=this.getAttribute("tangent").array,c=[],h=[];for(let E=0;E<a;E++)c[E]=new I,h[E]=new I;const u=new I,d=new I,f=new I,g=new _e,v=new _e,m=new _e,p=new I,_=new I;function x(E,C,U){u.fromArray(i,E*3),d.fromArray(i,C*3),f.fromArray(i,U*3),g.fromArray(o,E*2),v.fromArray(o,C*2),m.fromArray(o,U*2),d.sub(u),f.sub(u),v.sub(g),m.sub(g);const z=1/(v.x*m.y-m.x*v.y);isFinite(z)&&(p.copy(d).multiplyScalar(m.y).addScaledVector(f,-v.y).multiplyScalar(z),_.copy(f).multiplyScalar(v.x).addScaledVector(d,-m.x).multiplyScalar(z),c[E].add(p),c[C].add(p),c[U].add(p),h[E].add(_),h[C].add(_),h[U].add(_))}let M=this.groups;M.length===0&&(M=[{start:0,count:n.length}]);for(let E=0,C=M.length;E<C;++E){const U=M[E],z=U.start,D=U.count;for(let N=z,H=z+D;N<H;N+=3)x(n[N+0],n[N+1],n[N+2])}const y=new I,b=new I,T=new I,L=new I;function S(E){T.fromArray(r,E*3),L.copy(T);const C=c[E];y.copy(C),y.sub(T.multiplyScalar(T.dot(C))).normalize(),b.crossVectors(L,C);const z=b.dot(h[E])<0?-1:1;l[E*4]=y.x,l[E*4+1]=y.y,l[E*4+2]=y.z,l[E*4+3]=z}for(let E=0,C=M.length;E<C;++E){const U=M[E],z=U.start,D=U.count;for(let N=z,H=z+D;N<H;N+=3)S(n[N+0]),S(n[N+1]),S(n[N+2])}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new An(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const i=new I,r=new I,o=new I,a=new I,l=new I,c=new I,h=new I,u=new I;if(e)for(let d=0,f=e.count;d<f;d+=3){const g=e.getX(d+0),v=e.getX(d+1),m=e.getX(d+2);i.fromBufferAttribute(t,g),r.fromBufferAttribute(t,v),o.fromBufferAttribute(t,m),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,m),a.add(h),l.add(h),c.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)i.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Nt.fromBufferAttribute(e,t),Nt.normalize(),e.setXYZ(t,Nt.x,Nt.y,Nt.z)}toNonIndexed(){function e(a,l){const c=a.array,h=a.itemSize,u=a.normalized,d=new c.constructor(l.length*h);let f=0,g=0;for(let v=0,m=l.length;v<m;v++){a.isInterleavedBufferAttribute?f=l[v]*a.data.stride+a.offset:f=l[v]*h;for(let p=0;p<h;p++)d[g++]=c[f++]}return new An(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new St,n=this.index.array,i=this.attributes;for(const a in i){const l=i[a],c=e(l,n);t.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){const d=c[h],f=e(d,n);l.push(f)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const i={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){const f=c[u];h.push(f.toJSON(e.data))}h.length>0&&(i[l]=h,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const i=e.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(t))}const r=e.morphAttributes;for(const c in r){const h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,h=o.length;c<h;c++){const u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const pc=new Le,yi=new er,xr=new bs,mc=new I,Ji=new I,es=new I,ns=new I,Wo=new I,Mr=new I,yr=new _e,Sr=new _e,Er=new _e,gc=new I,vc=new I,_c=new I,br=new I,Tr=new I;class le extends ut{constructor(e=new St,t=new In){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const a=this.morphTargetInfluences;if(r&&a){Mr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=a[l],u=r[l];h!==0&&(Wo.fromBufferAttribute(u,e),o?Mr.addScaledVector(Wo,h):Mr.addScaledVector(Wo.sub(t),h))}t.add(Mr)}return t}raycast(e,t){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),xr.copy(n.boundingSphere),xr.applyMatrix4(r),yi.copy(e.ray).recast(e.near),!(xr.containsPoint(yi.origin)===!1&&(yi.intersectSphere(xr,mc)===null||yi.origin.distanceToSquared(mc)>(e.far-e.near)**2))&&(pc.copy(r).invert(),yi.copy(e.ray).applyMatrix4(pc),!(n.boundingBox!==null&&yi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,yi)))}_computeIntersections(e,t,n){let i;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,v=d.length;g<v;g++){const m=d[g],p=o[m.materialIndex],_=Math.max(m.start,f.start),x=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let M=_,y=x;M<y;M+=3){const b=a.getX(M),T=a.getX(M+1),L=a.getX(M+2);i=wr(this,p,e,n,c,h,u,b,T,L),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{const g=Math.max(0,f.start),v=Math.min(a.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const _=a.getX(m),x=a.getX(m+1),M=a.getX(m+2);i=wr(this,o,e,n,c,h,u,_,x,M),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,v=d.length;g<v;g++){const m=d[g],p=o[m.materialIndex],_=Math.max(m.start,f.start),x=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let M=_,y=x;M<y;M+=3){const b=M,T=M+1,L=M+2;i=wr(this,p,e,n,c,h,u,b,T,L),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{const g=Math.max(0,f.start),v=Math.min(l.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const _=m,x=m+1,M=m+2;i=wr(this,o,e,n,c,h,u,_,x,M),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}}}function op(s,e,t,n,i,r,o,a){let l;if(e.side===Jt?l=n.intersectTriangle(o,r,i,!0,a):l=n.intersectTriangle(i,r,o,e.side===di,a),l===null)return null;Tr.copy(a),Tr.applyMatrix4(s.matrixWorld);const c=t.ray.origin.distanceTo(Tr);return c<t.near||c>t.far?null:{distance:c,point:Tr.clone(),object:s}}function wr(s,e,t,n,i,r,o,a,l,c){s.getVertexPosition(a,Ji),s.getVertexPosition(l,es),s.getVertexPosition(c,ns);const h=op(s,e,t,n,Ji,es,ns,br);if(h){i&&(yr.fromBufferAttribute(i,a),Sr.fromBufferAttribute(i,l),Er.fromBufferAttribute(i,c),h.uv=fn.getInterpolation(br,Ji,es,ns,yr,Sr,Er,new _e)),r&&(yr.fromBufferAttribute(r,a),Sr.fromBufferAttribute(r,l),Er.fromBufferAttribute(r,c),h.uv1=fn.getInterpolation(br,Ji,es,ns,yr,Sr,Er,new _e),h.uv2=h.uv1),o&&(gc.fromBufferAttribute(o,a),vc.fromBufferAttribute(o,l),_c.fromBufferAttribute(o,c),h.normal=fn.getInterpolation(br,Ji,es,ns,gc,vc,_c,new I),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a,b:l,c,normal:new I,materialIndex:0};fn.getNormal(Ji,es,ns,u.normal),h.face=u}return h}class ht extends St{constructor(e=1,t=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};const a=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],h=[],u=[];let d=0,f=0;g("z","y","x",-1,-1,n,t,e,o,r,0),g("z","y","x",1,-1,n,t,-e,o,r,1),g("x","z","y",1,1,e,n,t,i,o,2),g("x","z","y",1,-1,e,n,-t,i,o,3),g("x","y","z",1,-1,e,t,n,i,r,4),g("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new it(c,3)),this.setAttribute("normal",new it(h,3)),this.setAttribute("uv",new it(u,2));function g(v,m,p,_,x,M,y,b,T,L,S){const E=M/T,C=y/L,U=M/2,z=y/2,D=b/2,N=T+1,H=L+1;let Z=0,B=0;const X=new I;for(let $=0;$<H;$++){const te=$*C-z;for(let Q=0;Q<N;Q++){const V=Q*E-U;X[v]=V*_,X[m]=te*x,X[p]=D,c.push(X.x,X.y,X.z),X[v]=0,X[m]=0,X[p]=b>0?1:-1,h.push(X.x,X.y,X.z),u.push(Q/T),u.push(1-$/L),Z+=1}}for(let $=0;$<L;$++)for(let te=0;te<T;te++){const Q=d+te+N*$,V=d+te+N*($+1),J=d+(te+1)+N*($+1),ce=d+(te+1)+N*$;l.push(Q,V,ce),l.push(V,J,ce),B+=6}a.addGroup(f,B,S),f+=B,d+=Z}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ht(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Ss(s){const e={};for(const t in s){e[t]={};for(const n in s[t]){const i=s[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function qt(s){const e={};for(let t=0;t<s.length;t++){const n=Ss(s[t]);for(const i in n)e[i]=n[i]}return e}function ap(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function Hu(s){return s.getRenderTarget()===null?s.outputColorSpace:lt.workingColorSpace}const Un={clone:Ss,merge:qt};var lp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,cp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class It extends mi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=lp,this.fragmentShader=cp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ss(e.uniforms),this.uniformsGroups=ap(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const o=this.uniforms[i].value;o&&o.isTexture?t.uniforms[i]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[i]={type:"m4",value:o.toArray()}:t.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class ku extends ut{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Le,this.projectionMatrix=new Le,this.projectionMatrixInverse=new Le,this.coordinateSystem=Yn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class $t extends ku{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=ys*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(gs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ys*2*Math.atan(Math.tan(gs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(e,t,n,i,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(gs*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*i/l,t-=o.offsetY*n/c,i*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const is=-90,ss=1;class hp extends ut{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new $t(is,ss,e,t);i.layers=this.layers,this.add(i);const r=new $t(is,ss,e,t);r.layers=this.layers,this.add(r);const o=new $t(is,ss,e,t);o.layers=this.layers,this.add(o);const a=new $t(is,ss,e,t);a.layers=this.layers,this.add(a);const l=new $t(is,ss,e,t);l.layers=this.layers,this.add(l);const c=new $t(is,ss,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,r,o,a,l]=t;for(const c of t)this.remove(c);if(e===Yn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===io)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,r),e.setRenderTarget(n,1,i),e.render(t,o),e.setRenderTarget(n,2,i),e.render(t,a),e.setRenderTarget(n,3,i),e.render(t,l),e.setRenderTarget(n,4,i),e.render(t,c),n.texture.generateMipmaps=v,e.setRenderTarget(n,5,i),e.render(t,h),e.setRenderTarget(u,d,f),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Vu extends Bt{constructor(e,t,n,i,r,o,a,l,c,h){e=e!==void 0?e:[],t=t!==void 0?t:xs,super(e,t,n,i,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class up extends ln{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];t.encoding!==void 0&&(Vs("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),t.colorSpace=t.encoding===Ri?Pt:mn),this.texture=new Vu(i,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:dn}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new ht(5,5,5),r=new It({name:"CubemapFromEquirect",uniforms:Ss(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Jt,blending:Wt});r.uniforms.tEquirect.value=t;const o=new le(i,r),a=t.minFilter;return t.minFilter===Xs&&(t.minFilter=dn),new hp(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,n,i){const r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,i);e.setRenderTarget(r)}}const Xo=new I,dp=new I,fp=new Qe;class ti{constructor(e=new I(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=Xo.subVectors(n,t).cross(dp.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Xo),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||fp.getNormalMatrix(e),i=this.coplanarPoint(Xo).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Si=new bs,Ar=new I;class Ya{constructor(e=new ti,t=new ti,n=new ti,i=new ti,r=new ti,o=new ti){this.planes=[e,t,n,i,r,o]}set(e,t,n,i,r,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(o),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Yn){const n=this.planes,i=e.elements,r=i[0],o=i[1],a=i[2],l=i[3],c=i[4],h=i[5],u=i[6],d=i[7],f=i[8],g=i[9],v=i[10],m=i[11],p=i[12],_=i[13],x=i[14],M=i[15];if(n[0].setComponents(l-r,d-c,m-f,M-p).normalize(),n[1].setComponents(l+r,d+c,m+f,M+p).normalize(),n[2].setComponents(l+o,d+h,m+g,M+_).normalize(),n[3].setComponents(l-o,d-h,m-g,M-_).normalize(),n[4].setComponents(l-a,d-u,m-v,M-x).normalize(),t===Yn)n[5].setComponents(l+a,d+u,m+v,M+x).normalize();else if(t===io)n[5].setComponents(a,u,v,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Si.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Si.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Si)}intersectsSprite(e){return Si.center.set(0,0,0),Si.radius=.7071067811865476,Si.applyMatrix4(e.matrixWorld),this.intersectsSphere(Si)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(Ar.x=i.normal.x>0?e.max.x:e.min.x,Ar.y=i.normal.y>0?e.max.y:e.min.y,Ar.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Ar)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Gu(){let s=null,e=!1,t=null,n=null;function i(r,o){t(r,o),n=s.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function pp(s,e){const t=e.isWebGL2,n=new WeakMap;function i(c,h){const u=c.array,d=c.usage,f=u.byteLength,g=s.createBuffer();s.bindBuffer(h,g),s.bufferData(h,u,d),c.onUploadCallback();let v;if(u instanceof Float32Array)v=s.FLOAT;else if(u instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(t)v=s.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else v=s.UNSIGNED_SHORT;else if(u instanceof Int16Array)v=s.SHORT;else if(u instanceof Uint32Array)v=s.UNSIGNED_INT;else if(u instanceof Int32Array)v=s.INT;else if(u instanceof Int8Array)v=s.BYTE;else if(u instanceof Uint8Array)v=s.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)v=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:g,type:v,bytesPerElement:u.BYTES_PER_ELEMENT,version:c.version,size:f}}function r(c,h,u){const d=h.array,f=h._updateRange,g=h.updateRanges;if(s.bindBuffer(u,c),f.count===-1&&g.length===0&&s.bufferSubData(u,0,d),g.length!==0){for(let v=0,m=g.length;v<m;v++){const p=g[v];t?s.bufferSubData(u,p.start*d.BYTES_PER_ELEMENT,d,p.start,p.count):s.bufferSubData(u,p.start*d.BYTES_PER_ELEMENT,d.subarray(p.start,p.start+p.count))}h.clearUpdateRanges()}f.count!==-1&&(t?s.bufferSubData(u,f.offset*d.BYTES_PER_ELEMENT,d,f.offset,f.count):s.bufferSubData(u,f.offset*d.BYTES_PER_ELEMENT,d.subarray(f.offset,f.offset+f.count)),f.count=-1),h.onUploadCallback()}function o(c){return c.isInterleavedBufferAttribute&&(c=c.data),n.get(c)}function a(c){c.isInterleavedBufferAttribute&&(c=c.data);const h=n.get(c);h&&(s.deleteBuffer(h.buffer),n.delete(c))}function l(c,h){if(c.isGLBufferAttribute){const d=n.get(c);(!d||d.version<c.version)&&n.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);const u=n.get(c);if(u===void 0)n.set(c,i(c,h));else if(u.version<c.version){if(u.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(u.buffer,c,h),u.version=c.version}}return{get:o,remove:a,update:l}}class ri extends St{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const r=e/2,o=t/2,a=Math.floor(n),l=Math.floor(i),c=a+1,h=l+1,u=e/a,d=t/l,f=[],g=[],v=[],m=[];for(let p=0;p<h;p++){const _=p*d-o;for(let x=0;x<c;x++){const M=x*u-r;g.push(M,-_,0),v.push(0,0,1),m.push(x/a),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let _=0;_<a;_++){const x=_+c*p,M=_+c*(p+1),y=_+1+c*(p+1),b=_+1+c*p;f.push(x,M,b),f.push(M,y,b)}this.setIndex(f),this.setAttribute("position",new it(g,3)),this.setAttribute("normal",new it(v,3)),this.setAttribute("uv",new it(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ri(e.width,e.height,e.widthSegments,e.heightSegments)}}var mp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,gp=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,vp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,_p=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,xp=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,Mp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,yp=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Sp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Ep=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,bp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Tp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,wp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Ap=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Pp=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Rp=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Cp=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif`,Lp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Ip=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Dp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Up=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Fp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Np=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Op=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Bp=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,zp=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Hp=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,kp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Vp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Gp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Wp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Xp="gl_FragColor = linearToOutputTexel( gl_FragColor );",Yp=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,jp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,qp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Zp=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Kp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,$p=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Qp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Jp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,em=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,tm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,nm=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,im=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,sm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,rm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,om=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,am=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,lm=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,cm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,hm=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,um=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,dm=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,fm=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,pm=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,mm=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,gm=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,vm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,_m=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,xm=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Mm=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,ym=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,Sm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Em=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,bm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Tm=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,wm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Am=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Pm=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Rm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,Cm=`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,Lm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,Im=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Dm=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Um=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Fm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Nm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Om=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Bm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,zm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Hm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,km=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Vm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Gm=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Wm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Xm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Ym=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,jm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,qm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Zm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Km=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,$m=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Qm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Jm=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,eg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,tg=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,ng=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,ig=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,sg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,rg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,og=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ag=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color *= toneMappingExposure;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	return color;
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,lg=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,cg=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,hg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,ug=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,dg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,fg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const pg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,mg=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,gg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,vg=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_g=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,xg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Mg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,yg=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,Sg=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Eg=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,bg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Tg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,wg=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Ag=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Pg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Rg=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Cg=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Lg=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ig=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Dg=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ug=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Fg=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Ng=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Og=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Bg=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,zg=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Hg=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,kg=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Vg=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Gg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Wg=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Xg=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Yg=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,jg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ze={alphahash_fragment:mp,alphahash_pars_fragment:gp,alphamap_fragment:vp,alphamap_pars_fragment:_p,alphatest_fragment:xp,alphatest_pars_fragment:Mp,aomap_fragment:yp,aomap_pars_fragment:Sp,batching_pars_vertex:Ep,batching_vertex:bp,begin_vertex:Tp,beginnormal_vertex:wp,bsdfs:Ap,iridescence_fragment:Pp,bumpmap_pars_fragment:Rp,clipping_planes_fragment:Cp,clipping_planes_pars_fragment:Lp,clipping_planes_pars_vertex:Ip,clipping_planes_vertex:Dp,color_fragment:Up,color_pars_fragment:Fp,color_pars_vertex:Np,color_vertex:Op,common:Bp,cube_uv_reflection_fragment:zp,defaultnormal_vertex:Hp,displacementmap_pars_vertex:kp,displacementmap_vertex:Vp,emissivemap_fragment:Gp,emissivemap_pars_fragment:Wp,colorspace_fragment:Xp,colorspace_pars_fragment:Yp,envmap_fragment:jp,envmap_common_pars_fragment:qp,envmap_pars_fragment:Zp,envmap_pars_vertex:Kp,envmap_physical_pars_fragment:lm,envmap_vertex:$p,fog_vertex:Qp,fog_pars_vertex:Jp,fog_fragment:em,fog_pars_fragment:tm,gradientmap_pars_fragment:nm,lightmap_fragment:im,lightmap_pars_fragment:sm,lights_lambert_fragment:rm,lights_lambert_pars_fragment:om,lights_pars_begin:am,lights_toon_fragment:cm,lights_toon_pars_fragment:hm,lights_phong_fragment:um,lights_phong_pars_fragment:dm,lights_physical_fragment:fm,lights_physical_pars_fragment:pm,lights_fragment_begin:mm,lights_fragment_maps:gm,lights_fragment_end:vm,logdepthbuf_fragment:_m,logdepthbuf_pars_fragment:xm,logdepthbuf_pars_vertex:Mm,logdepthbuf_vertex:ym,map_fragment:Sm,map_pars_fragment:Em,map_particle_fragment:bm,map_particle_pars_fragment:Tm,metalnessmap_fragment:wm,metalnessmap_pars_fragment:Am,morphcolor_vertex:Pm,morphnormal_vertex:Rm,morphtarget_pars_vertex:Cm,morphtarget_vertex:Lm,normal_fragment_begin:Im,normal_fragment_maps:Dm,normal_pars_fragment:Um,normal_pars_vertex:Fm,normal_vertex:Nm,normalmap_pars_fragment:Om,clearcoat_normal_fragment_begin:Bm,clearcoat_normal_fragment_maps:zm,clearcoat_pars_fragment:Hm,iridescence_pars_fragment:km,opaque_fragment:Vm,packing:Gm,premultiplied_alpha_fragment:Wm,project_vertex:Xm,dithering_fragment:Ym,dithering_pars_fragment:jm,roughnessmap_fragment:qm,roughnessmap_pars_fragment:Zm,shadowmap_pars_fragment:Km,shadowmap_pars_vertex:$m,shadowmap_vertex:Qm,shadowmask_pars_fragment:Jm,skinbase_vertex:eg,skinning_pars_vertex:tg,skinning_vertex:ng,skinnormal_vertex:ig,specularmap_fragment:sg,specularmap_pars_fragment:rg,tonemapping_fragment:og,tonemapping_pars_fragment:ag,transmission_fragment:lg,transmission_pars_fragment:cg,uv_pars_fragment:hg,uv_pars_vertex:ug,uv_vertex:dg,worldpos_vertex:fg,background_vert:pg,background_frag:mg,backgroundCube_vert:gg,backgroundCube_frag:vg,cube_vert:_g,cube_frag:xg,depth_vert:Mg,depth_frag:yg,distanceRGBA_vert:Sg,distanceRGBA_frag:Eg,equirect_vert:bg,equirect_frag:Tg,linedashed_vert:wg,linedashed_frag:Ag,meshbasic_vert:Pg,meshbasic_frag:Rg,meshlambert_vert:Cg,meshlambert_frag:Lg,meshmatcap_vert:Ig,meshmatcap_frag:Dg,meshnormal_vert:Ug,meshnormal_frag:Fg,meshphong_vert:Ng,meshphong_frag:Og,meshphysical_vert:Bg,meshphysical_frag:zg,meshtoon_vert:Hg,meshtoon_frag:kg,points_vert:Vg,points_frag:Gg,shadow_vert:Wg,shadow_frag:Xg,sprite_vert:Yg,sprite_frag:jg},ue={common:{diffuse:{value:new Ne(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Qe},alphaMap:{value:null},alphaMapTransform:{value:new Qe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Qe}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Qe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Qe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Qe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Qe},normalScale:{value:new _e(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Qe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Qe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Qe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Qe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ne(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ne(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Qe},alphaTest:{value:0},uvTransform:{value:new Qe}},sprite:{diffuse:{value:new Ne(16777215)},opacity:{value:1},center:{value:new _e(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Qe},alphaMap:{value:null},alphaMapTransform:{value:new Qe},alphaTest:{value:0}}},Ln={basic:{uniforms:qt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.fog]),vertexShader:Ze.meshbasic_vert,fragmentShader:Ze.meshbasic_frag},lambert:{uniforms:qt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new Ne(0)}}]),vertexShader:Ze.meshlambert_vert,fragmentShader:Ze.meshlambert_frag},phong:{uniforms:qt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new Ne(0)},specular:{value:new Ne(1118481)},shininess:{value:30}}]),vertexShader:Ze.meshphong_vert,fragmentShader:Ze.meshphong_frag},standard:{uniforms:qt([ue.common,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.roughnessmap,ue.metalnessmap,ue.fog,ue.lights,{emissive:{value:new Ne(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ze.meshphysical_vert,fragmentShader:Ze.meshphysical_frag},toon:{uniforms:qt([ue.common,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.gradientmap,ue.fog,ue.lights,{emissive:{value:new Ne(0)}}]),vertexShader:Ze.meshtoon_vert,fragmentShader:Ze.meshtoon_frag},matcap:{uniforms:qt([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,{matcap:{value:null}}]),vertexShader:Ze.meshmatcap_vert,fragmentShader:Ze.meshmatcap_frag},points:{uniforms:qt([ue.points,ue.fog]),vertexShader:Ze.points_vert,fragmentShader:Ze.points_frag},dashed:{uniforms:qt([ue.common,ue.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ze.linedashed_vert,fragmentShader:Ze.linedashed_frag},depth:{uniforms:qt([ue.common,ue.displacementmap]),vertexShader:Ze.depth_vert,fragmentShader:Ze.depth_frag},normal:{uniforms:qt([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,{opacity:{value:1}}]),vertexShader:Ze.meshnormal_vert,fragmentShader:Ze.meshnormal_frag},sprite:{uniforms:qt([ue.sprite,ue.fog]),vertexShader:Ze.sprite_vert,fragmentShader:Ze.sprite_frag},background:{uniforms:{uvTransform:{value:new Qe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ze.background_vert,fragmentShader:Ze.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Ze.backgroundCube_vert,fragmentShader:Ze.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ze.cube_vert,fragmentShader:Ze.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ze.equirect_vert,fragmentShader:Ze.equirect_frag},distanceRGBA:{uniforms:qt([ue.common,ue.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ze.distanceRGBA_vert,fragmentShader:Ze.distanceRGBA_frag},shadow:{uniforms:qt([ue.lights,ue.fog,{color:{value:new Ne(0)},opacity:{value:1}}]),vertexShader:Ze.shadow_vert,fragmentShader:Ze.shadow_frag}};Ln.physical={uniforms:qt([Ln.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Qe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Qe},clearcoatNormalScale:{value:new _e(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Qe},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Qe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Qe},sheen:{value:0},sheenColor:{value:new Ne(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Qe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Qe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Qe},transmissionSamplerSize:{value:new _e},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Qe},attenuationDistance:{value:0},attenuationColor:{value:new Ne(0)},specularColor:{value:new Ne(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Qe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Qe},anisotropyVector:{value:new _e},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Qe}}]),vertexShader:Ze.meshphysical_vert,fragmentShader:Ze.meshphysical_frag};const Pr={r:0,b:0,g:0};function qg(s,e,t,n,i,r,o){const a=new Ne(0);let l=r===!0?0:1,c,h,u=null,d=0,f=null;function g(m,p){let _=!1,x=p.isScene===!0?p.background:null;x&&x.isTexture&&(x=(p.backgroundBlurriness>0?t:e).get(x)),x===null?v(a,l):x&&x.isColor&&(v(x,1),_=!0);const M=s.xr.getEnvironmentBlendMode();M==="additive"?n.buffers.color.setClear(0,0,0,1,o):M==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(s.autoClear||_)&&s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil),x&&(x.isCubeTexture||x.mapping===lo)?(h===void 0&&(h=new le(new ht(1,1,1),new It({name:"BackgroundCubeMaterial",uniforms:Ss(Ln.backgroundCube.uniforms),vertexShader:Ln.backgroundCube.vertexShader,fragmentShader:Ln.backgroundCube.fragmentShader,side:Jt,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(y,b,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),h.material.uniforms.envMap.value=x,h.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=p.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,h.material.toneMapped=lt.getTransfer(x.colorSpace)!==dt,(u!==x||d!==x.version||f!==s.toneMapping)&&(h.material.needsUpdate=!0,u=x,d=x.version,f=s.toneMapping),h.layers.enableAll(),m.unshift(h,h.geometry,h.material,0,0,null)):x&&x.isTexture&&(c===void 0&&(c=new le(new ri(2,2),new It({name:"BackgroundMaterial",uniforms:Ss(Ln.background.uniforms),vertexShader:Ln.background.vertexShader,fragmentShader:Ln.background.fragmentShader,side:di,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=x,c.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,c.material.toneMapped=lt.getTransfer(x.colorSpace)!==dt,x.matrixAutoUpdate===!0&&x.updateMatrix(),c.material.uniforms.uvTransform.value.copy(x.matrix),(u!==x||d!==x.version||f!==s.toneMapping)&&(c.material.needsUpdate=!0,u=x,d=x.version,f=s.toneMapping),c.layers.enableAll(),m.unshift(c,c.geometry,c.material,0,0,null))}function v(m,p){m.getRGB(Pr,Hu(s)),n.buffers.color.setClear(Pr.r,Pr.g,Pr.b,p,o)}return{getClearColor:function(){return a},setClearColor:function(m,p=1){a.set(m),l=p,v(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(m){l=m,v(a,l)},render:g}}function Zg(s,e,t,n){const i=s.getParameter(s.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:e.get("OES_vertex_array_object"),o=n.isWebGL2||r!==null,a={},l=m(null);let c=l,h=!1;function u(D,N,H,Z,B){let X=!1;if(o){const $=v(Z,H,N);c!==$&&(c=$,f(c.object)),X=p(D,Z,H,B),X&&_(D,Z,H,B)}else{const $=N.wireframe===!0;(c.geometry!==Z.id||c.program!==H.id||c.wireframe!==$)&&(c.geometry=Z.id,c.program=H.id,c.wireframe=$,X=!0)}B!==null&&t.update(B,s.ELEMENT_ARRAY_BUFFER),(X||h)&&(h=!1,L(D,N,H,Z),B!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(B).buffer))}function d(){return n.isWebGL2?s.createVertexArray():r.createVertexArrayOES()}function f(D){return n.isWebGL2?s.bindVertexArray(D):r.bindVertexArrayOES(D)}function g(D){return n.isWebGL2?s.deleteVertexArray(D):r.deleteVertexArrayOES(D)}function v(D,N,H){const Z=H.wireframe===!0;let B=a[D.id];B===void 0&&(B={},a[D.id]=B);let X=B[N.id];X===void 0&&(X={},B[N.id]=X);let $=X[Z];return $===void 0&&($=m(d()),X[Z]=$),$}function m(D){const N=[],H=[],Z=[];for(let B=0;B<i;B++)N[B]=0,H[B]=0,Z[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:N,enabledAttributes:H,attributeDivisors:Z,object:D,attributes:{},index:null}}function p(D,N,H,Z){const B=c.attributes,X=N.attributes;let $=0;const te=H.getAttributes();for(const Q in te)if(te[Q].location>=0){const J=B[Q];let ce=X[Q];if(ce===void 0&&(Q==="instanceMatrix"&&D.instanceMatrix&&(ce=D.instanceMatrix),Q==="instanceColor"&&D.instanceColor&&(ce=D.instanceColor)),J===void 0||J.attribute!==ce||ce&&J.data!==ce.data)return!0;$++}return c.attributesNum!==$||c.index!==Z}function _(D,N,H,Z){const B={},X=N.attributes;let $=0;const te=H.getAttributes();for(const Q in te)if(te[Q].location>=0){let J=X[Q];J===void 0&&(Q==="instanceMatrix"&&D.instanceMatrix&&(J=D.instanceMatrix),Q==="instanceColor"&&D.instanceColor&&(J=D.instanceColor));const ce={};ce.attribute=J,J&&J.data&&(ce.data=J.data),B[Q]=ce,$++}c.attributes=B,c.attributesNum=$,c.index=Z}function x(){const D=c.newAttributes;for(let N=0,H=D.length;N<H;N++)D[N]=0}function M(D){y(D,0)}function y(D,N){const H=c.newAttributes,Z=c.enabledAttributes,B=c.attributeDivisors;H[D]=1,Z[D]===0&&(s.enableVertexAttribArray(D),Z[D]=1),B[D]!==N&&((n.isWebGL2?s:e.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](D,N),B[D]=N)}function b(){const D=c.newAttributes,N=c.enabledAttributes;for(let H=0,Z=N.length;H<Z;H++)N[H]!==D[H]&&(s.disableVertexAttribArray(H),N[H]=0)}function T(D,N,H,Z,B,X,$){$===!0?s.vertexAttribIPointer(D,N,H,B,X):s.vertexAttribPointer(D,N,H,Z,B,X)}function L(D,N,H,Z){if(n.isWebGL2===!1&&(D.isInstancedMesh||Z.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;x();const B=Z.attributes,X=H.getAttributes(),$=N.defaultAttributeValues;for(const te in X){const Q=X[te];if(Q.location>=0){let V=B[te];if(V===void 0&&(te==="instanceMatrix"&&D.instanceMatrix&&(V=D.instanceMatrix),te==="instanceColor"&&D.instanceColor&&(V=D.instanceColor)),V!==void 0){const J=V.normalized,ce=V.itemSize,ve=t.get(V);if(ve===void 0)continue;const fe=ve.buffer,Se=ve.type,Pe=ve.bytesPerElement,Ee=n.isWebGL2===!0&&(Se===s.INT||Se===s.UNSIGNED_INT||V.gpuType===Eu);if(V.isInterleavedBufferAttribute){const We=V.data,W=We.stride,_t=V.offset;if(We.isInstancedInterleavedBuffer){for(let Ae=0;Ae<Q.locationSize;Ae++)y(Q.location+Ae,We.meshPerAttribute);D.isInstancedMesh!==!0&&Z._maxInstanceCount===void 0&&(Z._maxInstanceCount=We.meshPerAttribute*We.count)}else for(let Ae=0;Ae<Q.locationSize;Ae++)M(Q.location+Ae);s.bindBuffer(s.ARRAY_BUFFER,fe);for(let Ae=0;Ae<Q.locationSize;Ae++)T(Q.location+Ae,ce/Q.locationSize,Se,J,W*Pe,(_t+ce/Q.locationSize*Ae)*Pe,Ee)}else{if(V.isInstancedBufferAttribute){for(let We=0;We<Q.locationSize;We++)y(Q.location+We,V.meshPerAttribute);D.isInstancedMesh!==!0&&Z._maxInstanceCount===void 0&&(Z._maxInstanceCount=V.meshPerAttribute*V.count)}else for(let We=0;We<Q.locationSize;We++)M(Q.location+We);s.bindBuffer(s.ARRAY_BUFFER,fe);for(let We=0;We<Q.locationSize;We++)T(Q.location+We,ce/Q.locationSize,Se,J,ce*Pe,ce/Q.locationSize*We*Pe,Ee)}}else if($!==void 0){const J=$[te];if(J!==void 0)switch(J.length){case 2:s.vertexAttrib2fv(Q.location,J);break;case 3:s.vertexAttrib3fv(Q.location,J);break;case 4:s.vertexAttrib4fv(Q.location,J);break;default:s.vertexAttrib1fv(Q.location,J)}}}}b()}function S(){U();for(const D in a){const N=a[D];for(const H in N){const Z=N[H];for(const B in Z)g(Z[B].object),delete Z[B];delete N[H]}delete a[D]}}function E(D){if(a[D.id]===void 0)return;const N=a[D.id];for(const H in N){const Z=N[H];for(const B in Z)g(Z[B].object),delete Z[B];delete N[H]}delete a[D.id]}function C(D){for(const N in a){const H=a[N];if(H[D.id]===void 0)continue;const Z=H[D.id];for(const B in Z)g(Z[B].object),delete Z[B];delete H[D.id]}}function U(){z(),h=!0,c!==l&&(c=l,f(c.object))}function z(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:u,reset:U,resetDefaultState:z,dispose:S,releaseStatesOfGeometry:E,releaseStatesOfProgram:C,initAttributes:x,enableAttribute:M,disableUnusedAttributes:b}}function Kg(s,e,t,n){const i=n.isWebGL2;let r;function o(h){r=h}function a(h,u){s.drawArrays(r,h,u),t.update(u,r,1)}function l(h,u,d){if(d===0)return;let f,g;if(i)f=s,g="drawArraysInstanced";else if(f=e.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",f===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}f[g](r,h,u,d),t.update(u,r,d)}function c(h,u,d){if(d===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<d;g++)this.render(h[g],u[g]);else{f.multiDrawArraysWEBGL(r,h,0,u,0,d);let g=0;for(let v=0;v<d;v++)g+=u[v];t.update(g,r,1)}}this.setMode=o,this.render=a,this.renderInstances=l,this.renderMultiDraw=c}function $g(s,e,t){let n;function i(){if(n!==void 0)return n;if(e.has("EXT_texture_filter_anisotropic")===!0){const T=e.get("EXT_texture_filter_anisotropic");n=s.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(T){if(T==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const o=typeof WebGL2RenderingContext<"u"&&s.constructor.name==="WebGL2RenderingContext";let a=t.precision!==void 0?t.precision:"highp";const l=r(a);l!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",l,"instead."),a=l);const c=o||e.has("WEBGL_draw_buffers"),h=t.logarithmicDepthBuffer===!0,u=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),d=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),f=s.getParameter(s.MAX_TEXTURE_SIZE),g=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),v=s.getParameter(s.MAX_VERTEX_ATTRIBS),m=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),p=s.getParameter(s.MAX_VARYING_VECTORS),_=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),x=d>0,M=o||e.has("OES_texture_float"),y=x&&M,b=o?s.getParameter(s.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:c,getMaxAnisotropy:i,getMaxPrecision:r,precision:a,logarithmicDepthBuffer:h,maxTextures:u,maxVertexTextures:d,maxTextureSize:f,maxCubemapSize:g,maxAttributes:v,maxVertexUniforms:m,maxVaryings:p,maxFragmentUniforms:_,vertexTextures:x,floatFragmentTextures:M,floatVertexTextures:y,maxSamples:b}}function Qg(s){const e=this;let t=null,n=0,i=!1,r=!1;const o=new ti,a=new Qe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||i;return i=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,f){const g=u.clippingPlanes,v=u.clipIntersection,m=u.clipShadows,p=s.get(u);if(!i||g===null||g.length===0||r&&!m)r?h(null):c();else{const _=r?0:n,x=_*4;let M=p.clippingState||null;l.value=M,M=h(g,d,x,f);for(let y=0;y!==x;++y)M[y]=t[y];p.clippingState=M,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=_}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,f,g){const v=u!==null?u.length:0;let m=null;if(v!==0){if(m=l.value,g!==!0||m===null){const p=f+v*4,_=d.matrixWorldInverse;a.getNormalMatrix(_),(m===null||m.length<p)&&(m=new Float32Array(p));for(let x=0,M=f;x!==v;++x,M+=4)o.copy(u[x]).applyMatrix4(_,a),o.normal.toArray(m,M),m[M+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,m}}function Jg(s){let e=new WeakMap;function t(o,a){return a===$r?o.mapping=xs:a===Sa&&(o.mapping=Ms),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===$r||a===Sa)if(e.has(o)){const l=e.get(o).texture;return t(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new up(l.height/2);return c.fromEquirectangularTexture(s,o),e.set(o,c),o.addEventListener("dispose",i),t(c.texture,o.mapping)}else return null}}return o}function i(o){const a=o.target;a.removeEventListener("dispose",i);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}class uo extends ku{constructor(e=-1,t=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-e,o=n+e,a=i+t,l=i-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const us=4,xc=[.125,.215,.35,.446,.526,.582],wi=20,Yo=new uo,Mc=new Ne;let jo=null,qo=0,Zo=0;const bi=(1+Math.sqrt(5))/2,rs=1/bi,yc=[new I(1,1,1),new I(-1,1,1),new I(1,1,-1),new I(-1,1,-1),new I(0,bi,rs),new I(0,bi,-rs),new I(rs,0,bi),new I(-rs,0,bi),new I(bi,rs,0),new I(-bi,rs,0)];class Sc{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100){jo=this._renderer.getRenderTarget(),qo=this._renderer.getActiveCubeFace(),Zo=this._renderer.getActiveMipmapLevel(),this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,i,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Tc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=bc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(jo,qo,Zo),e.scissorTest=!1,Rr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===xs||e.mapping===Ms?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),jo=this._renderer.getRenderTarget(),qo=this._renderer.getActiveCubeFace(),Zo=this._renderer.getActiveMipmapLevel();const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:dn,minFilter:dn,generateMipmaps:!1,type:wn,format:pn,colorSpace:jn,depthBuffer:!1},i=Ec(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ec(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=e0(r)),this._blurMaterial=t0(r,e,t)}return i}_compileMaterial(e){const t=new le(this._lodPlanes[0],e);this._renderer.compile(t,Yo)}_sceneToCubeUV(e,t,n,i){const a=new $t(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(Mc),h.toneMapping=ci,h.autoClear=!1;const f=new In({name:"PMREM.Background",side:Jt,depthWrite:!1,depthTest:!1}),g=new le(new ht,f);let v=!1;const m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,v=!0):(f.color.copy(Mc),v=!0);for(let p=0;p<6;p++){const _=p%3;_===0?(a.up.set(0,l[p],0),a.lookAt(c[p],0,0)):_===1?(a.up.set(0,0,l[p]),a.lookAt(0,c[p],0)):(a.up.set(0,l[p],0),a.lookAt(0,0,c[p]));const x=this._cubeSize;Rr(i,_*x,p>2?x:0,x,x),h.setRenderTarget(i),v&&h.render(g,a),h.render(e,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=u,e.background=m}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===xs||e.mapping===Ms;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Tc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=bc());const r=i?this._cubemapMaterial:this._equirectMaterial,o=new le(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;const l=this._cubeSize;Rr(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(o,Yo)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;for(let i=1;i<this._lodPlanes.length;i++){const r=Math.sqrt(this._sigmas[i]*this._sigmas[i]-this._sigmas[i-1]*this._sigmas[i-1]),o=yc[(i-1)%yc.length];this._blur(e,i-1,i,r,o)}t.autoClear=n}_blur(e,t,n,i,r){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,i,"latitudinal",r),this._halfBlur(o,e,n,n,i,"longitudinal",r)}_halfBlur(e,t,n,i,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new le(this._lodPlanes[i],c),d=c.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*wi-1),v=r/g,m=isFinite(r)?1+Math.floor(h*v):wi;m>wi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${wi}`);const p=[];let _=0;for(let T=0;T<wi;++T){const L=T/v,S=Math.exp(-L*L/2);p.push(S),T===0?_+=S:T<m&&(_+=2*S)}for(let T=0;T<p.length;T++)p[T]=p[T]/_;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:x}=this;d.dTheta.value=g,d.mipInt.value=x-n;const M=this._sizeLods[i],y=3*M*(i>x-us?i-x+us:0),b=4*(this._cubeSize-M);Rr(t,y,b,3*M,2*M),l.setRenderTarget(t),l.render(u,Yo)}}function e0(s){const e=[],t=[],n=[];let i=s;const r=s-us+1+xc.length;for(let o=0;o<r;o++){const a=Math.pow(2,i);t.push(a);let l=1/a;o>s-us?l=xc[o-s+us-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,v=3,m=2,p=1,_=new Float32Array(v*g*f),x=new Float32Array(m*g*f),M=new Float32Array(p*g*f);for(let b=0;b<f;b++){const T=b%3*2/3-1,L=b>2?0:-1,S=[T,L,0,T+2/3,L,0,T+2/3,L+1,0,T,L,0,T+2/3,L+1,0,T,L+1,0];_.set(S,v*g*b),x.set(d,m*g*b);const E=[b,b,b,b,b,b];M.set(E,p*g*b)}const y=new St;y.setAttribute("position",new An(_,v)),y.setAttribute("uv",new An(x,m)),y.setAttribute("faceIndex",new An(M,p)),e.push(y),i>us&&i--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Ec(s,e,t){const n=new ln(s,e,t);return n.texture.mapping=lo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Rr(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function t0(s,e,t){const n=new Float32Array(wi),i=new I(0,1,0);return new It({name:"SphericalGaussianBlur",defines:{n:wi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:ja(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Wt,depthTest:!1,depthWrite:!1})}function bc(){return new It({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ja(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Wt,depthTest:!1,depthWrite:!1})}function Tc(){return new It({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ja(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Wt,depthTest:!1,depthWrite:!1})}function ja(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function n0(s){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===$r||l===Sa,h=l===xs||l===Ms;if(c||h)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let u=e.get(a);return t===null&&(t=new Sc(s)),u=c?t.fromEquirectangular(a,u):t.fromCubemap(a,u),e.set(a,u),u.texture}else{if(e.has(a))return e.get(a).texture;{const u=a.image;if(c&&u&&u.height>0||h&&u&&i(u)){t===null&&(t=new Sc(s));const d=c?t.fromEquirectangular(a):t.fromCubemap(a);return e.set(a,d),a.addEventListener("dispose",r),d.texture}else return null}}}return a}function i(a){let l=0;const c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){const l=a.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function i0(s){const e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(n){n.isWebGL2?(t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance")):(t("WEBGL_depth_texture"),t("OES_texture_float"),t("OES_texture_half_float"),t("OES_texture_half_float_linear"),t("OES_standard_derivatives"),t("OES_element_index_uint"),t("OES_vertex_array_object"),t("ANGLE_instanced_arrays")),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture")},get:function(n){const i=t(n);return i===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function s0(s,e,t,n){const i={},r=new WeakMap;function o(u){const d=u.target;d.index!==null&&e.remove(d.index);for(const g in d.attributes)e.remove(d.attributes[g]);for(const g in d.morphAttributes){const v=d.morphAttributes[g];for(let m=0,p=v.length;m<p;m++)e.remove(v[m])}d.removeEventListener("dispose",o),delete i[d.id];const f=r.get(d);f&&(e.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function a(u,d){return i[d.id]===!0||(d.addEventListener("dispose",o),i[d.id]=!0,t.memory.geometries++),d}function l(u){const d=u.attributes;for(const g in d)e.update(d[g],s.ARRAY_BUFFER);const f=u.morphAttributes;for(const g in f){const v=f[g];for(let m=0,p=v.length;m<p;m++)e.update(v[m],s.ARRAY_BUFFER)}}function c(u){const d=[],f=u.index,g=u.attributes.position;let v=0;if(f!==null){const _=f.array;v=f.version;for(let x=0,M=_.length;x<M;x+=3){const y=_[x+0],b=_[x+1],T=_[x+2];d.push(y,b,b,T,T,y)}}else if(g!==void 0){const _=g.array;v=g.version;for(let x=0,M=_.length/3-1;x<M;x+=3){const y=x+0,b=x+1,T=x+2;d.push(y,b,b,T,T,y)}}else return;const m=new(Uu(d)?zu:Xa)(d,1);m.version=v;const p=r.get(u);p&&e.remove(p),r.set(u,m)}function h(u){const d=r.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function r0(s,e,t,n){const i=n.isWebGL2;let r;function o(f){r=f}let a,l;function c(f){a=f.type,l=f.bytesPerElement}function h(f,g){s.drawElements(r,g,a,f*l),t.update(g,r,1)}function u(f,g,v){if(v===0)return;let m,p;if(i)m=s,p="drawElementsInstanced";else if(m=e.get("ANGLE_instanced_arrays"),p="drawElementsInstancedANGLE",m===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[p](r,g,a,f*l,v),t.update(g,r,v)}function d(f,g,v){if(v===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<v;p++)this.render(f[p]/l,g[p]);else{m.multiDrawElementsWEBGL(r,g,0,a,f,0,v);let p=0;for(let _=0;_<v;_++)p+=g[_];t.update(p,r,1)}}this.setMode=o,this.setIndex=c,this.render=h,this.renderInstances=u,this.renderMultiDraw=d}function o0(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case s.TRIANGLES:t.triangles+=a*(r/3);break;case s.LINES:t.lines+=a*(r/2);break;case s.LINE_STRIP:t.lines+=a*(r-1);break;case s.LINE_LOOP:t.lines+=a*r;break;case s.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function a0(s,e){return s[0]-e[0]}function l0(s,e){return Math.abs(e[1])-Math.abs(s[1])}function c0(s,e,t){const n={},i=new Float32Array(8),r=new WeakMap,o=new at,a=[];for(let c=0;c<8;c++)a[c]=[c,0];function l(c,h,u){const d=c.morphTargetInfluences;if(e.isWebGL2===!0){const g=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,v=g!==void 0?g.length:0;let m=r.get(h);if(m===void 0||m.count!==v){let N=function(){z.dispose(),r.delete(h),h.removeEventListener("dispose",N)};var f=N;m!==void 0&&m.texture.dispose();const x=h.morphAttributes.position!==void 0,M=h.morphAttributes.normal!==void 0,y=h.morphAttributes.color!==void 0,b=h.morphAttributes.position||[],T=h.morphAttributes.normal||[],L=h.morphAttributes.color||[];let S=0;x===!0&&(S=1),M===!0&&(S=2),y===!0&&(S=3);let E=h.attributes.position.count*S,C=1;E>e.maxTextureSize&&(C=Math.ceil(E/e.maxTextureSize),E=e.maxTextureSize);const U=new Float32Array(E*C*4*v),z=new Ou(U,E,C,v);z.type=Dn,z.needsUpdate=!0;const D=S*4;for(let H=0;H<v;H++){const Z=b[H],B=T[H],X=L[H],$=E*C*4*H;for(let te=0;te<Z.count;te++){const Q=te*D;x===!0&&(o.fromBufferAttribute(Z,te),U[$+Q+0]=o.x,U[$+Q+1]=o.y,U[$+Q+2]=o.z,U[$+Q+3]=0),M===!0&&(o.fromBufferAttribute(B,te),U[$+Q+4]=o.x,U[$+Q+5]=o.y,U[$+Q+6]=o.z,U[$+Q+7]=0),y===!0&&(o.fromBufferAttribute(X,te),U[$+Q+8]=o.x,U[$+Q+9]=o.y,U[$+Q+10]=o.z,U[$+Q+11]=X.itemSize===4?o.w:1)}}m={count:v,texture:z,size:new _e(E,C)},r.set(h,m),h.addEventListener("dispose",N)}let p=0;for(let x=0;x<d.length;x++)p+=d[x];const _=h.morphTargetsRelative?1:1-p;u.getUniforms().setValue(s,"morphTargetBaseInfluence",_),u.getUniforms().setValue(s,"morphTargetInfluences",d),u.getUniforms().setValue(s,"morphTargetsTexture",m.texture,t),u.getUniforms().setValue(s,"morphTargetsTextureSize",m.size)}else{const g=d===void 0?0:d.length;let v=n[h.id];if(v===void 0||v.length!==g){v=[];for(let M=0;M<g;M++)v[M]=[M,0];n[h.id]=v}for(let M=0;M<g;M++){const y=v[M];y[0]=M,y[1]=d[M]}v.sort(l0);for(let M=0;M<8;M++)M<g&&v[M][1]?(a[M][0]=v[M][0],a[M][1]=v[M][1]):(a[M][0]=Number.MAX_SAFE_INTEGER,a[M][1]=0);a.sort(a0);const m=h.morphAttributes.position,p=h.morphAttributes.normal;let _=0;for(let M=0;M<8;M++){const y=a[M],b=y[0],T=y[1];b!==Number.MAX_SAFE_INTEGER&&T?(m&&h.getAttribute("morphTarget"+M)!==m[b]&&h.setAttribute("morphTarget"+M,m[b]),p&&h.getAttribute("morphNormal"+M)!==p[b]&&h.setAttribute("morphNormal"+M,p[b]),i[M]=T,_+=T):(m&&h.hasAttribute("morphTarget"+M)===!0&&h.deleteAttribute("morphTarget"+M),p&&h.hasAttribute("morphNormal"+M)===!0&&h.deleteAttribute("morphNormal"+M),i[M]=0)}const x=h.morphTargetsRelative?1:1-_;u.getUniforms().setValue(s,"morphTargetBaseInfluence",x),u.getUniforms().setValue(s,"morphTargetInfluences",i)}}return{update:l}}function h0(s,e,t,n){let i=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,u=e.get(l,h);if(i.get(u)!==c&&(e.update(u),i.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),i.get(l)!==c&&(t.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,s.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;i.get(d)!==c&&(d.update(),i.set(d,c))}return u}function o(){i=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:o}}class qa extends Bt{constructor(e,t,n,i,r,o,a,l,c,h){if(h=h!==void 0?h:Pi,h!==Pi&&h!==Ui)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Pi&&(n=si),n===void 0&&h===Ui&&(n=ui),super(null,i,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:Lt,this.minFilter=l!==void 0?l:Lt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const Wu=new Bt,Xu=new qa(1,1);Xu.compareFunction=Du;const Yu=new Ou,ju=new Zf,qu=new Vu,wc=[],Ac=[],Pc=new Float32Array(16),Rc=new Float32Array(9),Cc=new Float32Array(4);function Ts(s,e,t){const n=s[0];if(n<=0||n>0)return s;const i=e*t;let r=wc[i];if(r===void 0&&(r=new Float32Array(i),wc[i]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,s[o].toArray(r,a)}return r}function Dt(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function Ut(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function fo(s,e){let t=Ac[e];t===void 0&&(t=new Int32Array(e),Ac[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function u0(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function d0(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Dt(t,e))return;s.uniform2fv(this.addr,e),Ut(t,e)}}function f0(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Dt(t,e))return;s.uniform3fv(this.addr,e),Ut(t,e)}}function p0(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Dt(t,e))return;s.uniform4fv(this.addr,e),Ut(t,e)}}function m0(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Dt(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),Ut(t,e)}else{if(Dt(t,n))return;Cc.set(n),s.uniformMatrix2fv(this.addr,!1,Cc),Ut(t,n)}}function g0(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Dt(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),Ut(t,e)}else{if(Dt(t,n))return;Rc.set(n),s.uniformMatrix3fv(this.addr,!1,Rc),Ut(t,n)}}function v0(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Dt(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),Ut(t,e)}else{if(Dt(t,n))return;Pc.set(n),s.uniformMatrix4fv(this.addr,!1,Pc),Ut(t,n)}}function _0(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function x0(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Dt(t,e))return;s.uniform2iv(this.addr,e),Ut(t,e)}}function M0(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Dt(t,e))return;s.uniform3iv(this.addr,e),Ut(t,e)}}function y0(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Dt(t,e))return;s.uniform4iv(this.addr,e),Ut(t,e)}}function S0(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function E0(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Dt(t,e))return;s.uniform2uiv(this.addr,e),Ut(t,e)}}function b0(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Dt(t,e))return;s.uniform3uiv(this.addr,e),Ut(t,e)}}function T0(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Dt(t,e))return;s.uniform4uiv(this.addr,e),Ut(t,e)}}function w0(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);const r=this.type===s.SAMPLER_2D_SHADOW?Xu:Wu;t.setTexture2D(e||r,i)}function A0(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||ju,i)}function P0(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||qu,i)}function R0(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||Yu,i)}function C0(s){switch(s){case 5126:return u0;case 35664:return d0;case 35665:return f0;case 35666:return p0;case 35674:return m0;case 35675:return g0;case 35676:return v0;case 5124:case 35670:return _0;case 35667:case 35671:return x0;case 35668:case 35672:return M0;case 35669:case 35673:return y0;case 5125:return S0;case 36294:return E0;case 36295:return b0;case 36296:return T0;case 35678:case 36198:case 36298:case 36306:case 35682:return w0;case 35679:case 36299:case 36307:return A0;case 35680:case 36300:case 36308:case 36293:return P0;case 36289:case 36303:case 36311:case 36292:return R0}}function L0(s,e){s.uniform1fv(this.addr,e)}function I0(s,e){const t=Ts(e,this.size,2);s.uniform2fv(this.addr,t)}function D0(s,e){const t=Ts(e,this.size,3);s.uniform3fv(this.addr,t)}function U0(s,e){const t=Ts(e,this.size,4);s.uniform4fv(this.addr,t)}function F0(s,e){const t=Ts(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function N0(s,e){const t=Ts(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function O0(s,e){const t=Ts(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function B0(s,e){s.uniform1iv(this.addr,e)}function z0(s,e){s.uniform2iv(this.addr,e)}function H0(s,e){s.uniform3iv(this.addr,e)}function k0(s,e){s.uniform4iv(this.addr,e)}function V0(s,e){s.uniform1uiv(this.addr,e)}function G0(s,e){s.uniform2uiv(this.addr,e)}function W0(s,e){s.uniform3uiv(this.addr,e)}function X0(s,e){s.uniform4uiv(this.addr,e)}function Y0(s,e,t){const n=this.cache,i=e.length,r=fo(t,i);Dt(n,r)||(s.uniform1iv(this.addr,r),Ut(n,r));for(let o=0;o!==i;++o)t.setTexture2D(e[o]||Wu,r[o])}function j0(s,e,t){const n=this.cache,i=e.length,r=fo(t,i);Dt(n,r)||(s.uniform1iv(this.addr,r),Ut(n,r));for(let o=0;o!==i;++o)t.setTexture3D(e[o]||ju,r[o])}function q0(s,e,t){const n=this.cache,i=e.length,r=fo(t,i);Dt(n,r)||(s.uniform1iv(this.addr,r),Ut(n,r));for(let o=0;o!==i;++o)t.setTextureCube(e[o]||qu,r[o])}function Z0(s,e,t){const n=this.cache,i=e.length,r=fo(t,i);Dt(n,r)||(s.uniform1iv(this.addr,r),Ut(n,r));for(let o=0;o!==i;++o)t.setTexture2DArray(e[o]||Yu,r[o])}function K0(s){switch(s){case 5126:return L0;case 35664:return I0;case 35665:return D0;case 35666:return U0;case 35674:return F0;case 35675:return N0;case 35676:return O0;case 5124:case 35670:return B0;case 35667:case 35671:return z0;case 35668:case 35672:return H0;case 35669:case 35673:return k0;case 5125:return V0;case 36294:return G0;case 36295:return W0;case 36296:return X0;case 35678:case 36198:case 36298:case 36306:case 35682:return Y0;case 35679:case 36299:case 36307:return j0;case 35680:case 36300:case 36308:case 36293:return q0;case 36289:case 36303:case 36311:case 36292:return Z0}}class $0{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=C0(t.type)}}class Q0{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=K0(t.type)}}class J0{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let r=0,o=i.length;r!==o;++r){const a=i[r];a.setValue(e,t[a.id],n)}}}const Ko=/(\w+)(\])?(\[|\.)?/g;function Lc(s,e){s.seq.push(e),s.map[e.id]=e}function ev(s,e,t){const n=s.name,i=n.length;for(Ko.lastIndex=0;;){const r=Ko.exec(n),o=Ko.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===i){Lc(t,c===void 0?new $0(a,s,e):new Q0(a,s,e));break}else{let u=t.map[a];u===void 0&&(u=new J0(a),Lc(t,u)),t=u}}}class qr{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const r=e.getActiveUniform(t,i),o=e.getUniformLocation(t,r.name);ev(r,o,this)}}setValue(e,t,n,i){const r=this.map[t];r!==void 0&&r.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let r=0,o=t.length;r!==o;++r){const a=t[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,r=e.length;i!==r;++i){const o=e[i];o.id in t&&n.push(o)}return n}}function Ic(s,e,t){const n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}const tv=37297;let nv=0;function iv(s,e){const t=s.split(`
`),n=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=i;o<r;o++){const a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}function sv(s){const e=lt.getPrimaries(lt.workingColorSpace),t=lt.getPrimaries(s);let n;switch(e===t?n="":e===no&&t===to?n="LinearDisplayP3ToLinearSRGB":e===to&&t===no&&(n="LinearSRGBToLinearDisplayP3"),s){case jn:case ho:return[n,"LinearTransferOETF"];case Pt:case Va:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",s),[n,"LinearTransferOETF"]}}function Dc(s,e,t){const n=s.getShaderParameter(e,s.COMPILE_STATUS),i=s.getShaderInfoLog(e).trim();if(n&&i==="")return"";const r=/ERROR: 0:(\d+)/.exec(i);if(r){const o=parseInt(r[1]);return t.toUpperCase()+`

`+i+`

`+iv(s.getShaderSource(e),o)}else return i}function rv(s,e){const t=sv(e);return`vec4 ${s}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function ov(s,e){let t;switch(e){case _u:t="Linear";break;case xu:t="Reinhard";break;case Mu:t="OptimizedCineon";break;case Ha:t="ACESFilmic";break;case yu:t="AgX";break;case hf:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function av(s){return[s.extensionDerivatives||s.envMapCubeUVHeight||s.bumpMap||s.normalMapTangentSpace||s.clearcoatNormalMap||s.flatShading||s.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(s.extensionFragDepth||s.logarithmicDepthBuffer)&&s.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",s.extensionDrawBuffers&&s.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(s.extensionShaderTextureLOD||s.envMap||s.transmission)&&s.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(ds).join(`
`)}function lv(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(ds).join(`
`)}function cv(s){const e=[];for(const t in s){const n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function hv(s,e){const t={},n=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(e,i),o=r.name;let a=1;r.type===s.FLOAT_MAT2&&(a=2),r.type===s.FLOAT_MAT3&&(a=3),r.type===s.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:s.getAttribLocation(e,o),locationSize:a}}return t}function ds(s){return s!==""}function Uc(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Fc(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const uv=/^[ \t]*#include +<([\w\d./]+)>/gm;function wa(s){return s.replace(uv,fv)}const dv=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function fv(s,e){let t=Ze[e];if(t===void 0){const n=dv.get(e);if(n!==void 0)t=Ze[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return wa(t)}const pv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Nc(s){return s.replace(pv,mv)}function mv(s,e,t,n){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function Oc(s){let e="precision "+s.precision+` float;
precision `+s.precision+" int;";return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function gv(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===pu?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===kd?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===Wn&&(e="SHADOWMAP_TYPE_VSM"),e}function vv(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case xs:case Ms:e="ENVMAP_TYPE_CUBE";break;case lo:e="ENVMAP_TYPE_CUBE_UV";break}return e}function _v(s){let e="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case Ms:e="ENVMAP_MODE_REFRACTION";break}return e}function xv(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case ao:e="ENVMAP_BLENDING_MULTIPLY";break;case lf:e="ENVMAP_BLENDING_MIX";break;case cf:e="ENVMAP_BLENDING_ADD";break}return e}function Mv(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function yv(s,e,t,n){const i=s.getContext(),r=t.defines;let o=t.vertexShader,a=t.fragmentShader;const l=gv(t),c=vv(t),h=_v(t),u=xv(t),d=Mv(t),f=t.isWebGL2?"":av(t),g=lv(t),v=cv(r),m=i.createProgram();let p,_,x=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v].filter(ds).join(`
`),p.length>0&&(p+=`
`),_=[f,"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v].filter(ds).join(`
`),_.length>0&&(_+=`
`)):(p=[Oc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors&&t.isWebGL2?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ds).join(`
`),_=[f,Oc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==ci?"#define TONE_MAPPING":"",t.toneMapping!==ci?Ze.tonemapping_pars_fragment:"",t.toneMapping!==ci?ov("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ze.colorspace_pars_fragment,rv("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ds).join(`
`)),o=wa(o),o=Uc(o,t),o=Fc(o,t),a=wa(a),a=Uc(a,t),a=Fc(a,t),o=Nc(o),a=Nc(a),t.isWebGL2&&t.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,p=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,_=["precision mediump sampler2DArray;","#define varying in",t.glslVersion===tc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===tc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+_);const M=x+p+o,y=x+_+a,b=Ic(i,i.VERTEX_SHADER,M),T=Ic(i,i.FRAGMENT_SHADER,y);i.attachShader(m,b),i.attachShader(m,T),t.index0AttributeName!==void 0?i.bindAttribLocation(m,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(m,0,"position"),i.linkProgram(m);function L(U){if(s.debug.checkShaderErrors){const z=i.getProgramInfoLog(m).trim(),D=i.getShaderInfoLog(b).trim(),N=i.getShaderInfoLog(T).trim();let H=!0,Z=!0;if(i.getProgramParameter(m,i.LINK_STATUS)===!1)if(H=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,m,b,T);else{const B=Dc(i,b,"vertex"),X=Dc(i,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(m,i.VALIDATE_STATUS)+`

Program Info Log: `+z+`
`+B+`
`+X)}else z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",z):(D===""||N==="")&&(Z=!1);Z&&(U.diagnostics={runnable:H,programLog:z,vertexShader:{log:D,prefix:p},fragmentShader:{log:N,prefix:_}})}i.deleteShader(b),i.deleteShader(T),S=new qr(i,m),E=hv(i,m)}let S;this.getUniforms=function(){return S===void 0&&L(this),S};let E;this.getAttributes=function(){return E===void 0&&L(this),E};let C=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=i.getProgramParameter(m,tv)),C},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(m),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=nv++,this.cacheKey=e,this.usedTimes=1,this.program=m,this.vertexShader=b,this.fragmentShader=T,this}let Sv=0;class Ev{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new bv(e),t.set(e,n)),n}}class bv{constructor(e){this.id=Sv++,this.code=e,this.usedTimes=0}}function Tv(s,e,t,n,i,r,o){const a=new Wa,l=new Ev,c=[],h=i.isWebGL2,u=i.logarithmicDepthBuffer,d=i.vertexTextures;let f=i.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(S){return S===0?"uv":`uv${S}`}function m(S,E,C,U,z){const D=U.fog,N=z.geometry,H=S.isMeshStandardMaterial?U.environment:null,Z=(S.isMeshStandardMaterial?t:e).get(S.envMap||H),B=Z&&Z.mapping===lo?Z.image.height:null,X=g[S.type];S.precision!==null&&(f=i.getMaxPrecision(S.precision),f!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",f,"instead."));const $=N.morphAttributes.position||N.morphAttributes.normal||N.morphAttributes.color,te=$!==void 0?$.length:0;let Q=0;N.morphAttributes.position!==void 0&&(Q=1),N.morphAttributes.normal!==void 0&&(Q=2),N.morphAttributes.color!==void 0&&(Q=3);let V,J,ce,ve;if(X){const Tt=Ln[X];V=Tt.vertexShader,J=Tt.fragmentShader}else V=S.vertexShader,J=S.fragmentShader,l.update(S),ce=l.getVertexShaderID(S),ve=l.getFragmentShaderID(S);const fe=s.getRenderTarget(),Se=z.isInstancedMesh===!0,Pe=z.isBatchedMesh===!0,Ee=!!S.map,We=!!S.matcap,W=!!Z,_t=!!S.aoMap,Ae=!!S.lightMap,De=!!S.bumpMap,Me=!!S.normalMap,st=!!S.displacementMap,Oe=!!S.emissiveMap,R=!!S.metalnessMap,w=!!S.roughnessMap,G=S.anisotropy>0,re=S.clearcoat>0,se=S.iridescence>0,oe=S.sheen>0,we=S.transmission>0,de=G&&!!S.anisotropyMap,xe=re&&!!S.clearcoatMap,Re=re&&!!S.clearcoatNormalMap,He=re&&!!S.clearcoatRoughnessMap,ne=se&&!!S.iridescenceMap,et=se&&!!S.iridescenceThicknessMap,je=oe&&!!S.sheenColorMap,ke=oe&&!!S.sheenRoughnessMap,Ce=!!S.specularMap,ge=!!S.specularColorMap,F=!!S.specularIntensityMap,ae=we&&!!S.transmissionMap,be=we&&!!S.thicknessMap,me=!!S.gradientMap,ie=!!S.alphaMap,O=S.alphaTest>0,he=!!S.alphaHash,pe=!!S.extensions,Be=!!N.attributes.uv1,Fe=!!N.attributes.uv2,tt=!!N.attributes.uv3;let nt=ci;return S.toneMapped&&(fe===null||fe.isXRRenderTarget===!0)&&(nt=s.toneMapping),{isWebGL2:h,shaderID:X,shaderType:S.type,shaderName:S.name,vertexShader:V,fragmentShader:J,defines:S.defines,customVertexShaderID:ce,customFragmentShaderID:ve,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:f,batching:Pe,instancing:Se,instancingColor:Se&&z.instanceColor!==null,supportsVertexTextures:d,outputColorSpace:fe===null?s.outputColorSpace:fe.isXRRenderTarget===!0?fe.texture.colorSpace:jn,map:Ee,matcap:We,envMap:W,envMapMode:W&&Z.mapping,envMapCubeUVHeight:B,aoMap:_t,lightMap:Ae,bumpMap:De,normalMap:Me,displacementMap:d&&st,emissiveMap:Oe,normalMapObjectSpace:Me&&S.normalMapType===Sf,normalMapTangentSpace:Me&&S.normalMapType===co,metalnessMap:R,roughnessMap:w,anisotropy:G,anisotropyMap:de,clearcoat:re,clearcoatMap:xe,clearcoatNormalMap:Re,clearcoatRoughnessMap:He,iridescence:se,iridescenceMap:ne,iridescenceThicknessMap:et,sheen:oe,sheenColorMap:je,sheenRoughnessMap:ke,specularMap:Ce,specularColorMap:ge,specularIntensityMap:F,transmission:we,transmissionMap:ae,thicknessMap:be,gradientMap:me,opaque:S.transparent===!1&&S.blending===ms,alphaMap:ie,alphaTest:O,alphaHash:he,combine:S.combine,mapUv:Ee&&v(S.map.channel),aoMapUv:_t&&v(S.aoMap.channel),lightMapUv:Ae&&v(S.lightMap.channel),bumpMapUv:De&&v(S.bumpMap.channel),normalMapUv:Me&&v(S.normalMap.channel),displacementMapUv:st&&v(S.displacementMap.channel),emissiveMapUv:Oe&&v(S.emissiveMap.channel),metalnessMapUv:R&&v(S.metalnessMap.channel),roughnessMapUv:w&&v(S.roughnessMap.channel),anisotropyMapUv:de&&v(S.anisotropyMap.channel),clearcoatMapUv:xe&&v(S.clearcoatMap.channel),clearcoatNormalMapUv:Re&&v(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:He&&v(S.clearcoatRoughnessMap.channel),iridescenceMapUv:ne&&v(S.iridescenceMap.channel),iridescenceThicknessMapUv:et&&v(S.iridescenceThicknessMap.channel),sheenColorMapUv:je&&v(S.sheenColorMap.channel),sheenRoughnessMapUv:ke&&v(S.sheenRoughnessMap.channel),specularMapUv:Ce&&v(S.specularMap.channel),specularColorMapUv:ge&&v(S.specularColorMap.channel),specularIntensityMapUv:F&&v(S.specularIntensityMap.channel),transmissionMapUv:ae&&v(S.transmissionMap.channel),thicknessMapUv:be&&v(S.thicknessMap.channel),alphaMapUv:ie&&v(S.alphaMap.channel),vertexTangents:!!N.attributes.tangent&&(Me||G),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!N.attributes.color&&N.attributes.color.itemSize===4,vertexUv1s:Be,vertexUv2s:Fe,vertexUv3s:tt,pointsUvs:z.isPoints===!0&&!!N.attributes.uv&&(Ee||ie),fog:!!D,useFog:S.fog===!0,fogExp2:D&&D.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:z.isSkinnedMesh===!0,morphTargets:N.morphAttributes.position!==void 0,morphNormals:N.morphAttributes.normal!==void 0,morphColors:N.morphAttributes.color!==void 0,morphTargetsCount:te,morphTextureStride:Q,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:S.dithering,shadowMapEnabled:s.shadowMap.enabled&&C.length>0,shadowMapType:s.shadowMap.type,toneMapping:nt,useLegacyLights:s._useLegacyLights,decodeVideoTexture:Ee&&S.map.isVideoTexture===!0&&lt.getTransfer(S.map.colorSpace)===dt,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===rn,flipSided:S.side===Jt,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionDerivatives:pe&&S.extensions.derivatives===!0,extensionFragDepth:pe&&S.extensions.fragDepth===!0,extensionDrawBuffers:pe&&S.extensions.drawBuffers===!0,extensionShaderTextureLOD:pe&&S.extensions.shaderTextureLOD===!0,extensionClipCullDistance:pe&&S.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()}}function p(S){const E=[];if(S.shaderID?E.push(S.shaderID):(E.push(S.customVertexShaderID),E.push(S.customFragmentShaderID)),S.defines!==void 0)for(const C in S.defines)E.push(C),E.push(S.defines[C]);return S.isRawShaderMaterial===!1&&(_(E,S),x(E,S),E.push(s.outputColorSpace)),E.push(S.customProgramCacheKey),E.join()}function _(S,E){S.push(E.precision),S.push(E.outputColorSpace),S.push(E.envMapMode),S.push(E.envMapCubeUVHeight),S.push(E.mapUv),S.push(E.alphaMapUv),S.push(E.lightMapUv),S.push(E.aoMapUv),S.push(E.bumpMapUv),S.push(E.normalMapUv),S.push(E.displacementMapUv),S.push(E.emissiveMapUv),S.push(E.metalnessMapUv),S.push(E.roughnessMapUv),S.push(E.anisotropyMapUv),S.push(E.clearcoatMapUv),S.push(E.clearcoatNormalMapUv),S.push(E.clearcoatRoughnessMapUv),S.push(E.iridescenceMapUv),S.push(E.iridescenceThicknessMapUv),S.push(E.sheenColorMapUv),S.push(E.sheenRoughnessMapUv),S.push(E.specularMapUv),S.push(E.specularColorMapUv),S.push(E.specularIntensityMapUv),S.push(E.transmissionMapUv),S.push(E.thicknessMapUv),S.push(E.combine),S.push(E.fogExp2),S.push(E.sizeAttenuation),S.push(E.morphTargetsCount),S.push(E.morphAttributeCount),S.push(E.numDirLights),S.push(E.numPointLights),S.push(E.numSpotLights),S.push(E.numSpotLightMaps),S.push(E.numHemiLights),S.push(E.numRectAreaLights),S.push(E.numDirLightShadows),S.push(E.numPointLightShadows),S.push(E.numSpotLightShadows),S.push(E.numSpotLightShadowsWithMaps),S.push(E.numLightProbes),S.push(E.shadowMapType),S.push(E.toneMapping),S.push(E.numClippingPlanes),S.push(E.numClipIntersection),S.push(E.depthPacking)}function x(S,E){a.disableAll(),E.isWebGL2&&a.enable(0),E.supportsVertexTextures&&a.enable(1),E.instancing&&a.enable(2),E.instancingColor&&a.enable(3),E.matcap&&a.enable(4),E.envMap&&a.enable(5),E.normalMapObjectSpace&&a.enable(6),E.normalMapTangentSpace&&a.enable(7),E.clearcoat&&a.enable(8),E.iridescence&&a.enable(9),E.alphaTest&&a.enable(10),E.vertexColors&&a.enable(11),E.vertexAlphas&&a.enable(12),E.vertexUv1s&&a.enable(13),E.vertexUv2s&&a.enable(14),E.vertexUv3s&&a.enable(15),E.vertexTangents&&a.enable(16),E.anisotropy&&a.enable(17),E.alphaHash&&a.enable(18),E.batching&&a.enable(19),S.push(a.mask),a.disableAll(),E.fog&&a.enable(0),E.useFog&&a.enable(1),E.flatShading&&a.enable(2),E.logarithmicDepthBuffer&&a.enable(3),E.skinning&&a.enable(4),E.morphTargets&&a.enable(5),E.morphNormals&&a.enable(6),E.morphColors&&a.enable(7),E.premultipliedAlpha&&a.enable(8),E.shadowMapEnabled&&a.enable(9),E.useLegacyLights&&a.enable(10),E.doubleSided&&a.enable(11),E.flipSided&&a.enable(12),E.useDepthPacking&&a.enable(13),E.dithering&&a.enable(14),E.transmission&&a.enable(15),E.sheen&&a.enable(16),E.opaque&&a.enable(17),E.pointsUvs&&a.enable(18),E.decodeVideoTexture&&a.enable(19),S.push(a.mask)}function M(S){const E=g[S.type];let C;if(E){const U=Ln[E];C=Un.clone(U.uniforms)}else C=S.uniforms;return C}function y(S,E){let C;for(let U=0,z=c.length;U<z;U++){const D=c[U];if(D.cacheKey===E){C=D,++C.usedTimes;break}}return C===void 0&&(C=new yv(s,E,S,r),c.push(C)),C}function b(S){if(--S.usedTimes===0){const E=c.indexOf(S);c[E]=c[c.length-1],c.pop(),S.destroy()}}function T(S){l.remove(S)}function L(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:M,acquireProgram:y,releaseProgram:b,releaseShaderCache:T,programs:c,dispose:L}}function wv(){let s=new WeakMap;function e(r){let o=s.get(r);return o===void 0&&(o={},s.set(r,o)),o}function t(r){s.delete(r)}function n(r,o,a){s.get(r)[o]=a}function i(){s=new WeakMap}return{get:e,remove:t,update:n,dispose:i}}function Av(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function Bc(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function zc(){const s=[];let e=0;const t=[],n=[],i=[];function r(){e=0,t.length=0,n.length=0,i.length=0}function o(u,d,f,g,v,m){let p=s[e];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:g,renderOrder:u.renderOrder,z:v,group:m},s[e]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=v,p.group=m),e++,p}function a(u,d,f,g,v,m){const p=o(u,d,f,g,v,m);f.transmission>0?n.push(p):f.transparent===!0?i.push(p):t.push(p)}function l(u,d,f,g,v,m){const p=o(u,d,f,g,v,m);f.transmission>0?n.unshift(p):f.transparent===!0?i.unshift(p):t.unshift(p)}function c(u,d){t.length>1&&t.sort(u||Av),n.length>1&&n.sort(d||Bc),i.length>1&&i.sort(d||Bc)}function h(){for(let u=e,d=s.length;u<d;u++){const f=s[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:n,transparent:i,init:r,push:a,unshift:l,finish:h,sort:c}}function Pv(){let s=new WeakMap;function e(n,i){const r=s.get(n);let o;return r===void 0?(o=new zc,s.set(n,[o])):i>=r.length?(o=new zc,r.push(o)):o=r[i],o}function t(){s=new WeakMap}return{get:e,dispose:t}}function Rv(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new I,color:new Ne};break;case"SpotLight":t={position:new I,direction:new I,color:new Ne,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new I,color:new Ne,distance:0,decay:0};break;case"HemisphereLight":t={direction:new I,skyColor:new Ne,groundColor:new Ne};break;case"RectAreaLight":t={color:new Ne,position:new I,halfWidth:new I,halfHeight:new I};break}return s[e.id]=t,t}}}function Cv(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new _e};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new _e};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new _e,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let Lv=0;function Iv(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function Dv(s,e){const t=new Rv,n=Cv(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)i.probe.push(new I);const r=new I,o=new Le,a=new Le;function l(h,u){let d=0,f=0,g=0;for(let U=0;U<9;U++)i.probe[U].set(0,0,0);let v=0,m=0,p=0,_=0,x=0,M=0,y=0,b=0,T=0,L=0,S=0;h.sort(Iv);const E=u===!0?Math.PI:1;for(let U=0,z=h.length;U<z;U++){const D=h[U],N=D.color,H=D.intensity,Z=D.distance,B=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)d+=N.r*H*E,f+=N.g*H*E,g+=N.b*H*E;else if(D.isLightProbe){for(let X=0;X<9;X++)i.probe[X].addScaledVector(D.sh.coefficients[X],H);S++}else if(D.isDirectionalLight){const X=t.get(D);if(X.color.copy(D.color).multiplyScalar(D.intensity*E),D.castShadow){const $=D.shadow,te=n.get(D);te.shadowBias=$.bias,te.shadowNormalBias=$.normalBias,te.shadowRadius=$.radius,te.shadowMapSize=$.mapSize,i.directionalShadow[v]=te,i.directionalShadowMap[v]=B,i.directionalShadowMatrix[v]=D.shadow.matrix,M++}i.directional[v]=X,v++}else if(D.isSpotLight){const X=t.get(D);X.position.setFromMatrixPosition(D.matrixWorld),X.color.copy(N).multiplyScalar(H*E),X.distance=Z,X.coneCos=Math.cos(D.angle),X.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),X.decay=D.decay,i.spot[p]=X;const $=D.shadow;if(D.map&&(i.spotLightMap[T]=D.map,T++,$.updateMatrices(D),D.castShadow&&L++),i.spotLightMatrix[p]=$.matrix,D.castShadow){const te=n.get(D);te.shadowBias=$.bias,te.shadowNormalBias=$.normalBias,te.shadowRadius=$.radius,te.shadowMapSize=$.mapSize,i.spotShadow[p]=te,i.spotShadowMap[p]=B,b++}p++}else if(D.isRectAreaLight){const X=t.get(D);X.color.copy(N).multiplyScalar(H),X.halfWidth.set(D.width*.5,0,0),X.halfHeight.set(0,D.height*.5,0),i.rectArea[_]=X,_++}else if(D.isPointLight){const X=t.get(D);if(X.color.copy(D.color).multiplyScalar(D.intensity*E),X.distance=D.distance,X.decay=D.decay,D.castShadow){const $=D.shadow,te=n.get(D);te.shadowBias=$.bias,te.shadowNormalBias=$.normalBias,te.shadowRadius=$.radius,te.shadowMapSize=$.mapSize,te.shadowCameraNear=$.camera.near,te.shadowCameraFar=$.camera.far,i.pointShadow[m]=te,i.pointShadowMap[m]=B,i.pointShadowMatrix[m]=D.shadow.matrix,y++}i.point[m]=X,m++}else if(D.isHemisphereLight){const X=t.get(D);X.skyColor.copy(D.color).multiplyScalar(H*E),X.groundColor.copy(D.groundColor).multiplyScalar(H*E),i.hemi[x]=X,x++}}_>0&&(e.isWebGL2?s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ue.LTC_FLOAT_1,i.rectAreaLTC2=ue.LTC_FLOAT_2):(i.rectAreaLTC1=ue.LTC_HALF_1,i.rectAreaLTC2=ue.LTC_HALF_2):s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ue.LTC_FLOAT_1,i.rectAreaLTC2=ue.LTC_FLOAT_2):s.has("OES_texture_half_float_linear")===!0?(i.rectAreaLTC1=ue.LTC_HALF_1,i.rectAreaLTC2=ue.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),i.ambient[0]=d,i.ambient[1]=f,i.ambient[2]=g;const C=i.hash;(C.directionalLength!==v||C.pointLength!==m||C.spotLength!==p||C.rectAreaLength!==_||C.hemiLength!==x||C.numDirectionalShadows!==M||C.numPointShadows!==y||C.numSpotShadows!==b||C.numSpotMaps!==T||C.numLightProbes!==S)&&(i.directional.length=v,i.spot.length=p,i.rectArea.length=_,i.point.length=m,i.hemi.length=x,i.directionalShadow.length=M,i.directionalShadowMap.length=M,i.pointShadow.length=y,i.pointShadowMap.length=y,i.spotShadow.length=b,i.spotShadowMap.length=b,i.directionalShadowMatrix.length=M,i.pointShadowMatrix.length=y,i.spotLightMatrix.length=b+T-L,i.spotLightMap.length=T,i.numSpotLightShadowsWithMaps=L,i.numLightProbes=S,C.directionalLength=v,C.pointLength=m,C.spotLength=p,C.rectAreaLength=_,C.hemiLength=x,C.numDirectionalShadows=M,C.numPointShadows=y,C.numSpotShadows=b,C.numSpotMaps=T,C.numLightProbes=S,i.version=Lv++)}function c(h,u){let d=0,f=0,g=0,v=0,m=0;const p=u.matrixWorldInverse;for(let _=0,x=h.length;_<x;_++){const M=h[_];if(M.isDirectionalLight){const y=i.directional[d];y.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),y.direction.sub(r),y.direction.transformDirection(p),d++}else if(M.isSpotLight){const y=i.spot[g];y.position.setFromMatrixPosition(M.matrixWorld),y.position.applyMatrix4(p),y.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),y.direction.sub(r),y.direction.transformDirection(p),g++}else if(M.isRectAreaLight){const y=i.rectArea[v];y.position.setFromMatrixPosition(M.matrixWorld),y.position.applyMatrix4(p),a.identity(),o.copy(M.matrixWorld),o.premultiply(p),a.extractRotation(o),y.halfWidth.set(M.width*.5,0,0),y.halfHeight.set(0,M.height*.5,0),y.halfWidth.applyMatrix4(a),y.halfHeight.applyMatrix4(a),v++}else if(M.isPointLight){const y=i.point[f];y.position.setFromMatrixPosition(M.matrixWorld),y.position.applyMatrix4(p),f++}else if(M.isHemisphereLight){const y=i.hemi[m];y.direction.setFromMatrixPosition(M.matrixWorld),y.direction.transformDirection(p),m++}}}return{setup:l,setupView:c,state:i}}function Hc(s,e){const t=new Dv(s,e),n=[],i=[];function r(){n.length=0,i.length=0}function o(u){n.push(u)}function a(u){i.push(u)}function l(u){t.setup(n,u)}function c(u){t.setupView(n,u)}return{init:r,state:{lightsArray:n,shadowsArray:i,lights:t},setupLights:l,setupLightsView:c,pushLight:o,pushShadow:a}}function Uv(s,e){let t=new WeakMap;function n(r,o=0){const a=t.get(r);let l;return a===void 0?(l=new Hc(s,e),t.set(r,[l])):o>=a.length?(l=new Hc(s,e),a.push(l)):l=a[o],l}function i(){t=new WeakMap}return{get:n,dispose:i}}class Fv extends mi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Mf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Nv extends mi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const Ov=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Bv=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function zv(s,e,t){let n=new Ya;const i=new _e,r=new _e,o=new at,a=new Fv({depthPacking:yf}),l=new Nv,c={},h=t.maxTextureSize,u={[di]:Jt,[Jt]:di,[rn]:rn},d=new It({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new _e},radius:{value:4}},vertexShader:Ov,fragmentShader:Bv}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new St;g.setAttribute("position",new An(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new le(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=pu;let p=this.type;this.render=function(b,T,L){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||b.length===0)return;const S=s.getRenderTarget(),E=s.getActiveCubeFace(),C=s.getActiveMipmapLevel(),U=s.state;U.setBlending(Wt),U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const z=p!==Wn&&this.type===Wn,D=p===Wn&&this.type!==Wn;for(let N=0,H=b.length;N<H;N++){const Z=b[N],B=Z.shadow;if(B===void 0){console.warn("THREE.WebGLShadowMap:",Z,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;i.copy(B.mapSize);const X=B.getFrameExtents();if(i.multiply(X),r.copy(B.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/X.x),i.x=r.x*X.x,B.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/X.y),i.y=r.y*X.y,B.mapSize.y=r.y)),B.map===null||z===!0||D===!0){const te=this.type!==Wn?{minFilter:Lt,magFilter:Lt}:{};B.map!==null&&B.map.dispose(),B.map=new ln(i.x,i.y,te),B.map.texture.name=Z.name+".shadowMap",B.camera.updateProjectionMatrix()}s.setRenderTarget(B.map),s.clear();const $=B.getViewportCount();for(let te=0;te<$;te++){const Q=B.getViewport(te);o.set(r.x*Q.x,r.y*Q.y,r.x*Q.z,r.y*Q.w),U.viewport(o),B.updateMatrices(Z,te),n=B.getFrustum(),M(T,L,B.camera,Z,this.type)}B.isPointLightShadow!==!0&&this.type===Wn&&_(B,L),B.needsUpdate=!1}p=this.type,m.needsUpdate=!1,s.setRenderTarget(S,E,C)};function _(b,T){const L=e.update(v);d.defines.VSM_SAMPLES!==b.blurSamples&&(d.defines.VSM_SAMPLES=b.blurSamples,f.defines.VSM_SAMPLES=b.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new ln(i.x,i.y)),d.uniforms.shadow_pass.value=b.map.texture,d.uniforms.resolution.value=b.mapSize,d.uniforms.radius.value=b.radius,s.setRenderTarget(b.mapPass),s.clear(),s.renderBufferDirect(T,null,L,d,v,null),f.uniforms.shadow_pass.value=b.mapPass.texture,f.uniforms.resolution.value=b.mapSize,f.uniforms.radius.value=b.radius,s.setRenderTarget(b.map),s.clear(),s.renderBufferDirect(T,null,L,f,v,null)}function x(b,T,L,S){let E=null;const C=L.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(C!==void 0)E=C;else if(E=L.isPointLight===!0?l:a,s.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){const U=E.uuid,z=T.uuid;let D=c[U];D===void 0&&(D={},c[U]=D);let N=D[z];N===void 0&&(N=E.clone(),D[z]=N,T.addEventListener("dispose",y)),E=N}if(E.visible=T.visible,E.wireframe=T.wireframe,S===Wn?E.side=T.shadowSide!==null?T.shadowSide:T.side:E.side=T.shadowSide!==null?T.shadowSide:u[T.side],E.alphaMap=T.alphaMap,E.alphaTest=T.alphaTest,E.map=T.map,E.clipShadows=T.clipShadows,E.clippingPlanes=T.clippingPlanes,E.clipIntersection=T.clipIntersection,E.displacementMap=T.displacementMap,E.displacementScale=T.displacementScale,E.displacementBias=T.displacementBias,E.wireframeLinewidth=T.wireframeLinewidth,E.linewidth=T.linewidth,L.isPointLight===!0&&E.isMeshDistanceMaterial===!0){const U=s.properties.get(E);U.light=L}return E}function M(b,T,L,S,E){if(b.visible===!1)return;if(b.layers.test(T.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&E===Wn)&&(!b.frustumCulled||n.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(L.matrixWorldInverse,b.matrixWorld);const z=e.update(b),D=b.material;if(Array.isArray(D)){const N=z.groups;for(let H=0,Z=N.length;H<Z;H++){const B=N[H],X=D[B.materialIndex];if(X&&X.visible){const $=x(b,X,S,E);b.onBeforeShadow(s,b,T,L,z,$,B),s.renderBufferDirect(L,null,z,$,b,B),b.onAfterShadow(s,b,T,L,z,$,B)}}}else if(D.visible){const N=x(b,D,S,E);b.onBeforeShadow(s,b,T,L,z,N,null),s.renderBufferDirect(L,null,z,N,b,null),b.onAfterShadow(s,b,T,L,z,N,null)}}const U=b.children;for(let z=0,D=U.length;z<D;z++)M(U[z],T,L,S,E)}function y(b){b.target.removeEventListener("dispose",y);for(const L in c){const S=c[L],E=b.target.uuid;E in S&&(S[E].dispose(),delete S[E])}}}function Hv(s,e,t){const n=t.isWebGL2;function i(){let O=!1;const he=new at;let pe=null;const Be=new at(0,0,0,0);return{setMask:function(Fe){pe!==Fe&&!O&&(s.colorMask(Fe,Fe,Fe,Fe),pe=Fe)},setLocked:function(Fe){O=Fe},setClear:function(Fe,tt,nt,Et,Tt){Tt===!0&&(Fe*=Et,tt*=Et,nt*=Et),he.set(Fe,tt,nt,Et),Be.equals(he)===!1&&(s.clearColor(Fe,tt,nt,Et),Be.copy(he))},reset:function(){O=!1,pe=null,Be.set(-1,0,0,0)}}}function r(){let O=!1,he=null,pe=null,Be=null;return{setTest:function(Fe){Fe?Pe(s.DEPTH_TEST):Ee(s.DEPTH_TEST)},setMask:function(Fe){he!==Fe&&!O&&(s.depthMask(Fe),he=Fe)},setFunc:function(Fe){if(pe!==Fe){switch(Fe){case ef:s.depthFunc(s.NEVER);break;case tf:s.depthFunc(s.ALWAYS);break;case nf:s.depthFunc(s.LESS);break;case Kr:s.depthFunc(s.LEQUAL);break;case sf:s.depthFunc(s.EQUAL);break;case rf:s.depthFunc(s.GEQUAL);break;case of:s.depthFunc(s.GREATER);break;case af:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}pe=Fe}},setLocked:function(Fe){O=Fe},setClear:function(Fe){Be!==Fe&&(s.clearDepth(Fe),Be=Fe)},reset:function(){O=!1,he=null,pe=null,Be=null}}}function o(){let O=!1,he=null,pe=null,Be=null,Fe=null,tt=null,nt=null,Et=null,Tt=null;return{setTest:function(rt){O||(rt?Pe(s.STENCIL_TEST):Ee(s.STENCIL_TEST))},setMask:function(rt){he!==rt&&!O&&(s.stencilMask(rt),he=rt)},setFunc:function(rt,Rt,Rn){(pe!==rt||Be!==Rt||Fe!==Rn)&&(s.stencilFunc(rt,Rt,Rn),pe=rt,Be=Rt,Fe=Rn)},setOp:function(rt,Rt,Rn){(tt!==rt||nt!==Rt||Et!==Rn)&&(s.stencilOp(rt,Rt,Rn),tt=rt,nt=Rt,Et=Rn)},setLocked:function(rt){O=rt},setClear:function(rt){Tt!==rt&&(s.clearStencil(rt),Tt=rt)},reset:function(){O=!1,he=null,pe=null,Be=null,Fe=null,tt=null,nt=null,Et=null,Tt=null}}}const a=new i,l=new r,c=new o,h=new WeakMap,u=new WeakMap;let d={},f={},g=new WeakMap,v=[],m=null,p=!1,_=null,x=null,M=null,y=null,b=null,T=null,L=null,S=new Ne(0,0,0),E=0,C=!1,U=null,z=null,D=null,N=null,H=null;const Z=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let B=!1,X=0;const $=s.getParameter(s.VERSION);$.indexOf("WebGL")!==-1?(X=parseFloat(/^WebGL (\d)/.exec($)[1]),B=X>=1):$.indexOf("OpenGL ES")!==-1&&(X=parseFloat(/^OpenGL ES (\d)/.exec($)[1]),B=X>=2);let te=null,Q={};const V=s.getParameter(s.SCISSOR_BOX),J=s.getParameter(s.VIEWPORT),ce=new at().fromArray(V),ve=new at().fromArray(J);function fe(O,he,pe,Be){const Fe=new Uint8Array(4),tt=s.createTexture();s.bindTexture(O,tt),s.texParameteri(O,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(O,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let nt=0;nt<pe;nt++)n&&(O===s.TEXTURE_3D||O===s.TEXTURE_2D_ARRAY)?s.texImage3D(he,0,s.RGBA,1,1,Be,0,s.RGBA,s.UNSIGNED_BYTE,Fe):s.texImage2D(he+nt,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Fe);return tt}const Se={};Se[s.TEXTURE_2D]=fe(s.TEXTURE_2D,s.TEXTURE_2D,1),Se[s.TEXTURE_CUBE_MAP]=fe(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(Se[s.TEXTURE_2D_ARRAY]=fe(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),Se[s.TEXTURE_3D]=fe(s.TEXTURE_3D,s.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),l.setClear(1),c.setClear(0),Pe(s.DEPTH_TEST),l.setFunc(Kr),Oe(!1),R(_l),Pe(s.CULL_FACE),Me(Wt);function Pe(O){d[O]!==!0&&(s.enable(O),d[O]=!0)}function Ee(O){d[O]!==!1&&(s.disable(O),d[O]=!1)}function We(O,he){return f[O]!==he?(s.bindFramebuffer(O,he),f[O]=he,n&&(O===s.DRAW_FRAMEBUFFER&&(f[s.FRAMEBUFFER]=he),O===s.FRAMEBUFFER&&(f[s.DRAW_FRAMEBUFFER]=he)),!0):!1}function W(O,he){let pe=v,Be=!1;if(O)if(pe=g.get(he),pe===void 0&&(pe=[],g.set(he,pe)),O.isWebGLMultipleRenderTargets){const Fe=O.texture;if(pe.length!==Fe.length||pe[0]!==s.COLOR_ATTACHMENT0){for(let tt=0,nt=Fe.length;tt<nt;tt++)pe[tt]=s.COLOR_ATTACHMENT0+tt;pe.length=Fe.length,Be=!0}}else pe[0]!==s.COLOR_ATTACHMENT0&&(pe[0]=s.COLOR_ATTACHMENT0,Be=!0);else pe[0]!==s.BACK&&(pe[0]=s.BACK,Be=!0);Be&&(t.isWebGL2?s.drawBuffers(pe):e.get("WEBGL_draw_buffers").drawBuffersWEBGL(pe))}function _t(O){return m!==O?(s.useProgram(O),m=O,!0):!1}const Ae={[Xn]:s.FUNC_ADD,[Vd]:s.FUNC_SUBTRACT,[Gd]:s.FUNC_REVERSE_SUBTRACT};if(n)Ae[yl]=s.MIN,Ae[Sl]=s.MAX;else{const O=e.get("EXT_blend_minmax");O!==null&&(Ae[yl]=O.MIN_EXT,Ae[Sl]=O.MAX_EXT)}const De={[xa]:s.ZERO,[Wd]:s.ONE,[Xd]:s.SRC_COLOR,[Ma]:s.SRC_ALPHA,[Zd]:s.SRC_ALPHA_SATURATE,[vu]:s.DST_COLOR,[gu]:s.DST_ALPHA,[Yd]:s.ONE_MINUS_SRC_COLOR,[ya]:s.ONE_MINUS_SRC_ALPHA,[qd]:s.ONE_MINUS_DST_COLOR,[jd]:s.ONE_MINUS_DST_ALPHA,[Kd]:s.CONSTANT_COLOR,[$d]:s.ONE_MINUS_CONSTANT_COLOR,[Qd]:s.CONSTANT_ALPHA,[Jd]:s.ONE_MINUS_CONSTANT_ALPHA};function Me(O,he,pe,Be,Fe,tt,nt,Et,Tt,rt){if(O===Wt){p===!0&&(Ee(s.BLEND),p=!1);return}if(p===!1&&(Pe(s.BLEND),p=!0),O!==mu){if(O!==_||rt!==C){if((x!==Xn||b!==Xn)&&(s.blendEquation(s.FUNC_ADD),x=Xn,b=Xn),rt)switch(O){case ms:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case _a:s.blendFunc(s.ONE,s.ONE);break;case xl:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Ml:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",O);break}else switch(O){case ms:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case _a:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case xl:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Ml:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",O);break}M=null,y=null,T=null,L=null,S.set(0,0,0),E=0,_=O,C=rt}return}Fe=Fe||he,tt=tt||pe,nt=nt||Be,(he!==x||Fe!==b)&&(s.blendEquationSeparate(Ae[he],Ae[Fe]),x=he,b=Fe),(pe!==M||Be!==y||tt!==T||nt!==L)&&(s.blendFuncSeparate(De[pe],De[Be],De[tt],De[nt]),M=pe,y=Be,T=tt,L=nt),(Et.equals(S)===!1||Tt!==E)&&(s.blendColor(Et.r,Et.g,Et.b,Tt),S.copy(Et),E=Tt),_=O,C=!1}function st(O,he){O.side===rn?Ee(s.CULL_FACE):Pe(s.CULL_FACE);let pe=O.side===Jt;he&&(pe=!pe),Oe(pe),O.blending===ms&&O.transparent===!1?Me(Wt):Me(O.blending,O.blendEquation,O.blendSrc,O.blendDst,O.blendEquationAlpha,O.blendSrcAlpha,O.blendDstAlpha,O.blendColor,O.blendAlpha,O.premultipliedAlpha),l.setFunc(O.depthFunc),l.setTest(O.depthTest),l.setMask(O.depthWrite),a.setMask(O.colorWrite);const Be=O.stencilWrite;c.setTest(Be),Be&&(c.setMask(O.stencilWriteMask),c.setFunc(O.stencilFunc,O.stencilRef,O.stencilFuncMask),c.setOp(O.stencilFail,O.stencilZFail,O.stencilZPass)),G(O.polygonOffset,O.polygonOffsetFactor,O.polygonOffsetUnits),O.alphaToCoverage===!0?Pe(s.SAMPLE_ALPHA_TO_COVERAGE):Ee(s.SAMPLE_ALPHA_TO_COVERAGE)}function Oe(O){U!==O&&(O?s.frontFace(s.CW):s.frontFace(s.CCW),U=O)}function R(O){O!==Bd?(Pe(s.CULL_FACE),O!==z&&(O===_l?s.cullFace(s.BACK):O===zd?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):Ee(s.CULL_FACE),z=O}function w(O){O!==D&&(B&&s.lineWidth(O),D=O)}function G(O,he,pe){O?(Pe(s.POLYGON_OFFSET_FILL),(N!==he||H!==pe)&&(s.polygonOffset(he,pe),N=he,H=pe)):Ee(s.POLYGON_OFFSET_FILL)}function re(O){O?Pe(s.SCISSOR_TEST):Ee(s.SCISSOR_TEST)}function se(O){O===void 0&&(O=s.TEXTURE0+Z-1),te!==O&&(s.activeTexture(O),te=O)}function oe(O,he,pe){pe===void 0&&(te===null?pe=s.TEXTURE0+Z-1:pe=te);let Be=Q[pe];Be===void 0&&(Be={type:void 0,texture:void 0},Q[pe]=Be),(Be.type!==O||Be.texture!==he)&&(te!==pe&&(s.activeTexture(pe),te=pe),s.bindTexture(O,he||Se[O]),Be.type=O,Be.texture=he)}function we(){const O=Q[te];O!==void 0&&O.type!==void 0&&(s.bindTexture(O.type,null),O.type=void 0,O.texture=void 0)}function de(){try{s.compressedTexImage2D.apply(s,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function xe(){try{s.compressedTexImage3D.apply(s,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Re(){try{s.texSubImage2D.apply(s,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function He(){try{s.texSubImage3D.apply(s,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function ne(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function et(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function je(){try{s.texStorage2D.apply(s,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function ke(){try{s.texStorage3D.apply(s,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Ce(){try{s.texImage2D.apply(s,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function ge(){try{s.texImage3D.apply(s,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function F(O){ce.equals(O)===!1&&(s.scissor(O.x,O.y,O.z,O.w),ce.copy(O))}function ae(O){ve.equals(O)===!1&&(s.viewport(O.x,O.y,O.z,O.w),ve.copy(O))}function be(O,he){let pe=u.get(he);pe===void 0&&(pe=new WeakMap,u.set(he,pe));let Be=pe.get(O);Be===void 0&&(Be=s.getUniformBlockIndex(he,O.name),pe.set(O,Be))}function me(O,he){const Be=u.get(he).get(O);h.get(he)!==Be&&(s.uniformBlockBinding(he,Be,O.__bindingPointIndex),h.set(he,Be))}function ie(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),n===!0&&(s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null)),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),d={},te=null,Q={},f={},g=new WeakMap,v=[],m=null,p=!1,_=null,x=null,M=null,y=null,b=null,T=null,L=null,S=new Ne(0,0,0),E=0,C=!1,U=null,z=null,D=null,N=null,H=null,ce.set(0,0,s.canvas.width,s.canvas.height),ve.set(0,0,s.canvas.width,s.canvas.height),a.reset(),l.reset(),c.reset()}return{buffers:{color:a,depth:l,stencil:c},enable:Pe,disable:Ee,bindFramebuffer:We,drawBuffers:W,useProgram:_t,setBlending:Me,setMaterial:st,setFlipSided:Oe,setCullFace:R,setLineWidth:w,setPolygonOffset:G,setScissorTest:re,activeTexture:se,bindTexture:oe,unbindTexture:we,compressedTexImage2D:de,compressedTexImage3D:xe,texImage2D:Ce,texImage3D:ge,updateUBOMapping:be,uniformBlockBinding:me,texStorage2D:je,texStorage3D:ke,texSubImage2D:Re,texSubImage3D:He,compressedTexSubImage2D:ne,compressedTexSubImage3D:et,scissor:F,viewport:ae,reset:ie}}function kv(s,e,t,n,i,r,o){const a=i.isWebGL2,l=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(R,w){return f?new OffscreenCanvas(R,w):Ys("canvas")}function v(R,w,G,re){let se=1;if((R.width>re||R.height>re)&&(se=re/Math.max(R.width,R.height)),se<1||w===!0)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap){const oe=w?so:Math.floor,we=oe(se*R.width),de=oe(se*R.height);u===void 0&&(u=g(we,de));const xe=G?g(we,de):u;return xe.width=we,xe.height=de,xe.getContext("2d").drawImage(R,0,0,we,de),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+R.width+"x"+R.height+") to ("+we+"x"+de+")."),xe}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+R.width+"x"+R.height+")."),R;return R}function m(R){return Ta(R.width)&&Ta(R.height)}function p(R){return a?!1:R.wrapS!==on||R.wrapT!==on||R.minFilter!==Lt&&R.minFilter!==dn}function _(R,w){return R.generateMipmaps&&w&&R.minFilter!==Lt&&R.minFilter!==dn}function x(R){s.generateMipmap(R)}function M(R,w,G,re,se=!1){if(a===!1)return w;if(R!==null){if(s[R]!==void 0)return s[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let oe=w;if(w===s.RED&&(G===s.FLOAT&&(oe=s.R32F),G===s.HALF_FLOAT&&(oe=s.R16F),G===s.UNSIGNED_BYTE&&(oe=s.R8)),w===s.RED_INTEGER&&(G===s.UNSIGNED_BYTE&&(oe=s.R8UI),G===s.UNSIGNED_SHORT&&(oe=s.R16UI),G===s.UNSIGNED_INT&&(oe=s.R32UI),G===s.BYTE&&(oe=s.R8I),G===s.SHORT&&(oe=s.R16I),G===s.INT&&(oe=s.R32I)),w===s.RG&&(G===s.FLOAT&&(oe=s.RG32F),G===s.HALF_FLOAT&&(oe=s.RG16F),G===s.UNSIGNED_BYTE&&(oe=s.RG8)),w===s.RGBA){const we=se?eo:lt.getTransfer(re);G===s.FLOAT&&(oe=s.RGBA32F),G===s.HALF_FLOAT&&(oe=s.RGBA16F),G===s.UNSIGNED_BYTE&&(oe=we===dt?s.SRGB8_ALPHA8:s.RGBA8),G===s.UNSIGNED_SHORT_4_4_4_4&&(oe=s.RGBA4),G===s.UNSIGNED_SHORT_5_5_5_1&&(oe=s.RGB5_A1)}return(oe===s.R16F||oe===s.R32F||oe===s.RG16F||oe===s.RG32F||oe===s.RGBA16F||oe===s.RGBA32F)&&e.get("EXT_color_buffer_float"),oe}function y(R,w,G){return _(R,G)===!0||R.isFramebufferTexture&&R.minFilter!==Lt&&R.minFilter!==dn?Math.log2(Math.max(w.width,w.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?w.mipmaps.length:1}function b(R){return R===Lt||R===bl||R===So?s.NEAREST:s.LINEAR}function T(R){const w=R.target;w.removeEventListener("dispose",T),S(w),w.isVideoTexture&&h.delete(w)}function L(R){const w=R.target;w.removeEventListener("dispose",L),C(w)}function S(R){const w=n.get(R);if(w.__webglInit===void 0)return;const G=R.source,re=d.get(G);if(re){const se=re[w.__cacheKey];se.usedTimes--,se.usedTimes===0&&E(R),Object.keys(re).length===0&&d.delete(G)}n.remove(R)}function E(R){const w=n.get(R);s.deleteTexture(w.__webglTexture);const G=R.source,re=d.get(G);delete re[w.__cacheKey],o.memory.textures--}function C(R){const w=R.texture,G=n.get(R),re=n.get(w);if(re.__webglTexture!==void 0&&(s.deleteTexture(re.__webglTexture),o.memory.textures--),R.depthTexture&&R.depthTexture.dispose(),R.isWebGLCubeRenderTarget)for(let se=0;se<6;se++){if(Array.isArray(G.__webglFramebuffer[se]))for(let oe=0;oe<G.__webglFramebuffer[se].length;oe++)s.deleteFramebuffer(G.__webglFramebuffer[se][oe]);else s.deleteFramebuffer(G.__webglFramebuffer[se]);G.__webglDepthbuffer&&s.deleteRenderbuffer(G.__webglDepthbuffer[se])}else{if(Array.isArray(G.__webglFramebuffer))for(let se=0;se<G.__webglFramebuffer.length;se++)s.deleteFramebuffer(G.__webglFramebuffer[se]);else s.deleteFramebuffer(G.__webglFramebuffer);if(G.__webglDepthbuffer&&s.deleteRenderbuffer(G.__webglDepthbuffer),G.__webglMultisampledFramebuffer&&s.deleteFramebuffer(G.__webglMultisampledFramebuffer),G.__webglColorRenderbuffer)for(let se=0;se<G.__webglColorRenderbuffer.length;se++)G.__webglColorRenderbuffer[se]&&s.deleteRenderbuffer(G.__webglColorRenderbuffer[se]);G.__webglDepthRenderbuffer&&s.deleteRenderbuffer(G.__webglDepthRenderbuffer)}if(R.isWebGLMultipleRenderTargets)for(let se=0,oe=w.length;se<oe;se++){const we=n.get(w[se]);we.__webglTexture&&(s.deleteTexture(we.__webglTexture),o.memory.textures--),n.remove(w[se])}n.remove(w),n.remove(R)}let U=0;function z(){U=0}function D(){const R=U;return R>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+i.maxTextures),U+=1,R}function N(R){const w=[];return w.push(R.wrapS),w.push(R.wrapT),w.push(R.wrapR||0),w.push(R.magFilter),w.push(R.minFilter),w.push(R.anisotropy),w.push(R.internalFormat),w.push(R.format),w.push(R.type),w.push(R.generateMipmaps),w.push(R.premultiplyAlpha),w.push(R.flipY),w.push(R.unpackAlignment),w.push(R.colorSpace),w.join()}function H(R,w){const G=n.get(R);if(R.isVideoTexture&&st(R),R.isRenderTargetTexture===!1&&R.version>0&&G.__version!==R.version){const re=R.image;if(re===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(re.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ce(G,R,w);return}}t.bindTexture(s.TEXTURE_2D,G.__webglTexture,s.TEXTURE0+w)}function Z(R,w){const G=n.get(R);if(R.version>0&&G.__version!==R.version){ce(G,R,w);return}t.bindTexture(s.TEXTURE_2D_ARRAY,G.__webglTexture,s.TEXTURE0+w)}function B(R,w){const G=n.get(R);if(R.version>0&&G.__version!==R.version){ce(G,R,w);return}t.bindTexture(s.TEXTURE_3D,G.__webglTexture,s.TEXTURE0+w)}function X(R,w){const G=n.get(R);if(R.version>0&&G.__version!==R.version){ve(G,R,w);return}t.bindTexture(s.TEXTURE_CUBE_MAP,G.__webglTexture,s.TEXTURE0+w)}const $={[Di]:s.REPEAT,[on]:s.CLAMP_TO_EDGE,[Ea]:s.MIRRORED_REPEAT},te={[Lt]:s.NEAREST,[bl]:s.NEAREST_MIPMAP_NEAREST,[So]:s.NEAREST_MIPMAP_LINEAR,[dn]:s.LINEAR,[df]:s.LINEAR_MIPMAP_NEAREST,[Xs]:s.LINEAR_MIPMAP_LINEAR},Q={[Ef]:s.NEVER,[Rf]:s.ALWAYS,[bf]:s.LESS,[Du]:s.LEQUAL,[Tf]:s.EQUAL,[Pf]:s.GEQUAL,[wf]:s.GREATER,[Af]:s.NOTEQUAL};function V(R,w,G){if(G?(s.texParameteri(R,s.TEXTURE_WRAP_S,$[w.wrapS]),s.texParameteri(R,s.TEXTURE_WRAP_T,$[w.wrapT]),(R===s.TEXTURE_3D||R===s.TEXTURE_2D_ARRAY)&&s.texParameteri(R,s.TEXTURE_WRAP_R,$[w.wrapR]),s.texParameteri(R,s.TEXTURE_MAG_FILTER,te[w.magFilter]),s.texParameteri(R,s.TEXTURE_MIN_FILTER,te[w.minFilter])):(s.texParameteri(R,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(R,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE),(R===s.TEXTURE_3D||R===s.TEXTURE_2D_ARRAY)&&s.texParameteri(R,s.TEXTURE_WRAP_R,s.CLAMP_TO_EDGE),(w.wrapS!==on||w.wrapT!==on)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),s.texParameteri(R,s.TEXTURE_MAG_FILTER,b(w.magFilter)),s.texParameteri(R,s.TEXTURE_MIN_FILTER,b(w.minFilter)),w.minFilter!==Lt&&w.minFilter!==dn&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),w.compareFunction&&(s.texParameteri(R,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(R,s.TEXTURE_COMPARE_FUNC,Q[w.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){const re=e.get("EXT_texture_filter_anisotropic");if(w.magFilter===Lt||w.minFilter!==So&&w.minFilter!==Xs||w.type===Dn&&e.has("OES_texture_float_linear")===!1||a===!1&&w.type===wn&&e.has("OES_texture_half_float_linear")===!1)return;(w.anisotropy>1||n.get(w).__currentAnisotropy)&&(s.texParameterf(R,re.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,i.getMaxAnisotropy())),n.get(w).__currentAnisotropy=w.anisotropy)}}function J(R,w){let G=!1;R.__webglInit===void 0&&(R.__webglInit=!0,w.addEventListener("dispose",T));const re=w.source;let se=d.get(re);se===void 0&&(se={},d.set(re,se));const oe=N(w);if(oe!==R.__cacheKey){se[oe]===void 0&&(se[oe]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,G=!0),se[oe].usedTimes++;const we=se[R.__cacheKey];we!==void 0&&(se[R.__cacheKey].usedTimes--,we.usedTimes===0&&E(w)),R.__cacheKey=oe,R.__webglTexture=se[oe].texture}return G}function ce(R,w,G){let re=s.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(re=s.TEXTURE_2D_ARRAY),w.isData3DTexture&&(re=s.TEXTURE_3D);const se=J(R,w),oe=w.source;t.bindTexture(re,R.__webglTexture,s.TEXTURE0+G);const we=n.get(oe);if(oe.version!==we.__version||se===!0){t.activeTexture(s.TEXTURE0+G);const de=lt.getPrimaries(lt.workingColorSpace),xe=w.colorSpace===mn?null:lt.getPrimaries(w.colorSpace),Re=w.colorSpace===mn||de===xe?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,w.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,w.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Re);const He=p(w)&&m(w.image)===!1;let ne=v(w.image,He,!1,i.maxTextureSize);ne=Oe(w,ne);const et=m(ne)||a,je=r.convert(w.format,w.colorSpace);let ke=r.convert(w.type),Ce=M(w.internalFormat,je,ke,w.colorSpace,w.isVideoTexture);V(re,w,et);let ge;const F=w.mipmaps,ae=a&&w.isVideoTexture!==!0&&Ce!==Lu,be=we.__version===void 0||se===!0,me=y(w,ne,et);if(w.isDepthTexture)Ce=s.DEPTH_COMPONENT,a?w.type===Dn?Ce=s.DEPTH_COMPONENT32F:w.type===si?Ce=s.DEPTH_COMPONENT24:w.type===ui?Ce=s.DEPTH24_STENCIL8:Ce=s.DEPTH_COMPONENT16:w.type===Dn&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),w.format===Pi&&Ce===s.DEPTH_COMPONENT&&w.type!==ka&&w.type!==si&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),w.type=si,ke=r.convert(w.type)),w.format===Ui&&Ce===s.DEPTH_COMPONENT&&(Ce=s.DEPTH_STENCIL,w.type!==ui&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),w.type=ui,ke=r.convert(w.type))),be&&(ae?t.texStorage2D(s.TEXTURE_2D,1,Ce,ne.width,ne.height):t.texImage2D(s.TEXTURE_2D,0,Ce,ne.width,ne.height,0,je,ke,null));else if(w.isDataTexture)if(F.length>0&&et){ae&&be&&t.texStorage2D(s.TEXTURE_2D,me,Ce,F[0].width,F[0].height);for(let ie=0,O=F.length;ie<O;ie++)ge=F[ie],ae?t.texSubImage2D(s.TEXTURE_2D,ie,0,0,ge.width,ge.height,je,ke,ge.data):t.texImage2D(s.TEXTURE_2D,ie,Ce,ge.width,ge.height,0,je,ke,ge.data);w.generateMipmaps=!1}else ae?(be&&t.texStorage2D(s.TEXTURE_2D,me,Ce,ne.width,ne.height),t.texSubImage2D(s.TEXTURE_2D,0,0,0,ne.width,ne.height,je,ke,ne.data)):t.texImage2D(s.TEXTURE_2D,0,Ce,ne.width,ne.height,0,je,ke,ne.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){ae&&be&&t.texStorage3D(s.TEXTURE_2D_ARRAY,me,Ce,F[0].width,F[0].height,ne.depth);for(let ie=0,O=F.length;ie<O;ie++)ge=F[ie],w.format!==pn?je!==null?ae?t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,ie,0,0,0,ge.width,ge.height,ne.depth,je,ge.data,0,0):t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,ie,Ce,ge.width,ge.height,ne.depth,0,ge.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ae?t.texSubImage3D(s.TEXTURE_2D_ARRAY,ie,0,0,0,ge.width,ge.height,ne.depth,je,ke,ge.data):t.texImage3D(s.TEXTURE_2D_ARRAY,ie,Ce,ge.width,ge.height,ne.depth,0,je,ke,ge.data)}else{ae&&be&&t.texStorage2D(s.TEXTURE_2D,me,Ce,F[0].width,F[0].height);for(let ie=0,O=F.length;ie<O;ie++)ge=F[ie],w.format!==pn?je!==null?ae?t.compressedTexSubImage2D(s.TEXTURE_2D,ie,0,0,ge.width,ge.height,je,ge.data):t.compressedTexImage2D(s.TEXTURE_2D,ie,Ce,ge.width,ge.height,0,ge.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ae?t.texSubImage2D(s.TEXTURE_2D,ie,0,0,ge.width,ge.height,je,ke,ge.data):t.texImage2D(s.TEXTURE_2D,ie,Ce,ge.width,ge.height,0,je,ke,ge.data)}else if(w.isDataArrayTexture)ae?(be&&t.texStorage3D(s.TEXTURE_2D_ARRAY,me,Ce,ne.width,ne.height,ne.depth),t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,ne.width,ne.height,ne.depth,je,ke,ne.data)):t.texImage3D(s.TEXTURE_2D_ARRAY,0,Ce,ne.width,ne.height,ne.depth,0,je,ke,ne.data);else if(w.isData3DTexture)ae?(be&&t.texStorage3D(s.TEXTURE_3D,me,Ce,ne.width,ne.height,ne.depth),t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,ne.width,ne.height,ne.depth,je,ke,ne.data)):t.texImage3D(s.TEXTURE_3D,0,Ce,ne.width,ne.height,ne.depth,0,je,ke,ne.data);else if(w.isFramebufferTexture){if(be)if(ae)t.texStorage2D(s.TEXTURE_2D,me,Ce,ne.width,ne.height);else{let ie=ne.width,O=ne.height;for(let he=0;he<me;he++)t.texImage2D(s.TEXTURE_2D,he,Ce,ie,O,0,je,ke,null),ie>>=1,O>>=1}}else if(F.length>0&&et){ae&&be&&t.texStorage2D(s.TEXTURE_2D,me,Ce,F[0].width,F[0].height);for(let ie=0,O=F.length;ie<O;ie++)ge=F[ie],ae?t.texSubImage2D(s.TEXTURE_2D,ie,0,0,je,ke,ge):t.texImage2D(s.TEXTURE_2D,ie,Ce,je,ke,ge);w.generateMipmaps=!1}else ae?(be&&t.texStorage2D(s.TEXTURE_2D,me,Ce,ne.width,ne.height),t.texSubImage2D(s.TEXTURE_2D,0,0,0,je,ke,ne)):t.texImage2D(s.TEXTURE_2D,0,Ce,je,ke,ne);_(w,et)&&x(re),we.__version=oe.version,w.onUpdate&&w.onUpdate(w)}R.__version=w.version}function ve(R,w,G){if(w.image.length!==6)return;const re=J(R,w),se=w.source;t.bindTexture(s.TEXTURE_CUBE_MAP,R.__webglTexture,s.TEXTURE0+G);const oe=n.get(se);if(se.version!==oe.__version||re===!0){t.activeTexture(s.TEXTURE0+G);const we=lt.getPrimaries(lt.workingColorSpace),de=w.colorSpace===mn?null:lt.getPrimaries(w.colorSpace),xe=w.colorSpace===mn||we===de?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,w.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,w.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,xe);const Re=w.isCompressedTexture||w.image[0].isCompressedTexture,He=w.image[0]&&w.image[0].isDataTexture,ne=[];for(let ie=0;ie<6;ie++)!Re&&!He?ne[ie]=v(w.image[ie],!1,!0,i.maxCubemapSize):ne[ie]=He?w.image[ie].image:w.image[ie],ne[ie]=Oe(w,ne[ie]);const et=ne[0],je=m(et)||a,ke=r.convert(w.format,w.colorSpace),Ce=r.convert(w.type),ge=M(w.internalFormat,ke,Ce,w.colorSpace),F=a&&w.isVideoTexture!==!0,ae=oe.__version===void 0||re===!0;let be=y(w,et,je);V(s.TEXTURE_CUBE_MAP,w,je);let me;if(Re){F&&ae&&t.texStorage2D(s.TEXTURE_CUBE_MAP,be,ge,et.width,et.height);for(let ie=0;ie<6;ie++){me=ne[ie].mipmaps;for(let O=0;O<me.length;O++){const he=me[O];w.format!==pn?ke!==null?F?t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,O,0,0,he.width,he.height,ke,he.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,O,ge,he.width,he.height,0,he.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):F?t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,O,0,0,he.width,he.height,ke,Ce,he.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,O,ge,he.width,he.height,0,ke,Ce,he.data)}}}else{me=w.mipmaps,F&&ae&&(me.length>0&&be++,t.texStorage2D(s.TEXTURE_CUBE_MAP,be,ge,ne[0].width,ne[0].height));for(let ie=0;ie<6;ie++)if(He){F?t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,0,0,ne[ie].width,ne[ie].height,ke,Ce,ne[ie].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,ge,ne[ie].width,ne[ie].height,0,ke,Ce,ne[ie].data);for(let O=0;O<me.length;O++){const pe=me[O].image[ie].image;F?t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,O+1,0,0,pe.width,pe.height,ke,Ce,pe.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,O+1,ge,pe.width,pe.height,0,ke,Ce,pe.data)}}else{F?t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,0,0,ke,Ce,ne[ie]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,ge,ke,Ce,ne[ie]);for(let O=0;O<me.length;O++){const he=me[O];F?t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,O+1,0,0,ke,Ce,he.image[ie]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,O+1,ge,ke,Ce,he.image[ie])}}}_(w,je)&&x(s.TEXTURE_CUBE_MAP),oe.__version=se.version,w.onUpdate&&w.onUpdate(w)}R.__version=w.version}function fe(R,w,G,re,se,oe){const we=r.convert(G.format,G.colorSpace),de=r.convert(G.type),xe=M(G.internalFormat,we,de,G.colorSpace);if(!n.get(w).__hasExternalTextures){const He=Math.max(1,w.width>>oe),ne=Math.max(1,w.height>>oe);se===s.TEXTURE_3D||se===s.TEXTURE_2D_ARRAY?t.texImage3D(se,oe,xe,He,ne,w.depth,0,we,de,null):t.texImage2D(se,oe,xe,He,ne,0,we,de,null)}t.bindFramebuffer(s.FRAMEBUFFER,R),Me(w)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,re,se,n.get(G).__webglTexture,0,De(w)):(se===s.TEXTURE_2D||se>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&se<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,re,se,n.get(G).__webglTexture,oe),t.bindFramebuffer(s.FRAMEBUFFER,null)}function Se(R,w,G){if(s.bindRenderbuffer(s.RENDERBUFFER,R),w.depthBuffer&&!w.stencilBuffer){let re=a===!0?s.DEPTH_COMPONENT24:s.DEPTH_COMPONENT16;if(G||Me(w)){const se=w.depthTexture;se&&se.isDepthTexture&&(se.type===Dn?re=s.DEPTH_COMPONENT32F:se.type===si&&(re=s.DEPTH_COMPONENT24));const oe=De(w);Me(w)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,oe,re,w.width,w.height):s.renderbufferStorageMultisample(s.RENDERBUFFER,oe,re,w.width,w.height)}else s.renderbufferStorage(s.RENDERBUFFER,re,w.width,w.height);s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.RENDERBUFFER,R)}else if(w.depthBuffer&&w.stencilBuffer){const re=De(w);G&&Me(w)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,re,s.DEPTH24_STENCIL8,w.width,w.height):Me(w)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,re,s.DEPTH24_STENCIL8,w.width,w.height):s.renderbufferStorage(s.RENDERBUFFER,s.DEPTH_STENCIL,w.width,w.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.RENDERBUFFER,R)}else{const re=w.isWebGLMultipleRenderTargets===!0?w.texture:[w.texture];for(let se=0;se<re.length;se++){const oe=re[se],we=r.convert(oe.format,oe.colorSpace),de=r.convert(oe.type),xe=M(oe.internalFormat,we,de,oe.colorSpace),Re=De(w);G&&Me(w)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,Re,xe,w.width,w.height):Me(w)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Re,xe,w.width,w.height):s.renderbufferStorage(s.RENDERBUFFER,xe,w.width,w.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Pe(R,w){if(w&&w.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(s.FRAMEBUFFER,R),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(w.depthTexture).__webglTexture||w.depthTexture.image.width!==w.width||w.depthTexture.image.height!==w.height)&&(w.depthTexture.image.width=w.width,w.depthTexture.image.height=w.height,w.depthTexture.needsUpdate=!0),H(w.depthTexture,0);const re=n.get(w.depthTexture).__webglTexture,se=De(w);if(w.depthTexture.format===Pi)Me(w)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,re,0,se):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,re,0);else if(w.depthTexture.format===Ui)Me(w)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,re,0,se):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,re,0);else throw new Error("Unknown depthTexture format")}function Ee(R){const w=n.get(R),G=R.isWebGLCubeRenderTarget===!0;if(R.depthTexture&&!w.__autoAllocateDepthBuffer){if(G)throw new Error("target.depthTexture not supported in Cube render targets");Pe(w.__webglFramebuffer,R)}else if(G){w.__webglDepthbuffer=[];for(let re=0;re<6;re++)t.bindFramebuffer(s.FRAMEBUFFER,w.__webglFramebuffer[re]),w.__webglDepthbuffer[re]=s.createRenderbuffer(),Se(w.__webglDepthbuffer[re],R,!1)}else t.bindFramebuffer(s.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer=s.createRenderbuffer(),Se(w.__webglDepthbuffer,R,!1);t.bindFramebuffer(s.FRAMEBUFFER,null)}function We(R,w,G){const re=n.get(R);w!==void 0&&fe(re.__webglFramebuffer,R,R.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),G!==void 0&&Ee(R)}function W(R){const w=R.texture,G=n.get(R),re=n.get(w);R.addEventListener("dispose",L),R.isWebGLMultipleRenderTargets!==!0&&(re.__webglTexture===void 0&&(re.__webglTexture=s.createTexture()),re.__version=w.version,o.memory.textures++);const se=R.isWebGLCubeRenderTarget===!0,oe=R.isWebGLMultipleRenderTargets===!0,we=m(R)||a;if(se){G.__webglFramebuffer=[];for(let de=0;de<6;de++)if(a&&w.mipmaps&&w.mipmaps.length>0){G.__webglFramebuffer[de]=[];for(let xe=0;xe<w.mipmaps.length;xe++)G.__webglFramebuffer[de][xe]=s.createFramebuffer()}else G.__webglFramebuffer[de]=s.createFramebuffer()}else{if(a&&w.mipmaps&&w.mipmaps.length>0){G.__webglFramebuffer=[];for(let de=0;de<w.mipmaps.length;de++)G.__webglFramebuffer[de]=s.createFramebuffer()}else G.__webglFramebuffer=s.createFramebuffer();if(oe)if(i.drawBuffers){const de=R.texture;for(let xe=0,Re=de.length;xe<Re;xe++){const He=n.get(de[xe]);He.__webglTexture===void 0&&(He.__webglTexture=s.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&R.samples>0&&Me(R)===!1){const de=oe?w:[w];G.__webglMultisampledFramebuffer=s.createFramebuffer(),G.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let xe=0;xe<de.length;xe++){const Re=de[xe];G.__webglColorRenderbuffer[xe]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,G.__webglColorRenderbuffer[xe]);const He=r.convert(Re.format,Re.colorSpace),ne=r.convert(Re.type),et=M(Re.internalFormat,He,ne,Re.colorSpace,R.isXRRenderTarget===!0),je=De(R);s.renderbufferStorageMultisample(s.RENDERBUFFER,je,et,R.width,R.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+xe,s.RENDERBUFFER,G.__webglColorRenderbuffer[xe])}s.bindRenderbuffer(s.RENDERBUFFER,null),R.depthBuffer&&(G.__webglDepthRenderbuffer=s.createRenderbuffer(),Se(G.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(se){t.bindTexture(s.TEXTURE_CUBE_MAP,re.__webglTexture),V(s.TEXTURE_CUBE_MAP,w,we);for(let de=0;de<6;de++)if(a&&w.mipmaps&&w.mipmaps.length>0)for(let xe=0;xe<w.mipmaps.length;xe++)fe(G.__webglFramebuffer[de][xe],R,w,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+de,xe);else fe(G.__webglFramebuffer[de],R,w,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+de,0);_(w,we)&&x(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(oe){const de=R.texture;for(let xe=0,Re=de.length;xe<Re;xe++){const He=de[xe],ne=n.get(He);t.bindTexture(s.TEXTURE_2D,ne.__webglTexture),V(s.TEXTURE_2D,He,we),fe(G.__webglFramebuffer,R,He,s.COLOR_ATTACHMENT0+xe,s.TEXTURE_2D,0),_(He,we)&&x(s.TEXTURE_2D)}t.unbindTexture()}else{let de=s.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(a?de=R.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),t.bindTexture(de,re.__webglTexture),V(de,w,we),a&&w.mipmaps&&w.mipmaps.length>0)for(let xe=0;xe<w.mipmaps.length;xe++)fe(G.__webglFramebuffer[xe],R,w,s.COLOR_ATTACHMENT0,de,xe);else fe(G.__webglFramebuffer,R,w,s.COLOR_ATTACHMENT0,de,0);_(w,we)&&x(de),t.unbindTexture()}R.depthBuffer&&Ee(R)}function _t(R){const w=m(R)||a,G=R.isWebGLMultipleRenderTargets===!0?R.texture:[R.texture];for(let re=0,se=G.length;re<se;re++){const oe=G[re];if(_(oe,w)){const we=R.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:s.TEXTURE_2D,de=n.get(oe).__webglTexture;t.bindTexture(we,de),x(we),t.unbindTexture()}}}function Ae(R){if(a&&R.samples>0&&Me(R)===!1){const w=R.isWebGLMultipleRenderTargets?R.texture:[R.texture],G=R.width,re=R.height;let se=s.COLOR_BUFFER_BIT;const oe=[],we=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,de=n.get(R),xe=R.isWebGLMultipleRenderTargets===!0;if(xe)for(let Re=0;Re<w.length;Re++)t.bindFramebuffer(s.FRAMEBUFFER,de.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Re,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,de.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Re,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,de.__webglMultisampledFramebuffer),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,de.__webglFramebuffer);for(let Re=0;Re<w.length;Re++){oe.push(s.COLOR_ATTACHMENT0+Re),R.depthBuffer&&oe.push(we);const He=de.__ignoreDepthValues!==void 0?de.__ignoreDepthValues:!1;if(He===!1&&(R.depthBuffer&&(se|=s.DEPTH_BUFFER_BIT),R.stencilBuffer&&(se|=s.STENCIL_BUFFER_BIT)),xe&&s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,de.__webglColorRenderbuffer[Re]),He===!0&&(s.invalidateFramebuffer(s.READ_FRAMEBUFFER,[we]),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[we])),xe){const ne=n.get(w[Re]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,ne,0)}s.blitFramebuffer(0,0,G,re,0,0,G,re,se,s.NEAREST),c&&s.invalidateFramebuffer(s.READ_FRAMEBUFFER,oe)}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),xe)for(let Re=0;Re<w.length;Re++){t.bindFramebuffer(s.FRAMEBUFFER,de.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Re,s.RENDERBUFFER,de.__webglColorRenderbuffer[Re]);const He=n.get(w[Re]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,de.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Re,s.TEXTURE_2D,He,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,de.__webglMultisampledFramebuffer)}}function De(R){return Math.min(i.maxSamples,R.samples)}function Me(R){const w=n.get(R);return a&&R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function st(R){const w=o.render.frame;h.get(R)!==w&&(h.set(R,w),R.update())}function Oe(R,w){const G=R.colorSpace,re=R.format,se=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||R.format===ba||G!==jn&&G!==mn&&(lt.getTransfer(G)===dt?a===!1?e.has("EXT_sRGB")===!0&&re===pn?(R.format=ba,R.minFilter=dn,R.generateMipmaps=!1):w=Fu.sRGBToLinear(w):(re!==pn||se!==hi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",G)),w}this.allocateTextureUnit=D,this.resetTextureUnits=z,this.setTexture2D=H,this.setTexture2DArray=Z,this.setTexture3D=B,this.setTextureCube=X,this.rebindTextures=We,this.setupRenderTarget=W,this.updateRenderTargetMipmap=_t,this.updateMultisampleRenderTarget=Ae,this.setupDepthRenderbuffer=Ee,this.setupFrameBufferTexture=fe,this.useMultisampledRTT=Me}function Vv(s,e,t){const n=t.isWebGL2;function i(r,o=mn){let a;const l=lt.getTransfer(o);if(r===hi)return s.UNSIGNED_BYTE;if(r===bu)return s.UNSIGNED_SHORT_4_4_4_4;if(r===Tu)return s.UNSIGNED_SHORT_5_5_5_1;if(r===ff)return s.BYTE;if(r===pf)return s.SHORT;if(r===ka)return s.UNSIGNED_SHORT;if(r===Eu)return s.INT;if(r===si)return s.UNSIGNED_INT;if(r===Dn)return s.FLOAT;if(r===wn)return n?s.HALF_FLOAT:(a=e.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(r===mf)return s.ALPHA;if(r===pn)return s.RGBA;if(r===wu)return s.LUMINANCE;if(r===gf)return s.LUMINANCE_ALPHA;if(r===Pi)return s.DEPTH_COMPONENT;if(r===Ui)return s.DEPTH_STENCIL;if(r===ba)return a=e.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(r===Au)return s.RED;if(r===Pu)return s.RED_INTEGER;if(r===vf)return s.RG;if(r===Ru)return s.RG_INTEGER;if(r===Cu)return s.RGBA_INTEGER;if(r===Eo||r===bo||r===To||r===wo)if(l===dt)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(r===Eo)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===bo)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===To)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===wo)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(r===Eo)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===bo)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===To)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===wo)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Tl||r===wl||r===Al||r===Pl)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(r===Tl)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===wl)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===Al)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===Pl)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===Lu)return a=e.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===Rl||r===Cl)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(r===Rl)return l===dt?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(r===Cl)return l===dt?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===Ll||r===Il||r===Dl||r===Ul||r===Fl||r===Nl||r===Ol||r===Bl||r===zl||r===Hl||r===kl||r===Vl||r===Gl||r===Wl)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(r===Ll)return l===dt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===Il)return l===dt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Dl)return l===dt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===Ul)return l===dt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===Fl)return l===dt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===Nl)return l===dt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===Ol)return l===dt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Bl)return l===dt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===zl)return l===dt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Hl)return l===dt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===kl)return l===dt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Vl)return l===dt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===Gl)return l===dt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Wl)return l===dt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===Ao||r===Xl||r===Yl)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(r===Ao)return l===dt?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===Xl)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===Yl)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===_f||r===jl||r===ql||r===Zl)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(r===Ao)return a.COMPRESSED_RED_RGTC1_EXT;if(r===jl)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===ql)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===Zl)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===ui?n?s.UNSIGNED_INT_24_8:(a=e.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):s[r]!==void 0?s[r]:null}return{convert:i}}class Gv extends $t{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Sn extends ut{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Wv={type:"move"};class $o{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Sn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Sn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Sn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const v of e.hand.values()){const m=t.getJointPose(v,n),p=this._getHandJoint(c,v);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;c.inputState.pinching&&d>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Wv)))}return a!==null&&(a.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Sn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class Xv extends Bi{constructor(e,t){super();const n=this;let i=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,g=null;const v=t.getContextAttributes();let m=null,p=null;const _=[],x=[],M=new _e;let y=null;const b=new $t;b.layers.enable(1),b.viewport=new at;const T=new $t;T.layers.enable(2),T.viewport=new at;const L=[b,T],S=new Gv;S.layers.enable(1),S.layers.enable(2);let E=null,C=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(V){let J=_[V];return J===void 0&&(J=new $o,_[V]=J),J.getTargetRaySpace()},this.getControllerGrip=function(V){let J=_[V];return J===void 0&&(J=new $o,_[V]=J),J.getGripSpace()},this.getHand=function(V){let J=_[V];return J===void 0&&(J=new $o,_[V]=J),J.getHandSpace()};function U(V){const J=x.indexOf(V.inputSource);if(J===-1)return;const ce=_[J];ce!==void 0&&(ce.update(V.inputSource,V.frame,c||o),ce.dispatchEvent({type:V.type,data:V.inputSource}))}function z(){i.removeEventListener("select",U),i.removeEventListener("selectstart",U),i.removeEventListener("selectend",U),i.removeEventListener("squeeze",U),i.removeEventListener("squeezestart",U),i.removeEventListener("squeezeend",U),i.removeEventListener("end",z),i.removeEventListener("inputsourceschange",D);for(let V=0;V<_.length;V++){const J=x[V];J!==null&&(x[V]=null,_[V].disconnect(J))}E=null,C=null,e.setRenderTarget(m),f=null,d=null,u=null,i=null,p=null,Q.stop(),n.isPresenting=!1,e.setPixelRatio(y),e.setSize(M.width,M.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(V){r=V,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(V){a=V,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(V){c=V},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(V){if(i=V,i!==null){if(m=e.getRenderTarget(),i.addEventListener("select",U),i.addEventListener("selectstart",U),i.addEventListener("selectend",U),i.addEventListener("squeeze",U),i.addEventListener("squeezestart",U),i.addEventListener("squeezeend",U),i.addEventListener("end",z),i.addEventListener("inputsourceschange",D),v.xrCompatible!==!0&&await t.makeXRCompatible(),y=e.getPixelRatio(),e.getSize(M),i.renderState.layers===void 0||e.capabilities.isWebGL2===!1){const J={antialias:i.renderState.layers===void 0?v.antialias:!0,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,t,J),i.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),p=new ln(f.framebufferWidth,f.framebufferHeight,{format:pn,type:hi,colorSpace:e.outputColorSpace,stencilBuffer:v.stencil})}else{let J=null,ce=null,ve=null;v.depth&&(ve=v.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,J=v.stencil?Ui:Pi,ce=v.stencil?ui:si);const fe={colorFormat:t.RGBA8,depthFormat:ve,scaleFactor:r};u=new XRWebGLBinding(i,t),d=u.createProjectionLayer(fe),i.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),p=new ln(d.textureWidth,d.textureHeight,{format:pn,type:hi,depthTexture:new qa(d.textureWidth,d.textureHeight,ce,void 0,void 0,void 0,void 0,void 0,void 0,J),stencilBuffer:v.stencil,colorSpace:e.outputColorSpace,samples:v.antialias?4:0});const Se=e.properties.get(p);Se.__ignoreDepthValues=d.ignoreDepthValues}p.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await i.requestReferenceSpace(a),Q.setContext(i),Q.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode};function D(V){for(let J=0;J<V.removed.length;J++){const ce=V.removed[J],ve=x.indexOf(ce);ve>=0&&(x[ve]=null,_[ve].disconnect(ce))}for(let J=0;J<V.added.length;J++){const ce=V.added[J];let ve=x.indexOf(ce);if(ve===-1){for(let Se=0;Se<_.length;Se++)if(Se>=x.length){x.push(ce),ve=Se;break}else if(x[Se]===null){x[Se]=ce,ve=Se;break}if(ve===-1)break}const fe=_[ve];fe&&fe.connect(ce)}}const N=new I,H=new I;function Z(V,J,ce){N.setFromMatrixPosition(J.matrixWorld),H.setFromMatrixPosition(ce.matrixWorld);const ve=N.distanceTo(H),fe=J.projectionMatrix.elements,Se=ce.projectionMatrix.elements,Pe=fe[14]/(fe[10]-1),Ee=fe[14]/(fe[10]+1),We=(fe[9]+1)/fe[5],W=(fe[9]-1)/fe[5],_t=(fe[8]-1)/fe[0],Ae=(Se[8]+1)/Se[0],De=Pe*_t,Me=Pe*Ae,st=ve/(-_t+Ae),Oe=st*-_t;J.matrixWorld.decompose(V.position,V.quaternion,V.scale),V.translateX(Oe),V.translateZ(st),V.matrixWorld.compose(V.position,V.quaternion,V.scale),V.matrixWorldInverse.copy(V.matrixWorld).invert();const R=Pe+st,w=Ee+st,G=De-Oe,re=Me+(ve-Oe),se=We*Ee/w*R,oe=W*Ee/w*R;V.projectionMatrix.makePerspective(G,re,se,oe,R,w),V.projectionMatrixInverse.copy(V.projectionMatrix).invert()}function B(V,J){J===null?V.matrixWorld.copy(V.matrix):V.matrixWorld.multiplyMatrices(J.matrixWorld,V.matrix),V.matrixWorldInverse.copy(V.matrixWorld).invert()}this.updateCamera=function(V){if(i===null)return;S.near=T.near=b.near=V.near,S.far=T.far=b.far=V.far,(E!==S.near||C!==S.far)&&(i.updateRenderState({depthNear:S.near,depthFar:S.far}),E=S.near,C=S.far);const J=V.parent,ce=S.cameras;B(S,J);for(let ve=0;ve<ce.length;ve++)B(ce[ve],J);ce.length===2?Z(S,b,T):S.projectionMatrix.copy(b.projectionMatrix),X(V,S,J)};function X(V,J,ce){ce===null?V.matrix.copy(J.matrixWorld):(V.matrix.copy(ce.matrixWorld),V.matrix.invert(),V.matrix.multiply(J.matrixWorld)),V.matrix.decompose(V.position,V.quaternion,V.scale),V.updateMatrixWorld(!0),V.projectionMatrix.copy(J.projectionMatrix),V.projectionMatrixInverse.copy(J.projectionMatrixInverse),V.isPerspectiveCamera&&(V.fov=ys*2*Math.atan(1/V.projectionMatrix.elements[5]),V.zoom=1)}this.getCamera=function(){return S},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(V){l=V,d!==null&&(d.fixedFoveation=V),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=V)};let $=null;function te(V,J){if(h=J.getViewerPose(c||o),g=J,h!==null){const ce=h.views;f!==null&&(e.setRenderTargetFramebuffer(p,f.framebuffer),e.setRenderTarget(p));let ve=!1;ce.length!==S.cameras.length&&(S.cameras.length=0,ve=!0);for(let fe=0;fe<ce.length;fe++){const Se=ce[fe];let Pe=null;if(f!==null)Pe=f.getViewport(Se);else{const We=u.getViewSubImage(d,Se);Pe=We.viewport,fe===0&&(e.setRenderTargetTextures(p,We.colorTexture,d.ignoreDepthValues?void 0:We.depthStencilTexture),e.setRenderTarget(p))}let Ee=L[fe];Ee===void 0&&(Ee=new $t,Ee.layers.enable(fe),Ee.viewport=new at,L[fe]=Ee),Ee.matrix.fromArray(Se.transform.matrix),Ee.matrix.decompose(Ee.position,Ee.quaternion,Ee.scale),Ee.projectionMatrix.fromArray(Se.projectionMatrix),Ee.projectionMatrixInverse.copy(Ee.projectionMatrix).invert(),Ee.viewport.set(Pe.x,Pe.y,Pe.width,Pe.height),fe===0&&(S.matrix.copy(Ee.matrix),S.matrix.decompose(S.position,S.quaternion,S.scale)),ve===!0&&S.cameras.push(Ee)}}for(let ce=0;ce<_.length;ce++){const ve=x[ce],fe=_[ce];ve!==null&&fe!==void 0&&fe.update(ve,J,c||o)}$&&$(V,J),J.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:J}),g=null}const Q=new Gu;Q.setAnimationLoop(te),this.setAnimationLoop=function(V){$=V},this.dispose=function(){}}}function Yv(s,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Hu(s)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function i(m,p,_,x,M){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p)):p.isMeshStandardMaterial?(r(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,M)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),v(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?l(m,p,_,x):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Jt&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Jt&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const _=e.get(p).envMap;if(_&&(m.envMap.value=_,m.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap){m.lightMap.value=p.lightMap;const x=s._useLegacyLights===!0?Math.PI:1;m.lightMapIntensity.value=p.lightMapIntensity*x,t(p.lightMap,m.lightMapTransform)}p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,_,x){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*_,m.scale.value=x*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),e.get(p).envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,_){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Jt&&m.clearcoatNormalScale.value.negate())),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=_.texture,m.transmissionSamplerSize.value.set(_.width,_.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function v(m,p){const _=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(_.matrixWorld),m.nearDistance.value=_.shadow.camera.near,m.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function jv(s,e,t,n){let i={},r={},o=[];const a=t.isWebGL2?s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(_,x){const M=x.program;n.uniformBlockBinding(_,M)}function c(_,x){let M=i[_.id];M===void 0&&(g(_),M=h(_),i[_.id]=M,_.addEventListener("dispose",m));const y=x.program;n.updateUBOMapping(_,y);const b=e.render.frame;r[_.id]!==b&&(d(_),r[_.id]=b)}function h(_){const x=u();_.__bindingPointIndex=x;const M=s.createBuffer(),y=_.__size,b=_.usage;return s.bindBuffer(s.UNIFORM_BUFFER,M),s.bufferData(s.UNIFORM_BUFFER,y,b),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,x,M),M}function u(){for(let _=0;_<a;_++)if(o.indexOf(_)===-1)return o.push(_),_;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(_){const x=i[_.id],M=_.uniforms,y=_.__cache;s.bindBuffer(s.UNIFORM_BUFFER,x);for(let b=0,T=M.length;b<T;b++){const L=Array.isArray(M[b])?M[b]:[M[b]];for(let S=0,E=L.length;S<E;S++){const C=L[S];if(f(C,b,S,y)===!0){const U=C.__offset,z=Array.isArray(C.value)?C.value:[C.value];let D=0;for(let N=0;N<z.length;N++){const H=z[N],Z=v(H);typeof H=="number"||typeof H=="boolean"?(C.__data[0]=H,s.bufferSubData(s.UNIFORM_BUFFER,U+D,C.__data)):H.isMatrix3?(C.__data[0]=H.elements[0],C.__data[1]=H.elements[1],C.__data[2]=H.elements[2],C.__data[3]=0,C.__data[4]=H.elements[3],C.__data[5]=H.elements[4],C.__data[6]=H.elements[5],C.__data[7]=0,C.__data[8]=H.elements[6],C.__data[9]=H.elements[7],C.__data[10]=H.elements[8],C.__data[11]=0):(H.toArray(C.__data,D),D+=Z.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,U,C.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(_,x,M,y){const b=_.value,T=x+"_"+M;if(y[T]===void 0)return typeof b=="number"||typeof b=="boolean"?y[T]=b:y[T]=b.clone(),!0;{const L=y[T];if(typeof b=="number"||typeof b=="boolean"){if(L!==b)return y[T]=b,!0}else if(L.equals(b)===!1)return L.copy(b),!0}return!1}function g(_){const x=_.uniforms;let M=0;const y=16;for(let T=0,L=x.length;T<L;T++){const S=Array.isArray(x[T])?x[T]:[x[T]];for(let E=0,C=S.length;E<C;E++){const U=S[E],z=Array.isArray(U.value)?U.value:[U.value];for(let D=0,N=z.length;D<N;D++){const H=z[D],Z=v(H),B=M%y;B!==0&&y-B<Z.boundary&&(M+=y-B),U.__data=new Float32Array(Z.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=M,M+=Z.storage}}}const b=M%y;return b>0&&(M+=y-b),_.__size=M,_.__cache={},this}function v(_){const x={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(x.boundary=4,x.storage=4):_.isVector2?(x.boundary=8,x.storage=8):_.isVector3||_.isColor?(x.boundary=16,x.storage=12):_.isVector4?(x.boundary=16,x.storage=16):_.isMatrix3?(x.boundary=48,x.storage=48):_.isMatrix4?(x.boundary=64,x.storage=64):_.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",_),x}function m(_){const x=_.target;x.removeEventListener("dispose",m);const M=o.indexOf(x.__bindingPointIndex);o.splice(M,1),s.deleteBuffer(i[x.id]),delete i[x.id],delete r[x.id]}function p(){for(const _ in i)s.deleteBuffer(i[_]);o=[],i={},r={}}return{bind:l,update:c,dispose:p}}class Zu{constructor(e={}){const{canvas:t=Wf(),context:n=null,depth:i=!0,stencil:r=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=e;this.isWebGLRenderer=!0;let d;n!==null?d=n.getContextAttributes().alpha:d=o;const f=new Uint32Array(4),g=new Int32Array(4);let v=null,m=null;const p=[],_=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Pt,this._useLegacyLights=!1,this.toneMapping=ci,this.toneMappingExposure=1;const x=this;let M=!1,y=0,b=0,T=null,L=-1,S=null;const E=new at,C=new at;let U=null;const z=new Ne(0);let D=0,N=t.width,H=t.height,Z=1,B=null,X=null;const $=new at(0,0,N,H),te=new at(0,0,N,H);let Q=!1;const V=new Ya;let J=!1,ce=!1,ve=null;const fe=new Le,Se=new _e,Pe=new I,Ee={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function We(){return T===null?Z:1}let W=n;function _t(A,k){for(let q=0;q<A.length;q++){const K=A[q],Y=t.getContext(K,k);if(Y!==null)return Y}return null}try{const A={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${za}`),t.addEventListener("webglcontextlost",ie,!1),t.addEventListener("webglcontextrestored",O,!1),t.addEventListener("webglcontextcreationerror",he,!1),W===null){const k=["webgl2","webgl","experimental-webgl"];if(x.isWebGL1Renderer===!0&&k.shift(),W=_t(k,A),W===null)throw _t(k)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&W instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),W.getShaderPrecisionFormat===void 0&&(W.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let Ae,De,Me,st,Oe,R,w,G,re,se,oe,we,de,xe,Re,He,ne,et,je,ke,Ce,ge,F,ae;function be(){Ae=new i0(W),De=new $g(W,Ae,e),Ae.init(De),ge=new Vv(W,Ae,De),Me=new Hv(W,Ae,De),st=new o0(W),Oe=new wv,R=new kv(W,Ae,Me,Oe,De,ge,st),w=new Jg(x),G=new n0(x),re=new pp(W,De),F=new Zg(W,Ae,re,De),se=new s0(W,re,st,F),oe=new h0(W,se,re,st),je=new c0(W,De,R),He=new Qg(Oe),we=new Tv(x,w,G,Ae,De,F,He),de=new Yv(x,Oe),xe=new Pv,Re=new Uv(Ae,De),et=new qg(x,w,G,Me,oe,d,l),ne=new zv(x,oe,De),ae=new jv(W,st,De,Me),ke=new Kg(W,Ae,st,De),Ce=new r0(W,Ae,st,De),st.programs=we.programs,x.capabilities=De,x.extensions=Ae,x.properties=Oe,x.renderLists=xe,x.shadowMap=ne,x.state=Me,x.info=st}be();const me=new Xv(x,W);this.xr=me,this.getContext=function(){return W},this.getContextAttributes=function(){return W.getContextAttributes()},this.forceContextLoss=function(){const A=Ae.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=Ae.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return Z},this.setPixelRatio=function(A){A!==void 0&&(Z=A,this.setSize(N,H,!1))},this.getSize=function(A){return A.set(N,H)},this.setSize=function(A,k,q=!0){if(me.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}N=A,H=k,t.width=Math.floor(A*Z),t.height=Math.floor(k*Z),q===!0&&(t.style.width=A+"px",t.style.height=k+"px"),this.setViewport(0,0,A,k)},this.getDrawingBufferSize=function(A){return A.set(N*Z,H*Z).floor()},this.setDrawingBufferSize=function(A,k,q){N=A,H=k,Z=q,t.width=Math.floor(A*q),t.height=Math.floor(k*q),this.setViewport(0,0,A,k)},this.getCurrentViewport=function(A){return A.copy(E)},this.getViewport=function(A){return A.copy($)},this.setViewport=function(A,k,q,K){A.isVector4?$.set(A.x,A.y,A.z,A.w):$.set(A,k,q,K),Me.viewport(E.copy($).multiplyScalar(Z).floor())},this.getScissor=function(A){return A.copy(te)},this.setScissor=function(A,k,q,K){A.isVector4?te.set(A.x,A.y,A.z,A.w):te.set(A,k,q,K),Me.scissor(C.copy(te).multiplyScalar(Z).floor())},this.getScissorTest=function(){return Q},this.setScissorTest=function(A){Me.setScissorTest(Q=A)},this.setOpaqueSort=function(A){B=A},this.setTransparentSort=function(A){X=A},this.getClearColor=function(A){return A.copy(et.getClearColor())},this.setClearColor=function(){et.setClearColor.apply(et,arguments)},this.getClearAlpha=function(){return et.getClearAlpha()},this.setClearAlpha=function(){et.setClearAlpha.apply(et,arguments)},this.clear=function(A=!0,k=!0,q=!0){let K=0;if(A){let Y=!1;if(T!==null){const ye=T.texture.format;Y=ye===Cu||ye===Ru||ye===Pu}if(Y){const ye=T.texture.type,Ie=ye===hi||ye===si||ye===ka||ye===ui||ye===bu||ye===Tu,ze=et.getClearColor(),Ve=et.getClearAlpha(),Ke=ze.r,Xe=ze.g,qe=ze.b;Ie?(f[0]=Ke,f[1]=Xe,f[2]=qe,f[3]=Ve,W.clearBufferuiv(W.COLOR,0,f)):(g[0]=Ke,g[1]=Xe,g[2]=qe,g[3]=Ve,W.clearBufferiv(W.COLOR,0,g))}else K|=W.COLOR_BUFFER_BIT}k&&(K|=W.DEPTH_BUFFER_BIT),q&&(K|=W.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),W.clear(K)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ie,!1),t.removeEventListener("webglcontextrestored",O,!1),t.removeEventListener("webglcontextcreationerror",he,!1),xe.dispose(),Re.dispose(),Oe.dispose(),w.dispose(),G.dispose(),oe.dispose(),F.dispose(),ae.dispose(),we.dispose(),me.dispose(),me.removeEventListener("sessionstart",Tt),me.removeEventListener("sessionend",rt),ve&&(ve.dispose(),ve=null),Rt.stop()};function ie(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),M=!0}function O(){console.log("THREE.WebGLRenderer: Context Restored."),M=!1;const A=st.autoReset,k=ne.enabled,q=ne.autoUpdate,K=ne.needsUpdate,Y=ne.type;be(),st.autoReset=A,ne.enabled=k,ne.autoUpdate=q,ne.needsUpdate=K,ne.type=Y}function he(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function pe(A){const k=A.target;k.removeEventListener("dispose",pe),Be(k)}function Be(A){Fe(A),Oe.remove(A)}function Fe(A){const k=Oe.get(A).programs;k!==void 0&&(k.forEach(function(q){we.releaseProgram(q)}),A.isShaderMaterial&&we.releaseShaderCache(A))}this.renderBufferDirect=function(A,k,q,K,Y,ye){k===null&&(k=Ee);const Ie=Y.isMesh&&Y.matrixWorld.determinant()<0,ze=Cd(A,k,q,K,Y);Me.setMaterial(K,Ie);let Ve=q.index,Ke=1;if(K.wireframe===!0){if(Ve=se.getWireframeAttribute(q),Ve===void 0)return;Ke=2}const Xe=q.drawRange,qe=q.attributes.position;let wt=Xe.start*Ke,en=(Xe.start+Xe.count)*Ke;ye!==null&&(wt=Math.max(wt,ye.start*Ke),en=Math.min(en,(ye.start+ye.count)*Ke)),Ve!==null?(wt=Math.max(wt,0),en=Math.min(en,Ve.count)):qe!=null&&(wt=Math.max(wt,0),en=Math.min(en,qe.count));const Ft=en-wt;if(Ft<0||Ft===1/0)return;F.setup(Y,K,ze,q,Ve);let On,xt=ke;if(Ve!==null&&(On=re.get(Ve),xt=Ce,xt.setIndex(On)),Y.isMesh)K.wireframe===!0?(Me.setLineWidth(K.wireframeLinewidth*We()),xt.setMode(W.LINES)):xt.setMode(W.TRIANGLES);else if(Y.isLine){let Je=K.linewidth;Je===void 0&&(Je=1),Me.setLineWidth(Je*We()),Y.isLineSegments?xt.setMode(W.LINES):Y.isLineLoop?xt.setMode(W.LINE_LOOP):xt.setMode(W.LINE_STRIP)}else Y.isPoints?xt.setMode(W.POINTS):Y.isSprite&&xt.setMode(W.TRIANGLES);if(Y.isBatchedMesh)xt.renderMultiDraw(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount);else if(Y.isInstancedMesh)xt.renderInstances(wt,Ft,Y.count);else if(q.isInstancedBufferGeometry){const Je=q._maxInstanceCount!==void 0?q._maxInstanceCount:1/0,_o=Math.min(q.instanceCount,Je);xt.renderInstances(wt,Ft,_o)}else xt.render(wt,Ft)};function tt(A,k,q){A.transparent===!0&&A.side===rn&&A.forceSinglePass===!1?(A.side=Jt,A.needsUpdate=!0,or(A,k,q),A.side=di,A.needsUpdate=!0,or(A,k,q),A.side=rn):or(A,k,q)}this.compile=function(A,k,q=null){q===null&&(q=A),m=Re.get(q),m.init(),_.push(m),q.traverseVisible(function(Y){Y.isLight&&Y.layers.test(k.layers)&&(m.pushLight(Y),Y.castShadow&&m.pushShadow(Y))}),A!==q&&A.traverseVisible(function(Y){Y.isLight&&Y.layers.test(k.layers)&&(m.pushLight(Y),Y.castShadow&&m.pushShadow(Y))}),m.setupLights(x._useLegacyLights);const K=new Set;return A.traverse(function(Y){const ye=Y.material;if(ye)if(Array.isArray(ye))for(let Ie=0;Ie<ye.length;Ie++){const ze=ye[Ie];tt(ze,q,Y),K.add(ze)}else tt(ye,q,Y),K.add(ye)}),_.pop(),m=null,K},this.compileAsync=function(A,k,q=null){const K=this.compile(A,k,q);return new Promise(Y=>{function ye(){if(K.forEach(function(Ie){Oe.get(Ie).currentProgram.isReady()&&K.delete(Ie)}),K.size===0){Y(A);return}setTimeout(ye,10)}Ae.get("KHR_parallel_shader_compile")!==null?ye():setTimeout(ye,10)})};let nt=null;function Et(A){nt&&nt(A)}function Tt(){Rt.stop()}function rt(){Rt.start()}const Rt=new Gu;Rt.setAnimationLoop(Et),typeof self<"u"&&Rt.setContext(self),this.setAnimationLoop=function(A){nt=A,me.setAnimationLoop(A),A===null?Rt.stop():Rt.start()},me.addEventListener("sessionstart",Tt),me.addEventListener("sessionend",rt),this.render=function(A,k){if(k!==void 0&&k.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(M===!0)return;A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),me.enabled===!0&&me.isPresenting===!0&&(me.cameraAutoUpdate===!0&&me.updateCamera(k),k=me.getCamera()),A.isScene===!0&&A.onBeforeRender(x,A,k,T),m=Re.get(A,_.length),m.init(),_.push(m),fe.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),V.setFromProjectionMatrix(fe),ce=this.localClippingEnabled,J=He.init(this.clippingPlanes,ce),v=xe.get(A,p.length),v.init(),p.push(v),Rn(A,k,0,x.sortObjects),v.finish(),x.sortObjects===!0&&v.sort(B,X),this.info.render.frame++,J===!0&&He.beginShadows();const q=m.state.shadowsArray;if(ne.render(q,A,k),J===!0&&He.endShadows(),this.info.autoReset===!0&&this.info.reset(),et.render(v,A),m.setupLights(x._useLegacyLights),k.isArrayCamera){const K=k.cameras;for(let Y=0,ye=K.length;Y<ye;Y++){const Ie=K[Y];hl(v,A,Ie,Ie.viewport)}}else hl(v,A,k);T!==null&&(R.updateMultisampleRenderTarget(T),R.updateRenderTargetMipmap(T)),A.isScene===!0&&A.onAfterRender(x,A,k),F.resetDefaultState(),L=-1,S=null,_.pop(),_.length>0?m=_[_.length-1]:m=null,p.pop(),p.length>0?v=p[p.length-1]:v=null};function Rn(A,k,q,K){if(A.visible===!1)return;if(A.layers.test(k.layers)){if(A.isGroup)q=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(k);else if(A.isLight)m.pushLight(A),A.castShadow&&m.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||V.intersectsSprite(A)){K&&Pe.setFromMatrixPosition(A.matrixWorld).applyMatrix4(fe);const Ie=oe.update(A),ze=A.material;ze.visible&&v.push(A,Ie,ze,q,Pe.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||V.intersectsObject(A))){const Ie=oe.update(A),ze=A.material;if(K&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),Pe.copy(A.boundingSphere.center)):(Ie.boundingSphere===null&&Ie.computeBoundingSphere(),Pe.copy(Ie.boundingSphere.center)),Pe.applyMatrix4(A.matrixWorld).applyMatrix4(fe)),Array.isArray(ze)){const Ve=Ie.groups;for(let Ke=0,Xe=Ve.length;Ke<Xe;Ke++){const qe=Ve[Ke],wt=ze[qe.materialIndex];wt&&wt.visible&&v.push(A,Ie,wt,q,Pe.z,qe)}}else ze.visible&&v.push(A,Ie,ze,q,Pe.z,null)}}const ye=A.children;for(let Ie=0,ze=ye.length;Ie<ze;Ie++)Rn(ye[Ie],k,q,K)}function hl(A,k,q,K){const Y=A.opaque,ye=A.transmissive,Ie=A.transparent;m.setupLightsView(q),J===!0&&He.setGlobalState(x.clippingPlanes,q),ye.length>0&&Rd(Y,ye,k,q),K&&Me.viewport(E.copy(K)),Y.length>0&&rr(Y,k,q),ye.length>0&&rr(ye,k,q),Ie.length>0&&rr(Ie,k,q),Me.buffers.depth.setTest(!0),Me.buffers.depth.setMask(!0),Me.buffers.color.setMask(!0),Me.setPolygonOffset(!1)}function Rd(A,k,q,K){if((q.isScene===!0?q.overrideMaterial:null)!==null)return;const ye=De.isWebGL2;ve===null&&(ve=new ln(1,1,{generateMipmaps:!0,type:Ae.has("EXT_color_buffer_half_float")?wn:hi,minFilter:Xs,samples:ye?4:0})),x.getDrawingBufferSize(Se),ye?ve.setSize(Se.x,Se.y):ve.setSize(so(Se.x),so(Se.y));const Ie=x.getRenderTarget();x.setRenderTarget(ve),x.getClearColor(z),D=x.getClearAlpha(),D<1&&x.setClearColor(16777215,.5),x.clear();const ze=x.toneMapping;x.toneMapping=ci,rr(A,q,K),R.updateMultisampleRenderTarget(ve),R.updateRenderTargetMipmap(ve);let Ve=!1;for(let Ke=0,Xe=k.length;Ke<Xe;Ke++){const qe=k[Ke],wt=qe.object,en=qe.geometry,Ft=qe.material,On=qe.group;if(Ft.side===rn&&wt.layers.test(K.layers)){const xt=Ft.side;Ft.side=Jt,Ft.needsUpdate=!0,ul(wt,q,K,en,Ft,On),Ft.side=xt,Ft.needsUpdate=!0,Ve=!0}}Ve===!0&&(R.updateMultisampleRenderTarget(ve),R.updateRenderTargetMipmap(ve)),x.setRenderTarget(Ie),x.setClearColor(z,D),x.toneMapping=ze}function rr(A,k,q){const K=k.isScene===!0?k.overrideMaterial:null;for(let Y=0,ye=A.length;Y<ye;Y++){const Ie=A[Y],ze=Ie.object,Ve=Ie.geometry,Ke=K===null?Ie.material:K,Xe=Ie.group;ze.layers.test(q.layers)&&ul(ze,k,q,Ve,Ke,Xe)}}function ul(A,k,q,K,Y,ye){A.onBeforeRender(x,k,q,K,Y,ye),A.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),Y.onBeforeRender(x,k,q,K,A,ye),Y.transparent===!0&&Y.side===rn&&Y.forceSinglePass===!1?(Y.side=Jt,Y.needsUpdate=!0,x.renderBufferDirect(q,k,K,Y,A,ye),Y.side=di,Y.needsUpdate=!0,x.renderBufferDirect(q,k,K,Y,A,ye),Y.side=rn):x.renderBufferDirect(q,k,K,Y,A,ye),A.onAfterRender(x,k,q,K,Y,ye)}function or(A,k,q){k.isScene!==!0&&(k=Ee);const K=Oe.get(A),Y=m.state.lights,ye=m.state.shadowsArray,Ie=Y.state.version,ze=we.getParameters(A,Y.state,ye,k,q),Ve=we.getProgramCacheKey(ze);let Ke=K.programs;K.environment=A.isMeshStandardMaterial?k.environment:null,K.fog=k.fog,K.envMap=(A.isMeshStandardMaterial?G:w).get(A.envMap||K.environment),Ke===void 0&&(A.addEventListener("dispose",pe),Ke=new Map,K.programs=Ke);let Xe=Ke.get(Ve);if(Xe!==void 0){if(K.currentProgram===Xe&&K.lightsStateVersion===Ie)return fl(A,ze),Xe}else ze.uniforms=we.getUniforms(A),A.onBuild(q,ze,x),A.onBeforeCompile(ze,x),Xe=we.acquireProgram(ze,Ve),Ke.set(Ve,Xe),K.uniforms=ze.uniforms;const qe=K.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(qe.clippingPlanes=He.uniform),fl(A,ze),K.needsLights=Id(A),K.lightsStateVersion=Ie,K.needsLights&&(qe.ambientLightColor.value=Y.state.ambient,qe.lightProbe.value=Y.state.probe,qe.directionalLights.value=Y.state.directional,qe.directionalLightShadows.value=Y.state.directionalShadow,qe.spotLights.value=Y.state.spot,qe.spotLightShadows.value=Y.state.spotShadow,qe.rectAreaLights.value=Y.state.rectArea,qe.ltc_1.value=Y.state.rectAreaLTC1,qe.ltc_2.value=Y.state.rectAreaLTC2,qe.pointLights.value=Y.state.point,qe.pointLightShadows.value=Y.state.pointShadow,qe.hemisphereLights.value=Y.state.hemi,qe.directionalShadowMap.value=Y.state.directionalShadowMap,qe.directionalShadowMatrix.value=Y.state.directionalShadowMatrix,qe.spotShadowMap.value=Y.state.spotShadowMap,qe.spotLightMatrix.value=Y.state.spotLightMatrix,qe.spotLightMap.value=Y.state.spotLightMap,qe.pointShadowMap.value=Y.state.pointShadowMap,qe.pointShadowMatrix.value=Y.state.pointShadowMatrix),K.currentProgram=Xe,K.uniformsList=null,Xe}function dl(A){if(A.uniformsList===null){const k=A.currentProgram.getUniforms();A.uniformsList=qr.seqWithValue(k.seq,A.uniforms)}return A.uniformsList}function fl(A,k){const q=Oe.get(A);q.outputColorSpace=k.outputColorSpace,q.batching=k.batching,q.instancing=k.instancing,q.instancingColor=k.instancingColor,q.skinning=k.skinning,q.morphTargets=k.morphTargets,q.morphNormals=k.morphNormals,q.morphColors=k.morphColors,q.morphTargetsCount=k.morphTargetsCount,q.numClippingPlanes=k.numClippingPlanes,q.numIntersection=k.numClipIntersection,q.vertexAlphas=k.vertexAlphas,q.vertexTangents=k.vertexTangents,q.toneMapping=k.toneMapping}function Cd(A,k,q,K,Y){k.isScene!==!0&&(k=Ee),R.resetTextureUnits();const ye=k.fog,Ie=K.isMeshStandardMaterial?k.environment:null,ze=T===null?x.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:jn,Ve=(K.isMeshStandardMaterial?G:w).get(K.envMap||Ie),Ke=K.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,Xe=!!q.attributes.tangent&&(!!K.normalMap||K.anisotropy>0),qe=!!q.morphAttributes.position,wt=!!q.morphAttributes.normal,en=!!q.morphAttributes.color;let Ft=ci;K.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(Ft=x.toneMapping);const On=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,xt=On!==void 0?On.length:0,Je=Oe.get(K),_o=m.state.lights;if(J===!0&&(ce===!0||A!==S)){const cn=A===S&&K.id===L;He.setState(K,A,cn)}let bt=!1;K.version===Je.__version?(Je.needsLights&&Je.lightsStateVersion!==_o.state.version||Je.outputColorSpace!==ze||Y.isBatchedMesh&&Je.batching===!1||!Y.isBatchedMesh&&Je.batching===!0||Y.isInstancedMesh&&Je.instancing===!1||!Y.isInstancedMesh&&Je.instancing===!0||Y.isSkinnedMesh&&Je.skinning===!1||!Y.isSkinnedMesh&&Je.skinning===!0||Y.isInstancedMesh&&Je.instancingColor===!0&&Y.instanceColor===null||Y.isInstancedMesh&&Je.instancingColor===!1&&Y.instanceColor!==null||Je.envMap!==Ve||K.fog===!0&&Je.fog!==ye||Je.numClippingPlanes!==void 0&&(Je.numClippingPlanes!==He.numPlanes||Je.numIntersection!==He.numIntersection)||Je.vertexAlphas!==Ke||Je.vertexTangents!==Xe||Je.morphTargets!==qe||Je.morphNormals!==wt||Je.morphColors!==en||Je.toneMapping!==Ft||De.isWebGL2===!0&&Je.morphTargetsCount!==xt)&&(bt=!0):(bt=!0,Je.__version=K.version);let vi=Je.currentProgram;bt===!0&&(vi=or(K,k,Y));let pl=!1,Cs=!1,xo=!1;const Ht=vi.getUniforms(),_i=Je.uniforms;if(Me.useProgram(vi.program)&&(pl=!0,Cs=!0,xo=!0),K.id!==L&&(L=K.id,Cs=!0),pl||S!==A){Ht.setValue(W,"projectionMatrix",A.projectionMatrix),Ht.setValue(W,"viewMatrix",A.matrixWorldInverse);const cn=Ht.map.cameraPosition;cn!==void 0&&cn.setValue(W,Pe.setFromMatrixPosition(A.matrixWorld)),De.logarithmicDepthBuffer&&Ht.setValue(W,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(K.isMeshPhongMaterial||K.isMeshToonMaterial||K.isMeshLambertMaterial||K.isMeshBasicMaterial||K.isMeshStandardMaterial||K.isShaderMaterial)&&Ht.setValue(W,"isOrthographic",A.isOrthographicCamera===!0),S!==A&&(S=A,Cs=!0,xo=!0)}if(Y.isSkinnedMesh){Ht.setOptional(W,Y,"bindMatrix"),Ht.setOptional(W,Y,"bindMatrixInverse");const cn=Y.skeleton;cn&&(De.floatVertexTextures?(cn.boneTexture===null&&cn.computeBoneTexture(),Ht.setValue(W,"boneTexture",cn.boneTexture,R)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}Y.isBatchedMesh&&(Ht.setOptional(W,Y,"batchingTexture"),Ht.setValue(W,"batchingTexture",Y._matricesTexture,R));const Mo=q.morphAttributes;if((Mo.position!==void 0||Mo.normal!==void 0||Mo.color!==void 0&&De.isWebGL2===!0)&&je.update(Y,q,vi),(Cs||Je.receiveShadow!==Y.receiveShadow)&&(Je.receiveShadow=Y.receiveShadow,Ht.setValue(W,"receiveShadow",Y.receiveShadow)),K.isMeshGouraudMaterial&&K.envMap!==null&&(_i.envMap.value=Ve,_i.flipEnvMap.value=Ve.isCubeTexture&&Ve.isRenderTargetTexture===!1?-1:1),Cs&&(Ht.setValue(W,"toneMappingExposure",x.toneMappingExposure),Je.needsLights&&Ld(_i,xo),ye&&K.fog===!0&&de.refreshFogUniforms(_i,ye),de.refreshMaterialUniforms(_i,K,Z,H,ve),qr.upload(W,dl(Je),_i,R)),K.isShaderMaterial&&K.uniformsNeedUpdate===!0&&(qr.upload(W,dl(Je),_i,R),K.uniformsNeedUpdate=!1),K.isSpriteMaterial&&Ht.setValue(W,"center",Y.center),Ht.setValue(W,"modelViewMatrix",Y.modelViewMatrix),Ht.setValue(W,"normalMatrix",Y.normalMatrix),Ht.setValue(W,"modelMatrix",Y.matrixWorld),K.isShaderMaterial||K.isRawShaderMaterial){const cn=K.uniformsGroups;for(let yo=0,Dd=cn.length;yo<Dd;yo++)if(De.isWebGL2){const ml=cn[yo];ae.update(ml,vi),ae.bind(ml,vi)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return vi}function Ld(A,k){A.ambientLightColor.needsUpdate=k,A.lightProbe.needsUpdate=k,A.directionalLights.needsUpdate=k,A.directionalLightShadows.needsUpdate=k,A.pointLights.needsUpdate=k,A.pointLightShadows.needsUpdate=k,A.spotLights.needsUpdate=k,A.spotLightShadows.needsUpdate=k,A.rectAreaLights.needsUpdate=k,A.hemisphereLights.needsUpdate=k}function Id(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return y},this.getActiveMipmapLevel=function(){return b},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(A,k,q){Oe.get(A.texture).__webglTexture=k,Oe.get(A.depthTexture).__webglTexture=q;const K=Oe.get(A);K.__hasExternalTextures=!0,K.__hasExternalTextures&&(K.__autoAllocateDepthBuffer=q===void 0,K.__autoAllocateDepthBuffer||Ae.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),K.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(A,k){const q=Oe.get(A);q.__webglFramebuffer=k,q.__useDefaultFramebuffer=k===void 0},this.setRenderTarget=function(A,k=0,q=0){T=A,y=k,b=q;let K=!0,Y=null,ye=!1,Ie=!1;if(A){const Ve=Oe.get(A);Ve.__useDefaultFramebuffer!==void 0?(Me.bindFramebuffer(W.FRAMEBUFFER,null),K=!1):Ve.__webglFramebuffer===void 0?R.setupRenderTarget(A):Ve.__hasExternalTextures&&R.rebindTextures(A,Oe.get(A.texture).__webglTexture,Oe.get(A.depthTexture).__webglTexture);const Ke=A.texture;(Ke.isData3DTexture||Ke.isDataArrayTexture||Ke.isCompressedArrayTexture)&&(Ie=!0);const Xe=Oe.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(Xe[k])?Y=Xe[k][q]:Y=Xe[k],ye=!0):De.isWebGL2&&A.samples>0&&R.useMultisampledRTT(A)===!1?Y=Oe.get(A).__webglMultisampledFramebuffer:Array.isArray(Xe)?Y=Xe[q]:Y=Xe,E.copy(A.viewport),C.copy(A.scissor),U=A.scissorTest}else E.copy($).multiplyScalar(Z).floor(),C.copy(te).multiplyScalar(Z).floor(),U=Q;if(Me.bindFramebuffer(W.FRAMEBUFFER,Y)&&De.drawBuffers&&K&&Me.drawBuffers(A,Y),Me.viewport(E),Me.scissor(C),Me.setScissorTest(U),ye){const Ve=Oe.get(A.texture);W.framebufferTexture2D(W.FRAMEBUFFER,W.COLOR_ATTACHMENT0,W.TEXTURE_CUBE_MAP_POSITIVE_X+k,Ve.__webglTexture,q)}else if(Ie){const Ve=Oe.get(A.texture),Ke=k||0;W.framebufferTextureLayer(W.FRAMEBUFFER,W.COLOR_ATTACHMENT0,Ve.__webglTexture,q||0,Ke)}L=-1},this.readRenderTargetPixels=function(A,k,q,K,Y,ye,Ie){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ze=Oe.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Ie!==void 0&&(ze=ze[Ie]),ze){Me.bindFramebuffer(W.FRAMEBUFFER,ze);try{const Ve=A.texture,Ke=Ve.format,Xe=Ve.type;if(Ke!==pn&&ge.convert(Ke)!==W.getParameter(W.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const qe=Xe===wn&&(Ae.has("EXT_color_buffer_half_float")||De.isWebGL2&&Ae.has("EXT_color_buffer_float"));if(Xe!==hi&&ge.convert(Xe)!==W.getParameter(W.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Xe===Dn&&(De.isWebGL2||Ae.has("OES_texture_float")||Ae.has("WEBGL_color_buffer_float")))&&!qe){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=A.width-K&&q>=0&&q<=A.height-Y&&W.readPixels(k,q,K,Y,ge.convert(Ke),ge.convert(Xe),ye)}finally{const Ve=T!==null?Oe.get(T).__webglFramebuffer:null;Me.bindFramebuffer(W.FRAMEBUFFER,Ve)}}},this.copyFramebufferToTexture=function(A,k,q=0){const K=Math.pow(2,-q),Y=Math.floor(k.image.width*K),ye=Math.floor(k.image.height*K);R.setTexture2D(k,0),W.copyTexSubImage2D(W.TEXTURE_2D,q,0,0,A.x,A.y,Y,ye),Me.unbindTexture()},this.copyTextureToTexture=function(A,k,q,K=0){const Y=k.image.width,ye=k.image.height,Ie=ge.convert(q.format),ze=ge.convert(q.type);R.setTexture2D(q,0),W.pixelStorei(W.UNPACK_FLIP_Y_WEBGL,q.flipY),W.pixelStorei(W.UNPACK_PREMULTIPLY_ALPHA_WEBGL,q.premultiplyAlpha),W.pixelStorei(W.UNPACK_ALIGNMENT,q.unpackAlignment),k.isDataTexture?W.texSubImage2D(W.TEXTURE_2D,K,A.x,A.y,Y,ye,Ie,ze,k.image.data):k.isCompressedTexture?W.compressedTexSubImage2D(W.TEXTURE_2D,K,A.x,A.y,k.mipmaps[0].width,k.mipmaps[0].height,Ie,k.mipmaps[0].data):W.texSubImage2D(W.TEXTURE_2D,K,A.x,A.y,Ie,ze,k.image),K===0&&q.generateMipmaps&&W.generateMipmap(W.TEXTURE_2D),Me.unbindTexture()},this.copyTextureToTexture3D=function(A,k,q,K,Y=0){if(x.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const ye=A.max.x-A.min.x+1,Ie=A.max.y-A.min.y+1,ze=A.max.z-A.min.z+1,Ve=ge.convert(K.format),Ke=ge.convert(K.type);let Xe;if(K.isData3DTexture)R.setTexture3D(K,0),Xe=W.TEXTURE_3D;else if(K.isDataArrayTexture||K.isCompressedArrayTexture)R.setTexture2DArray(K,0),Xe=W.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}W.pixelStorei(W.UNPACK_FLIP_Y_WEBGL,K.flipY),W.pixelStorei(W.UNPACK_PREMULTIPLY_ALPHA_WEBGL,K.premultiplyAlpha),W.pixelStorei(W.UNPACK_ALIGNMENT,K.unpackAlignment);const qe=W.getParameter(W.UNPACK_ROW_LENGTH),wt=W.getParameter(W.UNPACK_IMAGE_HEIGHT),en=W.getParameter(W.UNPACK_SKIP_PIXELS),Ft=W.getParameter(W.UNPACK_SKIP_ROWS),On=W.getParameter(W.UNPACK_SKIP_IMAGES),xt=q.isCompressedTexture?q.mipmaps[Y]:q.image;W.pixelStorei(W.UNPACK_ROW_LENGTH,xt.width),W.pixelStorei(W.UNPACK_IMAGE_HEIGHT,xt.height),W.pixelStorei(W.UNPACK_SKIP_PIXELS,A.min.x),W.pixelStorei(W.UNPACK_SKIP_ROWS,A.min.y),W.pixelStorei(W.UNPACK_SKIP_IMAGES,A.min.z),q.isDataTexture||q.isData3DTexture?W.texSubImage3D(Xe,Y,k.x,k.y,k.z,ye,Ie,ze,Ve,Ke,xt.data):q.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),W.compressedTexSubImage3D(Xe,Y,k.x,k.y,k.z,ye,Ie,ze,Ve,xt.data)):W.texSubImage3D(Xe,Y,k.x,k.y,k.z,ye,Ie,ze,Ve,Ke,xt),W.pixelStorei(W.UNPACK_ROW_LENGTH,qe),W.pixelStorei(W.UNPACK_IMAGE_HEIGHT,wt),W.pixelStorei(W.UNPACK_SKIP_PIXELS,en),W.pixelStorei(W.UNPACK_SKIP_ROWS,Ft),W.pixelStorei(W.UNPACK_SKIP_IMAGES,On),Y===0&&K.generateMipmaps&&W.generateMipmap(Xe),Me.unbindTexture()},this.initTexture=function(A){A.isCubeTexture?R.setTextureCube(A,0):A.isData3DTexture?R.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?R.setTexture2DArray(A,0):R.setTexture2D(A,0),Me.unbindTexture()},this.resetState=function(){y=0,b=0,T=null,Me.reset(),F.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Yn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===Va?"display-p3":"srgb",t.unpackColorSpace=lt.workingColorSpace===ho?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Pt?Ri:Iu}set outputEncoding(e){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=e===Ri?Pt:jn}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(e){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=e}}class qv extends Zu{}qv.prototype.isWebGL1Renderer=!0;class Zv extends ut{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t}}const Cr=new I,kc=new I;class Kv extends ut{constructor(){super(),this._currentLevel=0,this.type="LOD",Object.defineProperties(this,{levels:{enumerable:!0,value:[]},isLOD:{value:!0}}),this.autoUpdate=!0}copy(e){super.copy(e,!1);const t=e.levels;for(let n=0,i=t.length;n<i;n++){const r=t[n];this.addLevel(r.object.clone(),r.distance,r.hysteresis)}return this.autoUpdate=e.autoUpdate,this}addLevel(e,t=0,n=0){t=Math.abs(t);const i=this.levels;let r;for(r=0;r<i.length&&!(t<i[r].distance);r++);return i.splice(r,0,{distance:t,hysteresis:n,object:e}),this.add(e),this}getCurrentLevel(){return this._currentLevel}getObjectForDistance(e){const t=this.levels;if(t.length>0){let n,i;for(n=1,i=t.length;n<i;n++){let r=t[n].distance;if(t[n].object.visible&&(r-=r*t[n].hysteresis),e<r)break}return t[n-1].object}return null}raycast(e,t){if(this.levels.length>0){Cr.setFromMatrixPosition(this.matrixWorld);const i=e.ray.origin.distanceTo(Cr);this.getObjectForDistance(i).raycast(e,t)}}update(e){const t=this.levels;if(t.length>1){Cr.setFromMatrixPosition(e.matrixWorld),kc.setFromMatrixPosition(this.matrixWorld);const n=Cr.distanceTo(kc)/e.zoom;t[0].object.visible=!0;let i,r;for(i=1,r=t.length;i<r;i++){let o=t[i].distance;if(t[i].object.visible&&(o-=o*t[i].hysteresis),n>=o)t[i-1].object.visible=!1,t[i].object.visible=!0;else break}for(this._currentLevel=i-1;i<r;i++)t[i].object.visible=!1}}toJSON(e){const t=super.toJSON(e);this.autoUpdate===!1&&(t.object.autoUpdate=!1),t.object.levels=[];const n=this.levels;for(let i=0,r=n.length;i<r;i++){const o=n[i];t.object.levels.push({object:o.object.uuid,distance:o.distance,hysteresis:o.hysteresis})}return t}}const Vc=new I,Gc=new at,Wc=new at,$v=new I,Xc=new Le,Lr=new I,Qo=new bs,Yc=new Le,Jo=new er;class Qv extends le{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=El,this.bindMatrix=new Le,this.bindMatrixInverse=new Le,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new zi),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Lr),this.boundingBox.expandByPoint(Lr)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new bs),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Lr),this.boundingSphere.expandByPoint(Lr)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Qo.copy(this.boundingSphere),Qo.applyMatrix4(i),e.ray.intersectsSphere(Qo)!==!1&&(Yc.copy(i).invert(),Jo.copy(e.ray).applyMatrix4(Yc),!(this.boundingBox!==null&&Jo.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Jo)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new at,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);const r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===El?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===uf?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const n=this.skeleton,i=this.geometry;Gc.fromBufferAttribute(i.attributes.skinIndex,e),Wc.fromBufferAttribute(i.attributes.skinWeight,e),Vc.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let r=0;r<4;r++){const o=Wc.getComponent(r);if(o!==0){const a=Gc.getComponent(r);Xc.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),t.addScaledVector($v.copy(Vc).applyMatrix4(Xc),o)}}return t.applyMatrix4(this.bindMatrixInverse)}boneTransform(e,t){return console.warn("THREE.SkinnedMesh: .boneTransform() was renamed to .applyBoneTransform() in r151."),this.applyBoneTransform(e,t)}}class Aa extends ut{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Ku extends Bt{constructor(e=null,t=1,n=1,i,r,o,a,l,c=Lt,h=Lt,u,d){super(null,o,a,l,c,h,i,r,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const jc=new Le,Jv=new Le;class Za{constructor(e=[],t=[]){this.uuid=pi(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new Le)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const n=new Le;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let r=0,o=e.length;r<o;r++){const a=e[r]?e[r].matrixWorld:Jv;jc.multiplyMatrices(a,t[r]),jc.toArray(n,r*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new Za(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const n=new Ku(t,e,e,pn,Dn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){const i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){const r=e.bones[n];let o=t[r];o===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",r),o=new Aa),this.bones.push(o),this.boneInverses.push(new Le().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){const e={metadata:{version:4.6,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,n=this.boneInverses;for(let i=0,r=t.length;i<r;i++){const o=t[i];e.bones.push(o.uuid);const a=n[i];e.boneInverses.push(a.toArray())}return e}}class ni extends mi{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ne(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const qc=new I,Zc=new I,Kc=new Le,ea=new er,Ir=new bs;class yn extends ut{constructor(e=new St,t=new ni){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let i=1,r=t.count;i<r;i++)qc.fromBufferAttribute(t,i-1),Zc.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=qc.distanceTo(Zc);e.setAttribute("lineDistance",new it(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ir.copy(n.boundingSphere),Ir.applyMatrix4(i),Ir.radius+=r,e.ray.intersectsSphere(Ir)===!1)return;Kc.copy(i).invert(),ea.copy(e.ray).applyMatrix4(Kc);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=new I,h=new I,u=new I,d=new I,f=this.isLineSegments?2:1,g=n.index,m=n.attributes.position;if(g!==null){const p=Math.max(0,o.start),_=Math.min(g.count,o.start+o.count);for(let x=p,M=_-1;x<M;x+=f){const y=g.getX(x),b=g.getX(x+1);if(c.fromBufferAttribute(m,y),h.fromBufferAttribute(m,b),ea.distanceSqToSegment(c,h,d,u)>l)continue;d.applyMatrix4(this.matrixWorld);const L=e.ray.origin.distanceTo(d);L<e.near||L>e.far||t.push({distance:L,point:u.clone().applyMatrix4(this.matrixWorld),index:x,face:null,faceIndex:null,object:this})}}else{const p=Math.max(0,o.start),_=Math.min(m.count,o.start+o.count);for(let x=p,M=_-1;x<M;x+=f){if(c.fromBufferAttribute(m,x),h.fromBufferAttribute(m,x+1),ea.distanceSqToSegment(c,h,d,u)>l)continue;d.applyMatrix4(this.matrixWorld);const b=e.ray.origin.distanceTo(d);b<e.near||b>e.far||t.push({distance:b,point:u.clone().applyMatrix4(this.matrixWorld),index:x,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}const $c=new I,Qc=new I;class Dr extends yn{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let i=0,r=t.count;i<r;i+=2)$c.fromBufferAttribute(t,i),Qc.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+$c.distanceTo(Qc);e.setAttribute("lineDistance",new it(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class e_{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,i=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),r+=n.distanceTo(i),t.push(r),i=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){const n=this.getLengths();let i=0;const r=n.length;let o;t?o=t:o=e*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(i=Math.floor(a+(l-a)/2),c=n[i]-o,c<0)a=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===o)return i/(r-1);const h=n[i],d=n[i+1]-h,f=(o-h)/d;return(i+f)/(r-1)}getTangent(e,t){let i=e-1e-4,r=e+1e-4;i<0&&(i=0),r>1&&(r=1);const o=this.getPoint(i),a=this.getPoint(r),l=t||(o.isVector2?new _e:new I);return l.copy(a).sub(o).normalize(),l}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){const n=new I,i=[],r=[],o=[],a=new I,l=new Le;for(let f=0;f<=e;f++){const g=f/e;i[f]=this.getTangentAt(g,new I)}r[0]=new I,o[0]=new I;let c=Number.MAX_VALUE;const h=Math.abs(i[0].x),u=Math.abs(i[0].y),d=Math.abs(i[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),a.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],a),o[0].crossVectors(i[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(i[f-1],i[f]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(Ot(i[f-1].dot(i[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(a,g))}o[f].crossVectors(i[f],r[f])}if(t===!0){let f=Math.acos(Ot(r[0].dot(r[e]),-1,1));f/=e,i[0].dot(a.crossVectors(r[0],r[e]))>0&&(f=-f);for(let g=1;g<=e;g++)r[g].applyMatrix4(l.makeRotationAxis(i[g],f*g)),o[g].crossVectors(i[g],r[g])}return{tangents:i,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class Mt extends St{constructor(e=1,t=1,n=1,i=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};const c=this;i=Math.floor(i),r=Math.floor(r);const h=[],u=[],d=[],f=[];let g=0;const v=[],m=n/2;let p=0;_(),o===!1&&(e>0&&x(!0),t>0&&x(!1)),this.setIndex(h),this.setAttribute("position",new it(u,3)),this.setAttribute("normal",new it(d,3)),this.setAttribute("uv",new it(f,2));function _(){const M=new I,y=new I;let b=0;const T=(t-e)/n;for(let L=0;L<=r;L++){const S=[],E=L/r,C=E*(t-e)+e;for(let U=0;U<=i;U++){const z=U/i,D=z*l+a,N=Math.sin(D),H=Math.cos(D);y.x=C*N,y.y=-E*n+m,y.z=C*H,u.push(y.x,y.y,y.z),M.set(N,T,H).normalize(),d.push(M.x,M.y,M.z),f.push(z,1-E),S.push(g++)}v.push(S)}for(let L=0;L<i;L++)for(let S=0;S<r;S++){const E=v[S][L],C=v[S+1][L],U=v[S+1][L+1],z=v[S][L+1];h.push(E,C,z),h.push(C,U,z),b+=6}c.addGroup(p,b,0),p+=b}function x(M){const y=g,b=new _e,T=new I;let L=0;const S=M===!0?e:t,E=M===!0?1:-1;for(let U=1;U<=i;U++)u.push(0,m*E,0),d.push(0,E,0),f.push(.5,.5),g++;const C=g;for(let U=0;U<=i;U++){const D=U/i*l+a,N=Math.cos(D),H=Math.sin(D);T.x=S*H,T.y=m*E,T.z=S*N,u.push(T.x,T.y,T.z),d.push(0,E,0),b.x=N*.5+.5,b.y=H*.5*E+.5,f.push(b.x,b.y),g++}for(let U=0;U<i;U++){const z=y+U,D=C+U;M===!0?h.push(D,D+1,z):h.push(D+1,D,z),L+=3}c.addGroup(p,L,M===!0?1:2),p+=L}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Mt(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class tr extends Mt{constructor(e=1,t=1,n=32,i=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,n,i,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new tr(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Ka extends St{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};const r=[],o=[];a(i),c(n),h(),this.setAttribute("position",new it(r,3)),this.setAttribute("normal",new it(r.slice(),3)),this.setAttribute("uv",new it(o,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function a(_){const x=new I,M=new I,y=new I;for(let b=0;b<t.length;b+=3)f(t[b+0],x),f(t[b+1],M),f(t[b+2],y),l(x,M,y,_)}function l(_,x,M,y){const b=y+1,T=[];for(let L=0;L<=b;L++){T[L]=[];const S=_.clone().lerp(M,L/b),E=x.clone().lerp(M,L/b),C=b-L;for(let U=0;U<=C;U++)U===0&&L===b?T[L][U]=S:T[L][U]=S.clone().lerp(E,U/C)}for(let L=0;L<b;L++)for(let S=0;S<2*(b-L)-1;S++){const E=Math.floor(S/2);S%2===0?(d(T[L][E+1]),d(T[L+1][E]),d(T[L][E])):(d(T[L][E+1]),d(T[L+1][E+1]),d(T[L+1][E]))}}function c(_){const x=new I;for(let M=0;M<r.length;M+=3)x.x=r[M+0],x.y=r[M+1],x.z=r[M+2],x.normalize().multiplyScalar(_),r[M+0]=x.x,r[M+1]=x.y,r[M+2]=x.z}function h(){const _=new I;for(let x=0;x<r.length;x+=3){_.x=r[x+0],_.y=r[x+1],_.z=r[x+2];const M=m(_)/2/Math.PI+.5,y=p(_)/Math.PI+.5;o.push(M,1-y)}g(),u()}function u(){for(let _=0;_<o.length;_+=6){const x=o[_+0],M=o[_+2],y=o[_+4],b=Math.max(x,M,y),T=Math.min(x,M,y);b>.9&&T<.1&&(x<.2&&(o[_+0]+=1),M<.2&&(o[_+2]+=1),y<.2&&(o[_+4]+=1))}}function d(_){r.push(_.x,_.y,_.z)}function f(_,x){const M=_*3;x.x=e[M+0],x.y=e[M+1],x.z=e[M+2]}function g(){const _=new I,x=new I,M=new I,y=new I,b=new _e,T=new _e,L=new _e;for(let S=0,E=0;S<r.length;S+=9,E+=6){_.set(r[S+0],r[S+1],r[S+2]),x.set(r[S+3],r[S+4],r[S+5]),M.set(r[S+6],r[S+7],r[S+8]),b.set(o[E+0],o[E+1]),T.set(o[E+2],o[E+3]),L.set(o[E+4],o[E+5]),y.copy(_).add(x).add(M).divideScalar(3);const C=m(y);v(b,E+0,_,C),v(T,E+2,x,C),v(L,E+4,M,C)}}function v(_,x,M,y){y<0&&_.x===1&&(o[x]=_.x-1),M.x===0&&M.z===0&&(o[x]=y/2/Math.PI+.5)}function m(_){return Math.atan2(_.z,-_.x)}function p(_){return Math.atan2(-_.y,Math.sqrt(_.x*_.x+_.z*_.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ka(e.vertices,e.indices,e.radius,e.details)}}const Ur=new I,Fr=new I,ta=new I,Nr=new fn;class Jc extends St{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){const i=Math.pow(10,4),r=Math.cos(gs*t),o=e.getIndex(),a=e.getAttribute("position"),l=o?o.count:a.count,c=[0,0,0],h=["a","b","c"],u=new Array(3),d={},f=[];for(let g=0;g<l;g+=3){o?(c[0]=o.getX(g),c[1]=o.getX(g+1),c[2]=o.getX(g+2)):(c[0]=g,c[1]=g+1,c[2]=g+2);const{a:v,b:m,c:p}=Nr;if(v.fromBufferAttribute(a,c[0]),m.fromBufferAttribute(a,c[1]),p.fromBufferAttribute(a,c[2]),Nr.getNormal(ta),u[0]=`${Math.round(v.x*i)},${Math.round(v.y*i)},${Math.round(v.z*i)}`,u[1]=`${Math.round(m.x*i)},${Math.round(m.y*i)},${Math.round(m.z*i)}`,u[2]=`${Math.round(p.x*i)},${Math.round(p.y*i)},${Math.round(p.z*i)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let _=0;_<3;_++){const x=(_+1)%3,M=u[_],y=u[x],b=Nr[h[_]],T=Nr[h[x]],L=`${M}_${y}`,S=`${y}_${M}`;S in d&&d[S]?(ta.dot(d[S].normal)<=r&&(f.push(b.x,b.y,b.z),f.push(T.x,T.y,T.z)),d[S]=null):L in d||(d[L]={index0:c[_],index1:c[x],normal:ta.clone()})}}for(const g in d)if(d[g]){const{index0:v,index1:m}=d[g];Ur.fromBufferAttribute(a,v),Fr.fromBufferAttribute(a,m),f.push(Ur.x,Ur.y,Ur.z),f.push(Fr.x,Fr.y,Fr.z)}this.setAttribute("position",new it(f,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}const t_={triangulate:function(s,e,t=2){const n=e&&e.length,i=n?e[0]*t:s.length;let r=$u(s,0,i,t,!0);const o=[];if(!r||r.next===r.prev)return o;let a,l,c,h,u,d,f;if(n&&(r=o_(s,e,r,t)),s.length>80*t){a=c=s[0],l=h=s[1];for(let g=t;g<i;g+=t)u=s[g],d=s[g+1],u<a&&(a=u),d<l&&(l=d),u>c&&(c=u),d>h&&(h=d);f=Math.max(c-a,h-l),f=f!==0?32767/f:0}return js(r,o,t,a,l,f,0),o}};function $u(s,e,t,n,i){let r,o;if(i===v_(s,e,t,n)>0)for(r=e;r<t;r+=n)o=eh(r,s[r],s[r+1],o);else for(r=t-n;r>=e;r-=n)o=eh(r,s[r],s[r+1],o);return o&&po(o,o.next)&&(Zs(o),o=o.next),o}function Fi(s,e){if(!s)return s;e||(e=s);let t=s,n;do if(n=!1,!t.steiner&&(po(t,t.next)||yt(t.prev,t,t.next)===0)){if(Zs(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function js(s,e,t,n,i,r,o){if(!s)return;!o&&r&&u_(s,n,i,r);let a=s,l,c;for(;s.prev!==s.next;){if(l=s.prev,c=s.next,r?i_(s,n,i,r):n_(s)){e.push(l.i/t|0),e.push(s.i/t|0),e.push(c.i/t|0),Zs(s),s=c.next,a=c.next;continue}if(s=c,s===a){o?o===1?(s=s_(Fi(s),e,t),js(s,e,t,n,i,r,2)):o===2&&r_(s,e,t,n,i,r):js(Fi(s),e,t,n,i,r,1);break}}}function n_(s){const e=s.prev,t=s,n=s.next;if(yt(e,t,n)>=0)return!1;const i=e.x,r=t.x,o=n.x,a=e.y,l=t.y,c=n.y,h=i<r?i<o?i:o:r<o?r:o,u=a<l?a<c?a:c:l<c?l:c,d=i>r?i>o?i:o:r>o?r:o,f=a>l?a>c?a:c:l>c?l:c;let g=n.next;for(;g!==e;){if(g.x>=h&&g.x<=d&&g.y>=u&&g.y<=f&&fs(i,a,r,l,o,c,g.x,g.y)&&yt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function i_(s,e,t,n){const i=s.prev,r=s,o=s.next;if(yt(i,r,o)>=0)return!1;const a=i.x,l=r.x,c=o.x,h=i.y,u=r.y,d=o.y,f=a<l?a<c?a:c:l<c?l:c,g=h<u?h<d?h:d:u<d?u:d,v=a>l?a>c?a:c:l>c?l:c,m=h>u?h>d?h:d:u>d?u:d,p=Pa(f,g,e,t,n),_=Pa(v,m,e,t,n);let x=s.prevZ,M=s.nextZ;for(;x&&x.z>=p&&M&&M.z<=_;){if(x.x>=f&&x.x<=v&&x.y>=g&&x.y<=m&&x!==i&&x!==o&&fs(a,h,l,u,c,d,x.x,x.y)&&yt(x.prev,x,x.next)>=0||(x=x.prevZ,M.x>=f&&M.x<=v&&M.y>=g&&M.y<=m&&M!==i&&M!==o&&fs(a,h,l,u,c,d,M.x,M.y)&&yt(M.prev,M,M.next)>=0))return!1;M=M.nextZ}for(;x&&x.z>=p;){if(x.x>=f&&x.x<=v&&x.y>=g&&x.y<=m&&x!==i&&x!==o&&fs(a,h,l,u,c,d,x.x,x.y)&&yt(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;M&&M.z<=_;){if(M.x>=f&&M.x<=v&&M.y>=g&&M.y<=m&&M!==i&&M!==o&&fs(a,h,l,u,c,d,M.x,M.y)&&yt(M.prev,M,M.next)>=0)return!1;M=M.nextZ}return!0}function s_(s,e,t){let n=s;do{const i=n.prev,r=n.next.next;!po(i,r)&&Qu(i,n,n.next,r)&&qs(i,r)&&qs(r,i)&&(e.push(i.i/t|0),e.push(n.i/t|0),e.push(r.i/t|0),Zs(n),Zs(n.next),n=s=r),n=n.next}while(n!==s);return Fi(n)}function r_(s,e,t,n,i,r){let o=s;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&p_(o,a)){let l=Ju(o,a);o=Fi(o,o.next),l=Fi(l,l.next),js(o,e,t,n,i,r,0),js(l,e,t,n,i,r,0);return}a=a.next}o=o.next}while(o!==s)}function o_(s,e,t,n){const i=[];let r,o,a,l,c;for(r=0,o=e.length;r<o;r++)a=e[r]*n,l=r<o-1?e[r+1]*n:s.length,c=$u(s,a,l,n,!1),c===c.next&&(c.steiner=!0),i.push(f_(c));for(i.sort(a_),r=0;r<i.length;r++)t=l_(i[r],t);return t}function a_(s,e){return s.x-e.x}function l_(s,e){const t=c_(s,e);if(!t)return e;const n=Ju(t,s);return Fi(n,n.next),Fi(t,t.next)}function c_(s,e){let t=e,n=-1/0,i;const r=s.x,o=s.y;do{if(o<=t.y&&o>=t.next.y&&t.next.y!==t.y){const d=t.x+(o-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(d<=r&&d>n&&(n=d,i=t.x<t.next.x?t:t.next,d===r))return i}t=t.next}while(t!==e);if(!i)return null;const a=i,l=i.x,c=i.y;let h=1/0,u;t=i;do r>=t.x&&t.x>=l&&r!==t.x&&fs(o<c?r:n,o,l,c,o<c?n:r,o,t.x,t.y)&&(u=Math.abs(o-t.y)/(r-t.x),qs(t,s)&&(u<h||u===h&&(t.x>i.x||t.x===i.x&&h_(i,t)))&&(i=t,h=u)),t=t.next;while(t!==a);return i}function h_(s,e){return yt(s.prev,s,e.prev)<0&&yt(e.next,s,s.next)<0}function u_(s,e,t,n){let i=s;do i.z===0&&(i.z=Pa(i.x,i.y,e,t,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==s);i.prevZ.nextZ=null,i.prevZ=null,d_(i)}function d_(s){let e,t,n,i,r,o,a,l,c=1;do{for(t=s,s=null,r=null,o=0;t;){for(o++,n=t,a=0,e=0;e<c&&(a++,n=n.nextZ,!!n);e++);for(l=c;a>0||l>0&&n;)a!==0&&(l===0||!n||t.z<=n.z)?(i=t,t=t.nextZ,a--):(i=n,n=n.nextZ,l--),r?r.nextZ=i:s=i,i.prevZ=r,r=i;t=n}r.nextZ=null,c*=2}while(o>1);return s}function Pa(s,e,t,n,i){return s=(s-t)*i|0,e=(e-n)*i|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,s|e<<1}function f_(s){let e=s,t=s;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==s);return t}function fs(s,e,t,n,i,r,o,a){return(i-o)*(e-a)>=(s-o)*(r-a)&&(s-o)*(n-a)>=(t-o)*(e-a)&&(t-o)*(r-a)>=(i-o)*(n-a)}function p_(s,e){return s.next.i!==e.i&&s.prev.i!==e.i&&!m_(s,e)&&(qs(s,e)&&qs(e,s)&&g_(s,e)&&(yt(s.prev,s,e.prev)||yt(s,e.prev,e))||po(s,e)&&yt(s.prev,s,s.next)>0&&yt(e.prev,e,e.next)>0)}function yt(s,e,t){return(e.y-s.y)*(t.x-e.x)-(e.x-s.x)*(t.y-e.y)}function po(s,e){return s.x===e.x&&s.y===e.y}function Qu(s,e,t,n){const i=Br(yt(s,e,t)),r=Br(yt(s,e,n)),o=Br(yt(t,n,s)),a=Br(yt(t,n,e));return!!(i!==r&&o!==a||i===0&&Or(s,t,e)||r===0&&Or(s,n,e)||o===0&&Or(t,s,n)||a===0&&Or(t,e,n))}function Or(s,e,t){return e.x<=Math.max(s.x,t.x)&&e.x>=Math.min(s.x,t.x)&&e.y<=Math.max(s.y,t.y)&&e.y>=Math.min(s.y,t.y)}function Br(s){return s>0?1:s<0?-1:0}function m_(s,e){let t=s;do{if(t.i!==s.i&&t.next.i!==s.i&&t.i!==e.i&&t.next.i!==e.i&&Qu(t,t.next,s,e))return!0;t=t.next}while(t!==s);return!1}function qs(s,e){return yt(s.prev,s,s.next)<0?yt(s,e,s.next)>=0&&yt(s,s.prev,e)>=0:yt(s,e,s.prev)<0||yt(s,s.next,e)<0}function g_(s,e){let t=s,n=!1;const i=(s.x+e.x)/2,r=(s.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&i<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==s);return n}function Ju(s,e){const t=new Ra(s.i,s.x,s.y),n=new Ra(e.i,e.x,e.y),i=s.next,r=e.prev;return s.next=e,e.prev=s,t.next=i,i.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function eh(s,e,t,n){const i=new Ra(s,e,t);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function Zs(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function Ra(s,e,t){this.i=s,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function v_(s,e,t,n){let i=0;for(let r=e,o=t-n;r<t;r+=n)i+=(s[o]-s[r])*(s[r+1]+s[o+1]),o=r;return i}class $a{static area(e){const t=e.length;let n=0;for(let i=t-1,r=0;r<t;i=r++)n+=e[i].x*e[r].y-e[r].x*e[i].y;return n*.5}static isClockWise(e){return $a.area(e)<0}static triangulateShape(e,t){const n=[],i=[],r=[];th(e),nh(n,e);let o=e.length;t.forEach(th);for(let l=0;l<t.length;l++)i.push(o),o+=t[l].length,nh(n,t[l]);const a=t_.triangulate(n,i);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}}function th(s){const e=s.length;e>2&&s[e-1].equals(s[0])&&s.pop()}function nh(s,e){for(let t=0;t<e.length;t++)s.push(e[t].x),s.push(e[t].y)}class ps extends Ka{constructor(e=1,t=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new ps(e.radius,e.detail)}}class fi extends St{constructor(e=1,t=32,n=16,i=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const h=[],u=new I,d=new I,f=[],g=[],v=[],m=[];for(let p=0;p<=n;p++){const _=[],x=p/n;let M=0;p===0&&o===0?M=.5/t:p===n&&l===Math.PI&&(M=-.5/t);for(let y=0;y<=t;y++){const b=y/t;u.x=-e*Math.cos(i+b*r)*Math.sin(o+x*a),u.y=e*Math.cos(o+x*a),u.z=e*Math.sin(i+b*r)*Math.sin(o+x*a),g.push(u.x,u.y,u.z),d.copy(u).normalize(),v.push(d.x,d.y,d.z),m.push(b+M,1-x),_.push(c++)}h.push(_)}for(let p=0;p<n;p++)for(let _=0;_<t;_++){const x=h[p][_+1],M=h[p][_],y=h[p+1][_],b=h[p+1][_+1];(p!==0||o>0)&&f.push(x,M,b),(p!==n-1||l<Math.PI)&&f.push(M,y,b)}this.setIndex(f),this.setAttribute("position",new it(g,3)),this.setAttribute("normal",new it(v,3)),this.setAttribute("uv",new it(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new fi(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Ai extends St{constructor(e=1,t=.4,n=12,i=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:i,arc:r},n=Math.floor(n),i=Math.floor(i);const o=[],a=[],l=[],c=[],h=new I,u=new I,d=new I;for(let f=0;f<=n;f++)for(let g=0;g<=i;g++){const v=g/i*r,m=f/n*Math.PI*2;u.x=(e+t*Math.cos(m))*Math.cos(v),u.y=(e+t*Math.cos(m))*Math.sin(v),u.z=t*Math.sin(m),a.push(u.x,u.y,u.z),h.x=e*Math.cos(v),h.y=e*Math.sin(v),d.subVectors(u,h).normalize(),l.push(d.x,d.y,d.z),c.push(g/i),c.push(f/n)}for(let f=1;f<=n;f++)for(let g=1;g<=i;g++){const v=(i+1)*f+g-1,m=(i+1)*(f-1)+g-1,p=(i+1)*(f-1)+g,_=(i+1)*f+g;o.push(v,m,_),o.push(m,p,_)}this.setIndex(o),this.setAttribute("position",new it(a,3)),this.setAttribute("normal",new it(l,3)),this.setAttribute("uv",new it(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ai(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class __ extends It{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class na extends mi{constructor(e){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new Ne(16777215),this.specular=new Ne(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ne(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=co,this.normalScale=new _e(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=ao,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.specular.copy(e.specular),this.shininess=e.shininess,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class x_ extends mi{constructor(e){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=co,this.normalScale=new _e(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.flatShading=e.flatShading,this}}class _s extends mi{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Ne(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ne(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=co,this.normalScale=new _e(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=ao,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}function zr(s,e,t){return!s||!t&&s.constructor===e?s:typeof e.BYTES_PER_ELEMENT=="number"?new e(s):Array.prototype.slice.call(s)}function M_(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}function y_(s){function e(i,r){return s[i]-s[r]}const t=s.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function ih(s,e,t){const n=s.length,i=new s.constructor(n);for(let r=0,o=0;o!==n;++r){const a=t[r]*e;for(let l=0;l!==e;++l)i[o++]=s[a+l]}return i}function ed(s,e,t,n){let i=1,r=s[0];for(;r!==void 0&&r[n]===void 0;)r=s[i++];if(r===void 0)return;let o=r[n];if(o!==void 0)if(Array.isArray(o))do o=r[n],o!==void 0&&(e.push(r.time),t.push.apply(t,o)),r=s[i++];while(r!==void 0);else if(o.toArray!==void 0)do o=r[n],o!==void 0&&(e.push(r.time),o.toArray(t,t.length)),r=s[i++];while(r!==void 0);else do o=r[n],o!==void 0&&(e.push(r.time),t.push(o)),r=s[i++];while(r!==void 0)}class mo{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,i=t[n],r=t[n-1];n:{e:{let o;t:{i:if(!(e<i)){for(let a=n+2;;){if(i===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=i,i=t[++n],e<i)break e}o=t.length;break t}if(!(e>=r)){const a=t[1];e<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=r,r=t[--n-1],e>=r)break e}o=n,n=0;break t}break n}for(;n<o;){const a=n+o>>>1;e<t[a]?o=a:n=a+1}if(i=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i;for(let o=0;o!==i;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class S_ extends mo{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Kl,endingEnd:Kl}}intervalChanged_(e,t,n){const i=this.parameterPositions;let r=e-2,o=e+1,a=i[r],l=i[o];if(a===void 0)switch(this.getSettings_().endingStart){case $l:r=e,a=2*t-n;break;case Ql:r=i.length-2,a=t+i[r]-i[r+1];break;default:r=e,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case $l:o=e,l=2*n-t;break;case Ql:o=1,l=n+i[1]-i[0];break;default:o=e-1,l=t}const c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(e,t,n,i){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,g=(n-t)/(i-t),v=g*g,m=v*g,p=-d*m+2*d*v-d*g,_=(1+d)*m+(-1.5-2*d)*v+(-.5+d)*g+1,x=(-1-f)*m+(1.5+f)*v+.5*g,M=f*m-f*v;for(let y=0;y!==a;++y)r[y]=p*o[h+y]+_*o[c+y]+x*o[l+y]+M*o[u+y];return r}}class E_ extends mo{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=(n-t)/(i-t),u=1-h;for(let d=0;d!==a;++d)r[d]=o[c+d]*u+o[l+d]*h;return r}}class b_ extends mo{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}}class Nn{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=zr(t,this.TimeBufferType),this.values=zr(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:zr(e.times,Array),values:zr(e.values,Array)};const i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new b_(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new E_(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new S_(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Qr:t=this.InterpolantFactoryMethodDiscrete;break;case Jr:t=this.InterpolantFactoryMethodLinear;break;case Po:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Qr;case this.InterpolantFactoryMethodLinear:return Jr;case this.InterpolantFactoryMethodSmooth:return Po}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e}return this}trim(e,t){const n=this.times,i=n.length;let r=0,o=i-1;for(;r!==i&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==i){r>=o&&(o=Math.max(o,1),r=o-1);const a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,i=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){const l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(i!==void 0&&M_(i))for(let a=0,l=i.length;a!==l;++a){const c=i[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===Po,r=e.length-1;let o=1;for(let a=1;a<r;++a){let l=!1;const c=e[a],h=e[a+1];if(c!==h&&(a!==1||c!==e[0]))if(i)l=!0;else{const u=a*n,d=u-n,f=u+n;for(let g=0;g!==n;++g){const v=t[u+g];if(v!==t[d+g]||v!==t[f+g]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];const u=a*n,d=o*n;for(let f=0;f!==n;++f)t[d+f]=t[u+f]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}}Nn.prototype.TimeBufferType=Float32Array;Nn.prototype.ValueBufferType=Float32Array;Nn.prototype.DefaultInterpolation=Jr;class ws extends Nn{}ws.prototype.ValueTypeName="bool";ws.prototype.ValueBufferType=Array;ws.prototype.DefaultInterpolation=Qr;ws.prototype.InterpolantFactoryMethodLinear=void 0;ws.prototype.InterpolantFactoryMethodSmooth=void 0;class td extends Nn{}td.prototype.ValueTypeName="color";class Ks extends Nn{}Ks.prototype.ValueTypeName="number";class T_ extends mo{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-t)/(i-t);let c=e*a;for(let h=c+a;c!==h;c+=4)ft.slerpFlat(r,0,o,c-a,o,c,l);return r}}class Ni extends Nn{InterpolantFactoryMethodLinear(e){return new T_(this.times,this.values,this.getValueSize(),e)}}Ni.prototype.ValueTypeName="quaternion";Ni.prototype.DefaultInterpolation=Jr;Ni.prototype.InterpolantFactoryMethodSmooth=void 0;class As extends Nn{}As.prototype.ValueTypeName="string";As.prototype.ValueBufferType=Array;As.prototype.DefaultInterpolation=Qr;As.prototype.InterpolantFactoryMethodLinear=void 0;As.prototype.InterpolantFactoryMethodSmooth=void 0;class $s extends Nn{}$s.prototype.ValueTypeName="vector";class w_{constructor(e,t=-1,n,i=xf){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=pi(),this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,i=1/(e.fps||1);for(let o=0,a=n.length;o!==a;++o)t.push(P_(n[o]).scale(i));const r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r}static toJSON(e){const t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode};for(let r=0,o=n.length;r!==o;++r)t.push(Nn.toJSON(n[r]));return i}static CreateFromMorphTargetSequence(e,t,n,i){const r=t.length,o=[];for(let a=0;a<r;a++){let l=[],c=[];l.push((a+r-1)%r,a,(a+1)%r),c.push(0,1,0);const h=y_(l);l=ih(l,1,h),c=ih(c,1,h),!i&&l[0]===0&&(l.push(r),c.push(c[0])),o.push(new Ks(".morphTargetInfluences["+t[a].name+"]",l,c).scale(1/n))}return new this(e,-1,o)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const i={},r=/^([\w-]*?)([\d]+)$/;for(let a=0,l=e.length;a<l;a++){const c=e[a],h=c.name.match(r);if(h&&h.length>1){const u=h[1];let d=i[u];d||(i[u]=d=[]),d.push(c)}}const o=[];for(const a in i)o.push(this.CreateFromMorphTargetSequence(a,i[a],t,n));return o}static parseAnimation(e,t){if(!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;const n=function(u,d,f,g,v){if(f.length!==0){const m=[],p=[];ed(f,m,p,g),m.length!==0&&v.push(new u(d,m,p))}},i=[],r=e.name||"default",o=e.fps||30,a=e.blendMode;let l=e.length||-1;const c=e.hierarchy||[];for(let u=0;u<c.length;u++){const d=c[u].keys;if(!(!d||d.length===0))if(d[0].morphTargets){const f={};let g;for(g=0;g<d.length;g++)if(d[g].morphTargets)for(let v=0;v<d[g].morphTargets.length;v++)f[d[g].morphTargets[v]]=-1;for(const v in f){const m=[],p=[];for(let _=0;_!==d[g].morphTargets.length;++_){const x=d[g];m.push(x.time),p.push(x.morphTarget===v?1:0)}i.push(new Ks(".morphTargetInfluence["+v+"]",m,p))}l=f.length*o}else{const f=".bones["+t[u].name+"]";n($s,f+".position",d,"pos",i),n(Ni,f+".quaternion",d,"rot",i),n($s,f+".scale",d,"scl",i)}}return i.length===0?null:new this(r,l,i,a)}resetDuration(){const e=this.tracks;let t=0;for(let n=0,i=e.length;n!==i;++n){const r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let t=0;t<this.tracks.length;t++)e.push(this.tracks[t].clone());return new this.constructor(this.name,this.duration,e,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}}function A_(s){switch(s.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Ks;case"vector":case"vector2":case"vector3":case"vector4":return $s;case"color":return td;case"quaternion":return Ni;case"bool":case"boolean":return ws;case"string":return As}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+s)}function P_(s){if(s.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=A_(s.type);if(s.times===void 0){const t=[],n=[];ed(s.keys,t,n,"value"),s.times=t,s.values=n}return e.parse!==void 0?e.parse(s):new e(s.name,s.times,s.values,s.interpolation)}const ro={enabled:!1,files:{},add:function(s,e){this.enabled!==!1&&(this.files[s]=e)},get:function(s){if(this.enabled!==!1)return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}};class R_{constructor(e,t,n){const i=this;let r=!1,o=0,a=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(h){a++,r===!1&&i.onStart!==void 0&&i.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,i.onProgress!==void 0&&i.onProgress(h,o,a),o===a&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){const u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){const f=c[u],g=c[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return g}return null}}}const C_=new R_;class Oi{constructor(e){this.manager=e!==void 0?e:C_,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const n=this;return new Promise(function(i,r){n.load(e,i,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}Oi.DEFAULT_MATERIAL_NAME="__DEFAULT";const Gn={};class L_ extends Error{constructor(e,t){super(e),this.response=t}}class I_ extends Oi{constructor(e){super(e)}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=ro.get(e);if(r!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0),r;if(Gn[e]!==void 0){Gn[e].push({onLoad:t,onProgress:n,onError:i});return}Gn[e]=[],Gn[e].push({onLoad:t,onProgress:n,onError:i});const o=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),a=this.mimeType,l=this.responseType;fetch(o).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const h=Gn[e],u=c.body.getReader(),d=c.headers.get("Content-Length")||c.headers.get("X-File-Size"),f=d?parseInt(d):0,g=f!==0;let v=0;const m=new ReadableStream({start(p){_();function _(){u.read().then(({done:x,value:M})=>{if(x)p.close();else{v+=M.byteLength;const y=new ProgressEvent("progress",{lengthComputable:g,loaded:v,total:f});for(let b=0,T=h.length;b<T;b++){const L=h[b];L.onProgress&&L.onProgress(y)}p.enqueue(M),_()}})}}});return new Response(m)}else throw new L_(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,a));case"json":return c.json();default:if(a===void 0)return c.text();{const u=/charset="?([^;"\s]*)"?/i.exec(a),d=u&&u[1]?u[1].toLowerCase():void 0,f=new TextDecoder(d);return c.arrayBuffer().then(g=>f.decode(g))}}}).then(c=>{ro.add(e,c);const h=Gn[e];delete Gn[e];for(let u=0,d=h.length;u<d;u++){const f=h[u];f.onLoad&&f.onLoad(c)}}).catch(c=>{const h=Gn[e];if(h===void 0)throw this.manager.itemError(e),c;delete Gn[e];for(let u=0,d=h.length;u<d;u++){const f=h[u];f.onError&&f.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}}class D_ extends Oi{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,o=ro.get(e);if(o!==void 0)return r.manager.itemStart(e),setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0),o;const a=Ys("img");function l(){h(),ro.add(e,this),t&&t(this),r.manager.itemEnd(e)}function c(u){h(),i&&i(u),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),r.manager.itemStart(e),a.src=e,a}}class U_ extends Oi{constructor(e){super(e)}load(e,t,n,i){const r=new Bt,o=new D_(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){r.image=a,r.needsUpdate=!0,t!==void 0&&t(r)},n,i),r}}class go extends ut{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ne(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}}const ia=new Le,sh=new I,rh=new I;class Qa{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new _e(512,512),this.map=null,this.mapPass=null,this.matrix=new Le,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ya,this._frameExtents=new _e(1,1),this._viewportCount=1,this._viewports=[new at(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;sh.setFromMatrixPosition(e.matrixWorld),t.position.copy(sh),rh.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(rh),t.updateMatrixWorld(),ia.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ia),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(ia)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class F_ extends Qa{constructor(){super(new $t(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(e){const t=this.camera,n=ys*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height,r=e.distance||t.far;(n!==t.fov||i!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=i,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class N_ extends go{constructor(e,t,n=0,i=Math.PI/3,r=0,o=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(ut.DEFAULT_UP),this.updateMatrix(),this.target=new ut,this.distance=n,this.angle=i,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new F_}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}const oh=new Le,Ns=new I,sa=new I;class O_ extends Qa{constructor(){super(new $t(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new _e(4,2),this._viewportCount=6,this._viewports=[new at(2,1,1,1),new at(0,1,1,1),new at(3,1,1,1),new at(1,1,1,1),new at(3,0,1,1),new at(1,0,1,1)],this._cubeDirections=[new I(1,0,0),new I(-1,0,0),new I(0,0,1),new I(0,0,-1),new I(0,1,0),new I(0,-1,0)],this._cubeUps=[new I(0,1,0),new I(0,1,0),new I(0,1,0),new I(0,1,0),new I(0,0,1),new I(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,i=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Ns.setFromMatrixPosition(e.matrixWorld),n.position.copy(Ns),sa.copy(n.position),sa.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(sa),n.updateMatrixWorld(),i.makeTranslation(-Ns.x,-Ns.y,-Ns.z),oh.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(oh)}}class ah extends go{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new O_}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class B_ extends Qa{constructor(){super(new uo(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class nd extends go{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ut.DEFAULT_UP),this.updateMatrix(),this.target=new ut,this.shadow=new B_}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class id extends go{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class z_{static decodeText(e){if(typeof TextDecoder<"u")return new TextDecoder().decode(e);let t="";for(let n=0,i=e.length;n<i;n++)t+=String.fromCharCode(e[n]);try{return decodeURIComponent(escape(t))}catch{return t}}static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}class H_{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=lh(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=lh();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function lh(){return(typeof performance>"u"?Date:performance).now()}const Ja="\\[\\]\\.:\\/",k_=new RegExp("["+Ja+"]","g"),el="[^"+Ja+"]",V_="[^"+Ja.replace("\\.","")+"]",G_=/((?:WC+[\/:])*)/.source.replace("WC",el),W_=/(WCOD+)?/.source.replace("WCOD",V_),X_=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",el),Y_=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",el),j_=new RegExp("^"+G_+W_+X_+Y_+"$"),q_=["material","materials","bones","map"];class Z_{constructor(e,t,n){const i=n||ot.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class ot{constructor(e,t,n){this.path=t,this.parsedPath=n||ot.parseTrackName(t),this.node=ot.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new ot.Composite(e,t,n):new ot(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(k_,"")}static parseTrackName(e){const t=j_.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){const r=n.nodeName.substring(i+1);q_.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(r){for(let o=0;o<r.length;o++){const a=r[o];if(a.name===t||a.uuid===t)return a;const l=n(a.children);if(l)return l}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,i=t.propertyName;let r=t.propertyIndex;if(e||(e=ot.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}const o=e[i];if(o===void 0){const c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}ot.Composite=Z_;ot.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ot.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ot.prototype.GetterByBindingType=[ot.prototype._getValue_direct,ot.prototype._getValue_array,ot.prototype._getValue_arrayElement,ot.prototype._getValue_toArray];ot.prototype.SetterByBindingTypeAndVersioning=[[ot.prototype._setValue_direct,ot.prototype._setValue_direct_setNeedsUpdate,ot.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ot.prototype._setValue_array,ot.prototype._setValue_array_setNeedsUpdate,ot.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ot.prototype._setValue_arrayElement,ot.prototype._setValue_arrayElement_setNeedsUpdate,ot.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ot.prototype._setValue_fromArray,ot.prototype._setValue_fromArray_setNeedsUpdate,ot.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class nr{constructor(e,t,n=0,i=1/0){this.ray=new er(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new Wa,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}intersectObject(e,t=!0,n=[]){return Ca(e,this,n,t),n.sort(ch),n}intersectObjects(e,t=!0,n=[]){for(let i=0,r=e.length;i<r;i++)Ca(e[i],this,n,t);return n.sort(ch),n}}function ch(s,e){return s.distance-e.distance}function Ca(s,e,t,n){if(s.layers.test(e.layers)&&s.raycast(e,t),n===!0){const i=s.children;for(let r=0,o=i.length;r<o;r++)Ca(i[r],e,t,!0)}}class hh{constructor(e=1,t=0,n=0){return this.radius=e,this.phi=t,this.theta=n,this}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(Ot(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:za}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=za);const uh={type:"change"},ra={type:"start"},dh={type:"end"},Hr=new er,fh=new ti,K_=Math.cos(70*zt.DEG2RAD);class $_ extends Bi{constructor(e,t){super(),this.object=e,this.domElement=t,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new I,this.cursor=new I,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:sn.ROTATE,MIDDLE:sn.DOLLY,RIGHT:sn.PAN},this.touches={ONE:Vi.ROTATE,TWO:Vi.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return a.phi},this.getAzimuthalAngle=function(){return a.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(F){F.addEventListener("keydown",Re),this._domElementKeyEvents=F},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",Re),this._domElementKeyEvents=null},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(uh),n.update(),r=i.NONE},this.update=function(){const F=new I,ae=new ft().setFromUnitVectors(e.up,new I(0,1,0)),be=ae.clone().invert(),me=new I,ie=new ft,O=new I,he=2*Math.PI;return function(Be=null){const Fe=n.object.position;F.copy(Fe).sub(n.target),F.applyQuaternion(ae),a.setFromVector3(F),n.autoRotate&&r===i.NONE&&U(E(Be)),n.enableDamping?(a.theta+=l.theta*n.dampingFactor,a.phi+=l.phi*n.dampingFactor):(a.theta+=l.theta,a.phi+=l.phi);let tt=n.minAzimuthAngle,nt=n.maxAzimuthAngle;isFinite(tt)&&isFinite(nt)&&(tt<-Math.PI?tt+=he:tt>Math.PI&&(tt-=he),nt<-Math.PI?nt+=he:nt>Math.PI&&(nt-=he),tt<=nt?a.theta=Math.max(tt,Math.min(nt,a.theta)):a.theta=a.theta>(tt+nt)/2?Math.max(tt,a.theta):Math.min(nt,a.theta)),a.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,a.phi)),a.makeSafe(),n.enableDamping===!0?n.target.addScaledVector(h,n.dampingFactor):n.target.add(h),n.target.sub(n.cursor),n.target.clampLength(n.minTargetRadius,n.maxTargetRadius),n.target.add(n.cursor),n.zoomToCursor&&b||n.object.isOrthographicCamera?a.radius=$(a.radius):a.radius=$(a.radius*c),F.setFromSpherical(a),F.applyQuaternion(be),Fe.copy(n.target).add(F),n.object.lookAt(n.target),n.enableDamping===!0?(l.theta*=1-n.dampingFactor,l.phi*=1-n.dampingFactor,h.multiplyScalar(1-n.dampingFactor)):(l.set(0,0,0),h.set(0,0,0));let Et=!1;if(n.zoomToCursor&&b){let Tt=null;if(n.object.isPerspectiveCamera){const rt=F.length();Tt=$(rt*c);const Rt=rt-Tt;n.object.position.addScaledVector(M,Rt),n.object.updateMatrixWorld()}else if(n.object.isOrthographicCamera){const rt=new I(y.x,y.y,0);rt.unproject(n.object),n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/c)),n.object.updateProjectionMatrix(),Et=!0;const Rt=new I(y.x,y.y,0);Rt.unproject(n.object),n.object.position.sub(Rt).add(rt),n.object.updateMatrixWorld(),Tt=F.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;Tt!==null&&(this.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(Tt).add(n.object.position):(Hr.origin.copy(n.object.position),Hr.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(Hr.direction))<K_?e.lookAt(n.target):(fh.setFromNormalAndCoplanarPoint(n.object.up,n.target),Hr.intersectPlane(fh,n.target))))}else n.object.isOrthographicCamera&&(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/c)),n.object.updateProjectionMatrix(),Et=!0);return c=1,b=!1,Et||me.distanceToSquared(n.object.position)>o||8*(1-ie.dot(n.object.quaternion))>o||O.distanceToSquared(n.target)>0?(n.dispatchEvent(uh),me.copy(n.object.position),ie.copy(n.object.quaternion),O.copy(n.target),!0):!1}}(),this.dispose=function(){n.domElement.removeEventListener("contextmenu",et),n.domElement.removeEventListener("pointerdown",R),n.domElement.removeEventListener("pointercancel",G),n.domElement.removeEventListener("wheel",oe),n.domElement.removeEventListener("pointermove",w),n.domElement.removeEventListener("pointerup",G),n._domElementKeyEvents!==null&&(n._domElementKeyEvents.removeEventListener("keydown",Re),n._domElementKeyEvents=null)};const n=this,i={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let r=i.NONE;const o=1e-6,a=new hh,l=new hh;let c=1;const h=new I,u=new _e,d=new _e,f=new _e,g=new _e,v=new _e,m=new _e,p=new _e,_=new _e,x=new _e,M=new I,y=new _e;let b=!1;const T=[],L={};let S=!1;function E(F){return F!==null?2*Math.PI/60*n.autoRotateSpeed*F:2*Math.PI/60/60*n.autoRotateSpeed}function C(F){const ae=Math.abs(F*.01);return Math.pow(.95,n.zoomSpeed*ae)}function U(F){l.theta-=F}function z(F){l.phi-=F}const D=function(){const F=new I;return function(be,me){F.setFromMatrixColumn(me,0),F.multiplyScalar(-be),h.add(F)}}(),N=function(){const F=new I;return function(be,me){n.screenSpacePanning===!0?F.setFromMatrixColumn(me,1):(F.setFromMatrixColumn(me,0),F.crossVectors(n.object.up,F)),F.multiplyScalar(be),h.add(F)}}(),H=function(){const F=new I;return function(be,me){const ie=n.domElement;if(n.object.isPerspectiveCamera){const O=n.object.position;F.copy(O).sub(n.target);let he=F.length();he*=Math.tan(n.object.fov/2*Math.PI/180),D(2*be*he/ie.clientHeight,n.object.matrix),N(2*me*he/ie.clientHeight,n.object.matrix)}else n.object.isOrthographicCamera?(D(be*(n.object.right-n.object.left)/n.object.zoom/ie.clientWidth,n.object.matrix),N(me*(n.object.top-n.object.bottom)/n.object.zoom/ie.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}}();function Z(F){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?c/=F:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function B(F){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?c*=F:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function X(F,ae){if(!n.zoomToCursor)return;b=!0;const be=n.domElement.getBoundingClientRect(),me=F-be.left,ie=ae-be.top,O=be.width,he=be.height;y.x=me/O*2-1,y.y=-(ie/he)*2+1,M.set(y.x,y.y,1).unproject(n.object).sub(n.object.position).normalize()}function $(F){return Math.max(n.minDistance,Math.min(n.maxDistance,F))}function te(F){u.set(F.clientX,F.clientY)}function Q(F){X(F.clientX,F.clientX),p.set(F.clientX,F.clientY)}function V(F){g.set(F.clientX,F.clientY)}function J(F){d.set(F.clientX,F.clientY),f.subVectors(d,u).multiplyScalar(n.rotateSpeed);const ae=n.domElement;U(2*Math.PI*f.x/ae.clientHeight),z(2*Math.PI*f.y/ae.clientHeight),u.copy(d),n.update()}function ce(F){_.set(F.clientX,F.clientY),x.subVectors(_,p),x.y>0?Z(C(x.y)):x.y<0&&B(C(x.y)),p.copy(_),n.update()}function ve(F){v.set(F.clientX,F.clientY),m.subVectors(v,g).multiplyScalar(n.panSpeed),H(m.x,m.y),g.copy(v),n.update()}function fe(F){X(F.clientX,F.clientY),F.deltaY<0?B(C(F.deltaY)):F.deltaY>0&&Z(C(F.deltaY)),n.update()}function Se(F){let ae=!1;switch(F.code){case n.keys.UP:F.ctrlKey||F.metaKey||F.shiftKey?z(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):H(0,n.keyPanSpeed),ae=!0;break;case n.keys.BOTTOM:F.ctrlKey||F.metaKey||F.shiftKey?z(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):H(0,-n.keyPanSpeed),ae=!0;break;case n.keys.LEFT:F.ctrlKey||F.metaKey||F.shiftKey?U(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):H(n.keyPanSpeed,0),ae=!0;break;case n.keys.RIGHT:F.ctrlKey||F.metaKey||F.shiftKey?U(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):H(-n.keyPanSpeed,0),ae=!0;break}ae&&(F.preventDefault(),n.update())}function Pe(F){if(T.length===1)u.set(F.pageX,F.pageY);else{const ae=ge(F),be=.5*(F.pageX+ae.x),me=.5*(F.pageY+ae.y);u.set(be,me)}}function Ee(F){if(T.length===1)g.set(F.pageX,F.pageY);else{const ae=ge(F),be=.5*(F.pageX+ae.x),me=.5*(F.pageY+ae.y);g.set(be,me)}}function We(F){const ae=ge(F),be=F.pageX-ae.x,me=F.pageY-ae.y,ie=Math.sqrt(be*be+me*me);p.set(0,ie)}function W(F){n.enableZoom&&We(F),n.enablePan&&Ee(F)}function _t(F){n.enableZoom&&We(F),n.enableRotate&&Pe(F)}function Ae(F){if(T.length==1)d.set(F.pageX,F.pageY);else{const be=ge(F),me=.5*(F.pageX+be.x),ie=.5*(F.pageY+be.y);d.set(me,ie)}f.subVectors(d,u).multiplyScalar(n.rotateSpeed);const ae=n.domElement;U(2*Math.PI*f.x/ae.clientHeight),z(2*Math.PI*f.y/ae.clientHeight),u.copy(d)}function De(F){if(T.length===1)v.set(F.pageX,F.pageY);else{const ae=ge(F),be=.5*(F.pageX+ae.x),me=.5*(F.pageY+ae.y);v.set(be,me)}m.subVectors(v,g).multiplyScalar(n.panSpeed),H(m.x,m.y),g.copy(v)}function Me(F){const ae=ge(F),be=F.pageX-ae.x,me=F.pageY-ae.y,ie=Math.sqrt(be*be+me*me);_.set(0,ie),x.set(0,Math.pow(_.y/p.y,n.zoomSpeed)),Z(x.y),p.copy(_);const O=(F.pageX+ae.x)*.5,he=(F.pageY+ae.y)*.5;X(O,he)}function st(F){n.enableZoom&&Me(F),n.enablePan&&De(F)}function Oe(F){n.enableZoom&&Me(F),n.enableRotate&&Ae(F)}function R(F){n.enabled!==!1&&(T.length===0&&(n.domElement.setPointerCapture(F.pointerId),n.domElement.addEventListener("pointermove",w),n.domElement.addEventListener("pointerup",G)),je(F),F.pointerType==="touch"?He(F):re(F))}function w(F){n.enabled!==!1&&(F.pointerType==="touch"?ne(F):se(F))}function G(F){ke(F),T.length===0&&(n.domElement.releasePointerCapture(F.pointerId),n.domElement.removeEventListener("pointermove",w),n.domElement.removeEventListener("pointerup",G)),n.dispatchEvent(dh),r=i.NONE}function re(F){let ae;switch(F.button){case 0:ae=n.mouseButtons.LEFT;break;case 1:ae=n.mouseButtons.MIDDLE;break;case 2:ae=n.mouseButtons.RIGHT;break;default:ae=-1}switch(ae){case sn.DOLLY:if(n.enableZoom===!1)return;Q(F),r=i.DOLLY;break;case sn.ROTATE:if(F.ctrlKey||F.metaKey||F.shiftKey){if(n.enablePan===!1)return;V(F),r=i.PAN}else{if(n.enableRotate===!1)return;te(F),r=i.ROTATE}break;case sn.PAN:if(F.ctrlKey||F.metaKey||F.shiftKey){if(n.enableRotate===!1)return;te(F),r=i.ROTATE}else{if(n.enablePan===!1)return;V(F),r=i.PAN}break;default:r=i.NONE}r!==i.NONE&&n.dispatchEvent(ra)}function se(F){switch(r){case i.ROTATE:if(n.enableRotate===!1)return;J(F);break;case i.DOLLY:if(n.enableZoom===!1)return;ce(F);break;case i.PAN:if(n.enablePan===!1)return;ve(F);break}}function oe(F){n.enabled===!1||n.enableZoom===!1||r!==i.NONE||(F.preventDefault(),n.dispatchEvent(ra),fe(we(F)),n.dispatchEvent(dh))}function we(F){const ae=F.deltaMode,be={clientX:F.clientX,clientY:F.clientY,deltaY:F.deltaY};switch(ae){case 1:be.deltaY*=16;break;case 2:be.deltaY*=100;break}return F.ctrlKey&&!S&&(be.deltaY*=10),be}function de(F){F.key==="Control"&&(S=!0,document.addEventListener("keyup",xe,{passive:!0,capture:!0}))}function xe(F){F.key==="Control"&&(S=!1,document.removeEventListener("keyup",xe,{passive:!0,capture:!0}))}function Re(F){n.enabled===!1||n.enablePan===!1||Se(F)}function He(F){switch(Ce(F),T.length){case 1:switch(n.touches.ONE){case Vi.ROTATE:if(n.enableRotate===!1)return;Pe(F),r=i.TOUCH_ROTATE;break;case Vi.PAN:if(n.enablePan===!1)return;Ee(F),r=i.TOUCH_PAN;break;default:r=i.NONE}break;case 2:switch(n.touches.TWO){case Vi.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;W(F),r=i.TOUCH_DOLLY_PAN;break;case Vi.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;_t(F),r=i.TOUCH_DOLLY_ROTATE;break;default:r=i.NONE}break;default:r=i.NONE}r!==i.NONE&&n.dispatchEvent(ra)}function ne(F){switch(Ce(F),r){case i.TOUCH_ROTATE:if(n.enableRotate===!1)return;Ae(F),n.update();break;case i.TOUCH_PAN:if(n.enablePan===!1)return;De(F),n.update();break;case i.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;st(F),n.update();break;case i.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;Oe(F),n.update();break;default:r=i.NONE}}function et(F){n.enabled!==!1&&F.preventDefault()}function je(F){T.push(F.pointerId)}function ke(F){delete L[F.pointerId];for(let ae=0;ae<T.length;ae++)if(T[ae]==F.pointerId){T.splice(ae,1);return}}function Ce(F){let ae=L[F.pointerId];ae===void 0&&(ae=new _e,L[F.pointerId]=ae),ae.set(F.pageX,F.pageY)}function ge(F){const ae=F.pointerId===T[0]?T[1]:T[0];return L[ae]}n.domElement.addEventListener("contextmenu",et),n.domElement.addEventListener("pointerdown",R),n.domElement.addEventListener("pointercancel",G),n.domElement.addEventListener("wheel",oe,{passive:!1}),document.addEventListener("keydown",de,{passive:!0,capture:!0}),this.update()}}const Ei=new nr,Gt=new I,Jn=new I,vt=new ft,ph={X:new I(1,0,0),Y:new I(0,1,0),Z:new I(0,0,1)},oa={type:"change"},mh={type:"mouseDown"},gh={type:"mouseUp",mode:null},vh={type:"objectChange"};class Q_ extends ut{constructor(e,t){super(),t===void 0&&(console.warn('THREE.TransformControls: The second parameter "domElement" is now mandatory.'),t=document),this.isTransformControls=!0,this.visible=!1,this.domElement=t,this.domElement.style.touchAction="none";const n=new sx;this._gizmo=n,this.add(n);const i=new rx;this._plane=i,this.add(i);const r=this;function o(_,x){let M=x;Object.defineProperty(r,_,{get:function(){return M!==void 0?M:x},set:function(y){M!==y&&(M=y,i[_]=y,n[_]=y,r.dispatchEvent({type:_+"-changed",value:y}),r.dispatchEvent(oa))}}),r[_]=x,i[_]=x,n[_]=x}o("camera",e),o("object",void 0),o("enabled",!0),o("axis",null),o("mode","translate"),o("translationSnap",null),o("rotationSnap",null),o("scaleSnap",null),o("space","world"),o("size",1),o("dragging",!1),o("showX",!0),o("showY",!0),o("showZ",!0);const a=new I,l=new I,c=new ft,h=new ft,u=new I,d=new ft,f=new I,g=new I,v=new I,m=0,p=new I;o("worldPosition",a),o("worldPositionStart",l),o("worldQuaternion",c),o("worldQuaternionStart",h),o("cameraPosition",u),o("cameraQuaternion",d),o("pointStart",f),o("pointEnd",g),o("rotationAxis",v),o("rotationAngle",m),o("eye",p),this._offset=new I,this._startNorm=new I,this._endNorm=new I,this._cameraScale=new I,this._parentPosition=new I,this._parentQuaternion=new ft,this._parentQuaternionInv=new ft,this._parentScale=new I,this._worldScaleStart=new I,this._worldQuaternionInv=new ft,this._worldScale=new I,this._positionStart=new I,this._quaternionStart=new ft,this._scaleStart=new I,this._getPointer=J_.bind(this),this._onPointerDown=tx.bind(this),this._onPointerHover=ex.bind(this),this._onPointerMove=nx.bind(this),this._onPointerUp=ix.bind(this),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointermove",this._onPointerHover),this.domElement.addEventListener("pointerup",this._onPointerUp)}updateMatrixWorld(){this.object!==void 0&&(this.object.updateMatrixWorld(),this.object.parent===null?console.error("TransformControls: The attached 3D object must be a part of the scene graph."):this.object.parent.matrixWorld.decompose(this._parentPosition,this._parentQuaternion,this._parentScale),this.object.matrixWorld.decompose(this.worldPosition,this.worldQuaternion,this._worldScale),this._parentQuaternionInv.copy(this._parentQuaternion).invert(),this._worldQuaternionInv.copy(this.worldQuaternion).invert()),this.camera.updateMatrixWorld(),this.camera.matrixWorld.decompose(this.cameraPosition,this.cameraQuaternion,this._cameraScale),this.camera.isOrthographicCamera?this.camera.getWorldDirection(this.eye).negate():this.eye.copy(this.cameraPosition).sub(this.worldPosition).normalize(),super.updateMatrixWorld(this)}pointerHover(e){if(this.object===void 0||this.dragging===!0)return;Ei.setFromCamera(e,this.camera);const t=aa(this._gizmo.picker[this.mode],Ei);t?this.axis=t.object.name:this.axis=null}pointerDown(e){if(!(this.object===void 0||this.dragging===!0||e.button!==0)&&this.axis!==null){Ei.setFromCamera(e,this.camera);const t=aa(this._plane,Ei,!0);t&&(this.object.updateMatrixWorld(),this.object.parent.updateMatrixWorld(),this._positionStart.copy(this.object.position),this._quaternionStart.copy(this.object.quaternion),this._scaleStart.copy(this.object.scale),this.object.matrixWorld.decompose(this.worldPositionStart,this.worldQuaternionStart,this._worldScaleStart),this.pointStart.copy(t.point).sub(this.worldPositionStart)),this.dragging=!0,mh.mode=this.mode,this.dispatchEvent(mh)}}pointerMove(e){const t=this.axis,n=this.mode,i=this.object;let r=this.space;if(n==="scale"?r="local":(t==="E"||t==="XYZE"||t==="XYZ")&&(r="world"),i===void 0||t===null||this.dragging===!1||e.button!==-1)return;Ei.setFromCamera(e,this.camera);const o=aa(this._plane,Ei,!0);if(o){if(this.pointEnd.copy(o.point).sub(this.worldPositionStart),n==="translate")this._offset.copy(this.pointEnd).sub(this.pointStart),r==="local"&&t!=="XYZ"&&this._offset.applyQuaternion(this._worldQuaternionInv),t.indexOf("X")===-1&&(this._offset.x=0),t.indexOf("Y")===-1&&(this._offset.y=0),t.indexOf("Z")===-1&&(this._offset.z=0),r==="local"&&t!=="XYZ"?this._offset.applyQuaternion(this._quaternionStart).divide(this._parentScale):this._offset.applyQuaternion(this._parentQuaternionInv).divide(this._parentScale),i.position.copy(this._offset).add(this._positionStart),this.translationSnap&&(r==="local"&&(i.position.applyQuaternion(vt.copy(this._quaternionStart).invert()),t.search("X")!==-1&&(i.position.x=Math.round(i.position.x/this.translationSnap)*this.translationSnap),t.search("Y")!==-1&&(i.position.y=Math.round(i.position.y/this.translationSnap)*this.translationSnap),t.search("Z")!==-1&&(i.position.z=Math.round(i.position.z/this.translationSnap)*this.translationSnap),i.position.applyQuaternion(this._quaternionStart)),r==="world"&&(i.parent&&i.position.add(Gt.setFromMatrixPosition(i.parent.matrixWorld)),t.search("X")!==-1&&(i.position.x=Math.round(i.position.x/this.translationSnap)*this.translationSnap),t.search("Y")!==-1&&(i.position.y=Math.round(i.position.y/this.translationSnap)*this.translationSnap),t.search("Z")!==-1&&(i.position.z=Math.round(i.position.z/this.translationSnap)*this.translationSnap),i.parent&&i.position.sub(Gt.setFromMatrixPosition(i.parent.matrixWorld))));else if(n==="scale"){if(t.search("XYZ")!==-1){let a=this.pointEnd.length()/this.pointStart.length();this.pointEnd.dot(this.pointStart)<0&&(a*=-1),Jn.set(a,a,a)}else Gt.copy(this.pointStart),Jn.copy(this.pointEnd),Gt.applyQuaternion(this._worldQuaternionInv),Jn.applyQuaternion(this._worldQuaternionInv),Jn.divide(Gt),t.search("X")===-1&&(Jn.x=1),t.search("Y")===-1&&(Jn.y=1),t.search("Z")===-1&&(Jn.z=1);i.scale.copy(this._scaleStart).multiply(Jn),this.scaleSnap&&(t.search("X")!==-1&&(i.scale.x=Math.round(i.scale.x/this.scaleSnap)*this.scaleSnap||this.scaleSnap),t.search("Y")!==-1&&(i.scale.y=Math.round(i.scale.y/this.scaleSnap)*this.scaleSnap||this.scaleSnap),t.search("Z")!==-1&&(i.scale.z=Math.round(i.scale.z/this.scaleSnap)*this.scaleSnap||this.scaleSnap))}else if(n==="rotate"){this._offset.copy(this.pointEnd).sub(this.pointStart);const a=20/this.worldPosition.distanceTo(Gt.setFromMatrixPosition(this.camera.matrixWorld));let l=!1;t==="XYZE"?(this.rotationAxis.copy(this._offset).cross(this.eye).normalize(),this.rotationAngle=this._offset.dot(Gt.copy(this.rotationAxis).cross(this.eye))*a):(t==="X"||t==="Y"||t==="Z")&&(this.rotationAxis.copy(ph[t]),Gt.copy(ph[t]),r==="local"&&Gt.applyQuaternion(this.worldQuaternion),Gt.cross(this.eye),Gt.length()===0?l=!0:this.rotationAngle=this._offset.dot(Gt.normalize())*a),(t==="E"||l)&&(this.rotationAxis.copy(this.eye),this.rotationAngle=this.pointEnd.angleTo(this.pointStart),this._startNorm.copy(this.pointStart).normalize(),this._endNorm.copy(this.pointEnd).normalize(),this.rotationAngle*=this._endNorm.cross(this._startNorm).dot(this.eye)<0?1:-1),this.rotationSnap&&(this.rotationAngle=Math.round(this.rotationAngle/this.rotationSnap)*this.rotationSnap),r==="local"&&t!=="E"&&t!=="XYZE"?(i.quaternion.copy(this._quaternionStart),i.quaternion.multiply(vt.setFromAxisAngle(this.rotationAxis,this.rotationAngle)).normalize()):(this.rotationAxis.applyQuaternion(this._parentQuaternionInv),i.quaternion.copy(vt.setFromAxisAngle(this.rotationAxis,this.rotationAngle)),i.quaternion.multiply(this._quaternionStart).normalize())}this.dispatchEvent(oa),this.dispatchEvent(vh)}}pointerUp(e){e.button===0&&(this.dragging&&this.axis!==null&&(gh.mode=this.mode,this.dispatchEvent(gh)),this.dragging=!1,this.axis=null)}dispose(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerHover),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.traverse(function(e){e.geometry&&e.geometry.dispose(),e.material&&e.material.dispose()})}attach(e){return this.object=e,this.visible=!0,this}detach(){return this.object=void 0,this.visible=!1,this.axis=null,this}reset(){this.enabled&&this.dragging&&(this.object.position.copy(this._positionStart),this.object.quaternion.copy(this._quaternionStart),this.object.scale.copy(this._scaleStart),this.dispatchEvent(oa),this.dispatchEvent(vh),this.pointStart.copy(this.pointEnd))}getRaycaster(){return Ei}getMode(){return this.mode}setMode(e){this.mode=e}setTranslationSnap(e){this.translationSnap=e}setRotationSnap(e){this.rotationSnap=e}setScaleSnap(e){this.scaleSnap=e}setSize(e){this.size=e}setSpace(e){this.space=e}}function J_(s){if(this.domElement.ownerDocument.pointerLockElement)return{x:0,y:0,button:s.button};{const e=this.domElement.getBoundingClientRect();return{x:(s.clientX-e.left)/e.width*2-1,y:-(s.clientY-e.top)/e.height*2+1,button:s.button}}}function ex(s){if(this.enabled)switch(s.pointerType){case"mouse":case"pen":this.pointerHover(this._getPointer(s));break}}function tx(s){this.enabled&&(document.pointerLockElement||this.domElement.setPointerCapture(s.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.pointerHover(this._getPointer(s)),this.pointerDown(this._getPointer(s)))}function nx(s){this.enabled&&this.pointerMove(this._getPointer(s))}function ix(s){this.enabled&&(this.domElement.releasePointerCapture(s.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.pointerUp(this._getPointer(s)))}function aa(s,e,t){const n=e.intersectObject(s,!0);for(let i=0;i<n.length;i++)if(n[i].object.visible||t)return n[i];return!1}const kr=new Kt,ct=new I(0,1,0),_h=new I(0,0,0),xh=new Le,Vr=new ft,Zr=new ft,Cn=new I,Mh=new Le,zs=new I(1,0,0),Ti=new I(0,1,0),Hs=new I(0,0,1),Gr=new I,Os=new I,Bs=new I;class sx extends ut{constructor(){super(),this.isTransformControlsGizmo=!0,this.type="TransformControlsGizmo";const e=new In({depthTest:!1,depthWrite:!1,fog:!1,toneMapped:!1,transparent:!0}),t=new ni({depthTest:!1,depthWrite:!1,fog:!1,toneMapped:!1,transparent:!0}),n=e.clone();n.opacity=.15;const i=t.clone();i.opacity=.5;const r=e.clone();r.color.setHex(16711680);const o=e.clone();o.color.setHex(65280);const a=e.clone();a.color.setHex(255);const l=e.clone();l.color.setHex(16711680),l.opacity=.5;const c=e.clone();c.color.setHex(65280),c.opacity=.5;const h=e.clone();h.color.setHex(255),h.opacity=.5;const u=e.clone();u.opacity=.25;const d=e.clone();d.color.setHex(16776960),d.opacity=.25,e.clone().color.setHex(16776960);const g=e.clone();g.color.setHex(7895160);const v=new Mt(0,.04,.1,12);v.translate(0,.05,0);const m=new ht(.08,.08,.08);m.translate(0,.04,0);const p=new St;p.setAttribute("position",new it([0,0,0,1,0,0],3));const _=new Mt(.0075,.0075,.5,3);_.translate(0,.25,0);function x(N,H){const Z=new Ai(N,.0075,3,64,H*Math.PI*2);return Z.rotateY(Math.PI/2),Z.rotateX(Math.PI/2),Z}function M(){const N=new St;return N.setAttribute("position",new it([0,0,0,1,1,1],3)),N}const y={X:[[new le(v,r),[.5,0,0],[0,0,-Math.PI/2]],[new le(v,r),[-.5,0,0],[0,0,Math.PI/2]],[new le(_,r),[0,0,0],[0,0,-Math.PI/2]]],Y:[[new le(v,o),[0,.5,0]],[new le(v,o),[0,-.5,0],[Math.PI,0,0]],[new le(_,o)]],Z:[[new le(v,a),[0,0,.5],[Math.PI/2,0,0]],[new le(v,a),[0,0,-.5],[-Math.PI/2,0,0]],[new le(_,a),null,[Math.PI/2,0,0]]],XYZ:[[new le(new ps(.1,0),u.clone()),[0,0,0]]],XY:[[new le(new ht(.15,.15,.01),h.clone()),[.15,.15,0]]],YZ:[[new le(new ht(.15,.15,.01),l.clone()),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new le(new ht(.15,.15,.01),c.clone()),[.15,0,.15],[-Math.PI/2,0,0]]]},b={X:[[new le(new Mt(.2,0,.6,4),n),[.3,0,0],[0,0,-Math.PI/2]],[new le(new Mt(.2,0,.6,4),n),[-.3,0,0],[0,0,Math.PI/2]]],Y:[[new le(new Mt(.2,0,.6,4),n),[0,.3,0]],[new le(new Mt(.2,0,.6,4),n),[0,-.3,0],[0,0,Math.PI]]],Z:[[new le(new Mt(.2,0,.6,4),n),[0,0,.3],[Math.PI/2,0,0]],[new le(new Mt(.2,0,.6,4),n),[0,0,-.3],[-Math.PI/2,0,0]]],XYZ:[[new le(new ps(.2,0),n)]],XY:[[new le(new ht(.2,.2,.01),n),[.15,.15,0]]],YZ:[[new le(new ht(.2,.2,.01),n),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new le(new ht(.2,.2,.01),n),[.15,0,.15],[-Math.PI/2,0,0]]]},T={START:[[new le(new ps(.01,2),i),null,null,null,"helper"]],END:[[new le(new ps(.01,2),i),null,null,null,"helper"]],DELTA:[[new yn(M(),i),null,null,null,"helper"]],X:[[new yn(p,i.clone()),[-1e3,0,0],null,[1e6,1,1],"helper"]],Y:[[new yn(p,i.clone()),[0,-1e3,0],[0,0,Math.PI/2],[1e6,1,1],"helper"]],Z:[[new yn(p,i.clone()),[0,0,-1e3],[0,-Math.PI/2,0],[1e6,1,1],"helper"]]},L={XYZE:[[new le(x(.5,1),g),null,[0,Math.PI/2,0]]],X:[[new le(x(.5,.5),r)]],Y:[[new le(x(.5,.5),o),null,[0,0,-Math.PI/2]]],Z:[[new le(x(.5,.5),a),null,[0,Math.PI/2,0]]],E:[[new le(x(.75,1),d),null,[0,Math.PI/2,0]]]},S={AXIS:[[new yn(p,i.clone()),[-1e3,0,0],null,[1e6,1,1],"helper"]]},E={XYZE:[[new le(new fi(.25,10,8),n)]],X:[[new le(new Ai(.5,.1,4,24),n),[0,0,0],[0,-Math.PI/2,-Math.PI/2]]],Y:[[new le(new Ai(.5,.1,4,24),n),[0,0,0],[Math.PI/2,0,0]]],Z:[[new le(new Ai(.5,.1,4,24),n),[0,0,0],[0,0,-Math.PI/2]]],E:[[new le(new Ai(.75,.1,2,24),n)]]},C={X:[[new le(m,r),[.5,0,0],[0,0,-Math.PI/2]],[new le(_,r),[0,0,0],[0,0,-Math.PI/2]],[new le(m,r),[-.5,0,0],[0,0,Math.PI/2]]],Y:[[new le(m,o),[0,.5,0]],[new le(_,o)],[new le(m,o),[0,-.5,0],[0,0,Math.PI]]],Z:[[new le(m,a),[0,0,.5],[Math.PI/2,0,0]],[new le(_,a),[0,0,0],[Math.PI/2,0,0]],[new le(m,a),[0,0,-.5],[-Math.PI/2,0,0]]],XY:[[new le(new ht(.15,.15,.01),h),[.15,.15,0]]],YZ:[[new le(new ht(.15,.15,.01),l),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new le(new ht(.15,.15,.01),c),[.15,0,.15],[-Math.PI/2,0,0]]],XYZ:[[new le(new ht(.1,.1,.1),u.clone())]]},U={X:[[new le(new Mt(.2,0,.6,4),n),[.3,0,0],[0,0,-Math.PI/2]],[new le(new Mt(.2,0,.6,4),n),[-.3,0,0],[0,0,Math.PI/2]]],Y:[[new le(new Mt(.2,0,.6,4),n),[0,.3,0]],[new le(new Mt(.2,0,.6,4),n),[0,-.3,0],[0,0,Math.PI]]],Z:[[new le(new Mt(.2,0,.6,4),n),[0,0,.3],[Math.PI/2,0,0]],[new le(new Mt(.2,0,.6,4),n),[0,0,-.3],[-Math.PI/2,0,0]]],XY:[[new le(new ht(.2,.2,.01),n),[.15,.15,0]]],YZ:[[new le(new ht(.2,.2,.01),n),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new le(new ht(.2,.2,.01),n),[.15,0,.15],[-Math.PI/2,0,0]]],XYZ:[[new le(new ht(.2,.2,.2),n),[0,0,0]]]},z={X:[[new yn(p,i.clone()),[-1e3,0,0],null,[1e6,1,1],"helper"]],Y:[[new yn(p,i.clone()),[0,-1e3,0],[0,0,Math.PI/2],[1e6,1,1],"helper"]],Z:[[new yn(p,i.clone()),[0,0,-1e3],[0,-Math.PI/2,0],[1e6,1,1],"helper"]]};function D(N){const H=new ut;for(const Z in N)for(let B=N[Z].length;B--;){const X=N[Z][B][0].clone(),$=N[Z][B][1],te=N[Z][B][2],Q=N[Z][B][3],V=N[Z][B][4];X.name=Z,X.tag=V,$&&X.position.set($[0],$[1],$[2]),te&&X.rotation.set(te[0],te[1],te[2]),Q&&X.scale.set(Q[0],Q[1],Q[2]),X.updateMatrix();const J=X.geometry.clone();J.applyMatrix4(X.matrix),X.geometry=J,X.renderOrder=1/0,X.position.set(0,0,0),X.rotation.set(0,0,0),X.scale.set(1,1,1),H.add(X)}return H}this.gizmo={},this.picker={},this.helper={},this.add(this.gizmo.translate=D(y)),this.add(this.gizmo.rotate=D(L)),this.add(this.gizmo.scale=D(C)),this.add(this.picker.translate=D(b)),this.add(this.picker.rotate=D(E)),this.add(this.picker.scale=D(U)),this.add(this.helper.translate=D(T)),this.add(this.helper.rotate=D(S)),this.add(this.helper.scale=D(z)),this.picker.translate.visible=!1,this.picker.rotate.visible=!1,this.picker.scale.visible=!1}updateMatrixWorld(e){const n=(this.mode==="scale"?"local":this.space)==="local"?this.worldQuaternion:Zr;this.gizmo.translate.visible=this.mode==="translate",this.gizmo.rotate.visible=this.mode==="rotate",this.gizmo.scale.visible=this.mode==="scale",this.helper.translate.visible=this.mode==="translate",this.helper.rotate.visible=this.mode==="rotate",this.helper.scale.visible=this.mode==="scale";let i=[];i=i.concat(this.picker[this.mode].children),i=i.concat(this.gizmo[this.mode].children),i=i.concat(this.helper[this.mode].children);for(let r=0;r<i.length;r++){const o=i[r];o.visible=!0,o.rotation.set(0,0,0),o.position.copy(this.worldPosition);let a;if(this.camera.isOrthographicCamera?a=(this.camera.top-this.camera.bottom)/this.camera.zoom:a=this.worldPosition.distanceTo(this.cameraPosition)*Math.min(1.9*Math.tan(Math.PI*this.camera.fov/360)/this.camera.zoom,7),o.scale.set(1,1,1).multiplyScalar(a*this.size/4),o.tag==="helper"){o.visible=!1,o.name==="AXIS"?(o.visible=!!this.axis,this.axis==="X"&&(vt.setFromEuler(kr.set(0,0,0)),o.quaternion.copy(n).multiply(vt),Math.abs(ct.copy(zs).applyQuaternion(n).dot(this.eye))>.9&&(o.visible=!1)),this.axis==="Y"&&(vt.setFromEuler(kr.set(0,0,Math.PI/2)),o.quaternion.copy(n).multiply(vt),Math.abs(ct.copy(Ti).applyQuaternion(n).dot(this.eye))>.9&&(o.visible=!1)),this.axis==="Z"&&(vt.setFromEuler(kr.set(0,Math.PI/2,0)),o.quaternion.copy(n).multiply(vt),Math.abs(ct.copy(Hs).applyQuaternion(n).dot(this.eye))>.9&&(o.visible=!1)),this.axis==="XYZE"&&(vt.setFromEuler(kr.set(0,Math.PI/2,0)),ct.copy(this.rotationAxis),o.quaternion.setFromRotationMatrix(xh.lookAt(_h,ct,Ti)),o.quaternion.multiply(vt),o.visible=this.dragging),this.axis==="E"&&(o.visible=!1)):o.name==="START"?(o.position.copy(this.worldPositionStart),o.visible=this.dragging):o.name==="END"?(o.position.copy(this.worldPosition),o.visible=this.dragging):o.name==="DELTA"?(o.position.copy(this.worldPositionStart),o.quaternion.copy(this.worldQuaternionStart),Gt.set(1e-10,1e-10,1e-10).add(this.worldPositionStart).sub(this.worldPosition).multiplyScalar(-1),Gt.applyQuaternion(this.worldQuaternionStart.clone().invert()),o.scale.copy(Gt),o.visible=this.dragging):(o.quaternion.copy(n),this.dragging?o.position.copy(this.worldPositionStart):o.position.copy(this.worldPosition),this.axis&&(o.visible=this.axis.search(o.name)!==-1));continue}o.quaternion.copy(n),this.mode==="translate"||this.mode==="scale"?(o.name==="X"&&Math.abs(ct.copy(zs).applyQuaternion(n).dot(this.eye))>.99&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1),o.name==="Y"&&Math.abs(ct.copy(Ti).applyQuaternion(n).dot(this.eye))>.99&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1),o.name==="Z"&&Math.abs(ct.copy(Hs).applyQuaternion(n).dot(this.eye))>.99&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1),o.name==="XY"&&Math.abs(ct.copy(Hs).applyQuaternion(n).dot(this.eye))<.2&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1),o.name==="YZ"&&Math.abs(ct.copy(zs).applyQuaternion(n).dot(this.eye))<.2&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1),o.name==="XZ"&&Math.abs(ct.copy(Ti).applyQuaternion(n).dot(this.eye))<.2&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1)):this.mode==="rotate"&&(Vr.copy(n),ct.copy(this.eye).applyQuaternion(vt.copy(n).invert()),o.name.search("E")!==-1&&o.quaternion.setFromRotationMatrix(xh.lookAt(this.eye,_h,Ti)),o.name==="X"&&(vt.setFromAxisAngle(zs,Math.atan2(-ct.y,ct.z)),vt.multiplyQuaternions(Vr,vt),o.quaternion.copy(vt)),o.name==="Y"&&(vt.setFromAxisAngle(Ti,Math.atan2(ct.x,ct.z)),vt.multiplyQuaternions(Vr,vt),o.quaternion.copy(vt)),o.name==="Z"&&(vt.setFromAxisAngle(Hs,Math.atan2(ct.y,ct.x)),vt.multiplyQuaternions(Vr,vt),o.quaternion.copy(vt))),o.visible=o.visible&&(o.name.indexOf("X")===-1||this.showX),o.visible=o.visible&&(o.name.indexOf("Y")===-1||this.showY),o.visible=o.visible&&(o.name.indexOf("Z")===-1||this.showZ),o.visible=o.visible&&(o.name.indexOf("E")===-1||this.showX&&this.showY&&this.showZ),o.material._color=o.material._color||o.material.color.clone(),o.material._opacity=o.material._opacity||o.material.opacity,o.material.color.copy(o.material._color),o.material.opacity=o.material._opacity,this.enabled&&this.axis&&(o.name===this.axis||this.axis.split("").some(function(l){return o.name===l}))&&(o.material.color.setHex(16776960),o.material.opacity=1)}super.updateMatrixWorld(e)}}class rx extends le{constructor(){super(new ri(1e5,1e5,2,2),new In({visible:!1,wireframe:!0,side:rn,transparent:!0,opacity:.1,toneMapped:!1})),this.isTransformControlsPlane=!0,this.type="TransformControlsPlane"}updateMatrixWorld(e){let t=this.space;switch(this.position.copy(this.worldPosition),this.mode==="scale"&&(t="local"),Gr.copy(zs).applyQuaternion(t==="local"?this.worldQuaternion:Zr),Os.copy(Ti).applyQuaternion(t==="local"?this.worldQuaternion:Zr),Bs.copy(Hs).applyQuaternion(t==="local"?this.worldQuaternion:Zr),ct.copy(Os),this.mode){case"translate":case"scale":switch(this.axis){case"X":ct.copy(this.eye).cross(Gr),Cn.copy(Gr).cross(ct);break;case"Y":ct.copy(this.eye).cross(Os),Cn.copy(Os).cross(ct);break;case"Z":ct.copy(this.eye).cross(Bs),Cn.copy(Bs).cross(ct);break;case"XY":Cn.copy(Bs);break;case"YZ":Cn.copy(Gr);break;case"XZ":ct.copy(Bs),Cn.copy(Os);break;case"XYZ":case"E":Cn.set(0,0,0);break}break;case"rotate":default:Cn.set(0,0,0)}Cn.length()===0?this.quaternion.copy(this.cameraQuaternion):(Mh.lookAt(Gt.set(0,0,0),Cn,ct),this.quaternion.setFromRotationMatrix(Mh)),super.updateMatrixWorld(e)}}const Gs={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class gi{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const ox=new uo(-1,1,1,-1,0,1);class ax extends St{constructor(){super(),this.setAttribute("position",new it([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new it([0,2,0,0,2,0],2))}}const lx=new ax;class ir{constructor(e){this._mesh=new le(lx,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,ox)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class sd extends gi{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof It?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Un.clone(e.uniforms),this.material=new It({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new ir(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class yh extends gi{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){const i=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),r.buffers.stencil.setFunc(i.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(i.EQUAL,1,4294967295),r.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),r.buffers.stencil.setLocked(!0)}}class cx extends gi{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class hx{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const n=e.getSize(new _e);this._width=n.width,this._height=n.height,t=new ln(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:wn}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new sd(Gs),this.copyPass.material.blending=Wt,this.clock=new H_}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let n=!1;for(let i=0,r=this.passes.length;i<r;i++){const o=this.passes[i];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),o.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),o.needsSwap){if(n){const a=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}yh!==void 0&&(o instanceof yh?n=!0:o instanceof cx&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new _e);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const n=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(n,i),this.renderTarget2.setSize(n,i);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,i)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class ux extends gi{constructor(e,t,n=null,i=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=i,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new Ne}render(e,t,n){const i=e.autoClear;e.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor)),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),e.autoClear=i}}const dx={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`
	
		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = OptimizedCineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class fx extends gi{constructor(){super();const e=dx;this.uniforms=Un.clone(e.uniforms),this.material=new __({name:e.name,uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader}),this.fsQuad=new ir(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},lt.getTransfer(this._outputColorSpace)===dt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===_u?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===xu?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Mu?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Ha?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===yu&&(this.material.defines.AGX_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class px{constructor(e=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let t=0;t<256;t++)this.p[t]=Math.floor(e.random()*256);this.perm=[];for(let t=0;t<512;t++)this.perm[t]=this.p[t&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}dot(e,t,n){return e[0]*t+e[1]*n}dot3(e,t,n,i){return e[0]*t+e[1]*n+e[2]*i}dot4(e,t,n,i,r){return e[0]*t+e[1]*n+e[2]*i+e[3]*r}noise(e,t){let n,i,r;const o=.5*(Math.sqrt(3)-1),a=(e+t)*o,l=Math.floor(e+a),c=Math.floor(t+a),h=(3-Math.sqrt(3))/6,u=(l+c)*h,d=l-u,f=c-u,g=e-d,v=t-f;let m,p;g>v?(m=1,p=0):(m=0,p=1);const _=g-m+h,x=v-p+h,M=g-1+2*h,y=v-1+2*h,b=l&255,T=c&255,L=this.perm[b+this.perm[T]]%12,S=this.perm[b+m+this.perm[T+p]]%12,E=this.perm[b+1+this.perm[T+1]]%12;let C=.5-g*g-v*v;C<0?n=0:(C*=C,n=C*C*this.dot(this.grad3[L],g,v));let U=.5-_*_-x*x;U<0?i=0:(U*=U,i=U*U*this.dot(this.grad3[S],_,x));let z=.5-M*M-y*y;return z<0?r=0:(z*=z,r=z*z*this.dot(this.grad3[E],M,y)),70*(n+i+r)}noise3d(e,t,n){let i,r,o,a;const c=(e+t+n)*.3333333333333333,h=Math.floor(e+c),u=Math.floor(t+c),d=Math.floor(n+c),f=1/6,g=(h+u+d)*f,v=h-g,m=u-g,p=d-g,_=e-v,x=t-m,M=n-p;let y,b,T,L,S,E;_>=x?x>=M?(y=1,b=0,T=0,L=1,S=1,E=0):_>=M?(y=1,b=0,T=0,L=1,S=0,E=1):(y=0,b=0,T=1,L=1,S=0,E=1):x<M?(y=0,b=0,T=1,L=0,S=1,E=1):_<M?(y=0,b=1,T=0,L=0,S=1,E=1):(y=0,b=1,T=0,L=1,S=1,E=0);const C=_-y+f,U=x-b+f,z=M-T+f,D=_-L+2*f,N=x-S+2*f,H=M-E+2*f,Z=_-1+3*f,B=x-1+3*f,X=M-1+3*f,$=h&255,te=u&255,Q=d&255,V=this.perm[$+this.perm[te+this.perm[Q]]]%12,J=this.perm[$+y+this.perm[te+b+this.perm[Q+T]]]%12,ce=this.perm[$+L+this.perm[te+S+this.perm[Q+E]]]%12,ve=this.perm[$+1+this.perm[te+1+this.perm[Q+1]]]%12;let fe=.6-_*_-x*x-M*M;fe<0?i=0:(fe*=fe,i=fe*fe*this.dot3(this.grad3[V],_,x,M));let Se=.6-C*C-U*U-z*z;Se<0?r=0:(Se*=Se,r=Se*Se*this.dot3(this.grad3[J],C,U,z));let Pe=.6-D*D-N*N-H*H;Pe<0?o=0:(Pe*=Pe,o=Pe*Pe*this.dot3(this.grad3[ce],D,N,H));let Ee=.6-Z*Z-B*B-X*X;return Ee<0?a=0:(Ee*=Ee,a=Ee*Ee*this.dot3(this.grad3[ve],Z,B,X)),32*(i+r+o+a)}noise4d(e,t,n,i){const r=this.grad4,o=this.simplex,a=this.perm,l=(Math.sqrt(5)-1)/4,c=(5-Math.sqrt(5))/20;let h,u,d,f,g;const v=(e+t+n+i)*l,m=Math.floor(e+v),p=Math.floor(t+v),_=Math.floor(n+v),x=Math.floor(i+v),M=(m+p+_+x)*c,y=m-M,b=p-M,T=_-M,L=x-M,S=e-y,E=t-b,C=n-T,U=i-L,z=S>E?32:0,D=S>C?16:0,N=E>C?8:0,H=S>U?4:0,Z=E>U?2:0,B=C>U?1:0,X=z+D+N+H+Z+B,$=o[X][0]>=3?1:0,te=o[X][1]>=3?1:0,Q=o[X][2]>=3?1:0,V=o[X][3]>=3?1:0,J=o[X][0]>=2?1:0,ce=o[X][1]>=2?1:0,ve=o[X][2]>=2?1:0,fe=o[X][3]>=2?1:0,Se=o[X][0]>=1?1:0,Pe=o[X][1]>=1?1:0,Ee=o[X][2]>=1?1:0,We=o[X][3]>=1?1:0,W=S-$+c,_t=E-te+c,Ae=C-Q+c,De=U-V+c,Me=S-J+2*c,st=E-ce+2*c,Oe=C-ve+2*c,R=U-fe+2*c,w=S-Se+3*c,G=E-Pe+3*c,re=C-Ee+3*c,se=U-We+3*c,oe=S-1+4*c,we=E-1+4*c,de=C-1+4*c,xe=U-1+4*c,Re=m&255,He=p&255,ne=_&255,et=x&255,je=a[Re+a[He+a[ne+a[et]]]]%32,ke=a[Re+$+a[He+te+a[ne+Q+a[et+V]]]]%32,Ce=a[Re+J+a[He+ce+a[ne+ve+a[et+fe]]]]%32,ge=a[Re+Se+a[He+Pe+a[ne+Ee+a[et+We]]]]%32,F=a[Re+1+a[He+1+a[ne+1+a[et+1]]]]%32;let ae=.6-S*S-E*E-C*C-U*U;ae<0?h=0:(ae*=ae,h=ae*ae*this.dot4(r[je],S,E,C,U));let be=.6-W*W-_t*_t-Ae*Ae-De*De;be<0?u=0:(be*=be,u=be*be*this.dot4(r[ke],W,_t,Ae,De));let me=.6-Me*Me-st*st-Oe*Oe-R*R;me<0?d=0:(me*=me,d=me*me*this.dot4(r[Ce],Me,st,Oe,R));let ie=.6-w*w-G*G-re*re-se*se;ie<0?f=0:(ie*=ie,f=ie*ie*this.dot4(r[ge],w,G,re,se));let O=.6-oe*oe-we*we-de*de-xe*xe;return O<0?g=0:(O*=O,g=O*O*this.dot4(r[F],oe,we,de,xe)),27*(h+u+d+f+g)}}const Wr={defines:{PERSPECTIVE_CAMERA:1,KERNEL_SIZE:32},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},kernel:{value:null},cameraNear:{value:null},cameraFar:{value:null},resolution:{value:new _e},cameraProjectionMatrix:{value:new Le},cameraInverseProjectionMatrix:{value:new Le},kernelRadius:{value:8},minDistance:{value:.005},maxDistance:{value:.05}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`
		uniform highp sampler2D tNormal;
		uniform highp sampler2D tDepth;
		uniform sampler2D tNoise;

		uniform vec3 kernel[ KERNEL_SIZE ];

		uniform vec2 resolution;

		uniform float cameraNear;
		uniform float cameraFar;
		uniform mat4 cameraProjectionMatrix;
		uniform mat4 cameraInverseProjectionMatrix;

		uniform float kernelRadius;
		uniform float minDistance; // avoid artifacts caused by neighbour fragments with minimal depth difference
		uniform float maxDistance; // avoid the influence of fragments which are too far away

		varying vec2 vUv;

		#include <packing>

		float getDepth( const in vec2 screenPosition ) {

			return texture2D( tDepth, screenPosition ).x;

		}

		float getLinearDepth( const in vec2 screenPosition ) {

			#if PERSPECTIVE_CAMERA == 1

				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );

			#else

				return texture2D( tDepth, screenPosition ).x;

			#endif

		}

		float getViewZ( const in float depth ) {

			#if PERSPECTIVE_CAMERA == 1

				return perspectiveDepthToViewZ( depth, cameraNear, cameraFar );

			#else

				return orthographicDepthToViewZ( depth, cameraNear, cameraFar );

			#endif

		}

		vec3 getViewPosition( const in vec2 screenPosition, const in float depth, const in float viewZ ) {

			float clipW = cameraProjectionMatrix[2][3] * viewZ + cameraProjectionMatrix[3][3];

			vec4 clipPosition = vec4( ( vec3( screenPosition, depth ) - 0.5 ) * 2.0, 1.0 );

			clipPosition *= clipW; // unprojection.

			return ( cameraInverseProjectionMatrix * clipPosition ).xyz;

		}

		vec3 getViewNormal( const in vec2 screenPosition ) {

			return unpackRGBToNormal( texture2D( tNormal, screenPosition ).xyz );

		}

		void main() {

			float depth = getDepth( vUv );

			if ( depth == 1.0 ) {

				gl_FragColor = vec4( 1.0 ); // don't influence background
				
			} else {

				float viewZ = getViewZ( depth );

				vec3 viewPosition = getViewPosition( vUv, depth, viewZ );
				vec3 viewNormal = getViewNormal( vUv );

				vec2 noiseScale = vec2( resolution.x / 4.0, resolution.y / 4.0 );
				vec3 random = vec3( texture2D( tNoise, vUv * noiseScale ).r );

				// compute matrix used to reorient a kernel vector

				vec3 tangent = normalize( random - viewNormal * dot( random, viewNormal ) );
				vec3 bitangent = cross( viewNormal, tangent );
				mat3 kernelMatrix = mat3( tangent, bitangent, viewNormal );

				float occlusion = 0.0;

				for ( int i = 0; i < KERNEL_SIZE; i ++ ) {

					vec3 sampleVector = kernelMatrix * kernel[ i ]; // reorient sample vector in view space
					vec3 samplePoint = viewPosition + ( sampleVector * kernelRadius ); // calculate sample point

					vec4 samplePointNDC = cameraProjectionMatrix * vec4( samplePoint, 1.0 ); // project point and calculate NDC
					samplePointNDC /= samplePointNDC.w;

					vec2 samplePointUv = samplePointNDC.xy * 0.5 + 0.5; // compute uv coordinates

					float realDepth = getLinearDepth( samplePointUv ); // get linear depth from depth texture
					float sampleDepth = viewZToOrthographicDepth( samplePoint.z, cameraNear, cameraFar ); // compute linear depth of the sample view Z value
					float delta = sampleDepth - realDepth;

					if ( delta > minDistance && delta < maxDistance ) { // if fragment is before sample point, increase occlusion

						occlusion += 1.0;

					}

				}

				occlusion = clamp( occlusion / float( KERNEL_SIZE ), 0.0, 1.0 );

				gl_FragColor = vec4( vec3( 1.0 - occlusion ), 1.0 );

			}

		}`},Xr={defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`uniform sampler2D tDepth;

		uniform float cameraNear;
		uniform float cameraFar;

		varying vec2 vUv;

		#include <packing>

		float getLinearDepth( const in vec2 screenPosition ) {

			#if PERSPECTIVE_CAMERA == 1

				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );

			#else

				return texture2D( tDepth, screenPosition ).x;

			#endif

		}

		void main() {

			float depth = getLinearDepth( vUv );
			gl_FragColor = vec4( vec3( 1.0 - depth ), 1.0 );

		}`},Yr={uniforms:{tDiffuse:{value:null},resolution:{value:new _e}},vertexShader:`varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`uniform sampler2D tDiffuse;

		uniform vec2 resolution;

		varying vec2 vUv;

		void main() {

			vec2 texelSize = ( 1.0 / resolution );
			float result = 0.0;

			for ( int i = - 2; i <= 2; i ++ ) {

				for ( int j = - 2; j <= 2; j ++ ) {

					vec2 offset = ( vec2( float( i ), float( j ) ) ) * texelSize;
					result += texture2D( tDiffuse, vUv + offset ).r;

				}

			}

			gl_FragColor = vec4( vec3( result / ( 5.0 * 5.0 ) ), 1.0 );

		}`};class ii extends gi{constructor(e,t,n,i,r=32){super(),this.width=n!==void 0?n:512,this.height=i!==void 0?i:512,this.clear=!0,this.camera=t,this.scene=e,this.kernelRadius=8,this.kernel=[],this.noiseTexture=null,this.output=0,this.minDistance=.005,this.maxDistance=.1,this._visibilityCache=new Map,this.generateSampleKernel(r),this.generateRandomKernelRotations();const o=new qa;o.format=Ui,o.type=ui,this.normalRenderTarget=new ln(this.width,this.height,{minFilter:Lt,magFilter:Lt,type:wn,depthTexture:o}),this.ssaoRenderTarget=new ln(this.width,this.height,{type:wn}),this.blurRenderTarget=this.ssaoRenderTarget.clone(),this.ssaoMaterial=new It({defines:Object.assign({},Wr.defines),uniforms:Un.clone(Wr.uniforms),vertexShader:Wr.vertexShader,fragmentShader:Wr.fragmentShader,blending:Wt}),this.ssaoMaterial.defines.KERNEL_SIZE=r,this.ssaoMaterial.uniforms.tNormal.value=this.normalRenderTarget.texture,this.ssaoMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture,this.ssaoMaterial.uniforms.tNoise.value=this.noiseTexture,this.ssaoMaterial.uniforms.kernel.value=this.kernel,this.ssaoMaterial.uniforms.cameraNear.value=this.camera.near,this.ssaoMaterial.uniforms.cameraFar.value=this.camera.far,this.ssaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.ssaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.ssaoMaterial.uniforms.cameraInverseProjectionMatrix.value.copy(this.camera.projectionMatrixInverse),this.normalMaterial=new x_,this.normalMaterial.blending=Wt,this.blurMaterial=new It({defines:Object.assign({},Yr.defines),uniforms:Un.clone(Yr.uniforms),vertexShader:Yr.vertexShader,fragmentShader:Yr.fragmentShader}),this.blurMaterial.uniforms.tDiffuse.value=this.ssaoRenderTarget.texture,this.blurMaterial.uniforms.resolution.value.set(this.width,this.height),this.depthRenderMaterial=new It({defines:Object.assign({},Xr.defines),uniforms:Un.clone(Xr.uniforms),vertexShader:Xr.vertexShader,fragmentShader:Xr.fragmentShader,blending:Wt}),this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture,this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new It({uniforms:Un.clone(Gs.uniforms),vertexShader:Gs.vertexShader,fragmentShader:Gs.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:vu,blendDst:xa,blendEquation:Xn,blendSrcAlpha:gu,blendDstAlpha:xa,blendEquationAlpha:Xn}),this.fsQuad=new ir(null),this.originalClearColor=new Ne}dispose(){this.normalRenderTarget.dispose(),this.ssaoRenderTarget.dispose(),this.blurRenderTarget.dispose(),this.normalMaterial.dispose(),this.blurMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this.fsQuad.dispose()}render(e,t,n){switch(e.capabilities.isWebGL2===!1&&(this.noiseTexture.format=wu),this.overrideVisibility(),this.renderOverride(e,this.normalMaterial,this.normalRenderTarget,7829503,1),this.restoreVisibility(),this.ssaoMaterial.uniforms.kernelRadius.value=this.kernelRadius,this.ssaoMaterial.uniforms.minDistance.value=this.minDistance,this.ssaoMaterial.uniforms.maxDistance.value=this.maxDistance,this.renderPass(e,this.ssaoMaterial,this.ssaoRenderTarget),this.renderPass(e,this.blurMaterial,this.blurRenderTarget),this.output){case ii.OUTPUT.SSAO:this.copyMaterial.uniforms.tDiffuse.value=this.ssaoRenderTarget.texture,this.copyMaterial.blending=Wt,this.renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case ii.OUTPUT.Blur:this.copyMaterial.uniforms.tDiffuse.value=this.blurRenderTarget.texture,this.copyMaterial.blending=Wt,this.renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case ii.OUTPUT.Depth:this.renderPass(e,this.depthRenderMaterial,this.renderToScreen?null:t);break;case ii.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=Wt,this.renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case ii.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=n.texture,this.copyMaterial.blending=Wt,this.renderPass(e,this.copyMaterial,this.renderToScreen?null:t),this.copyMaterial.uniforms.tDiffuse.value=this.blurRenderTarget.texture,this.copyMaterial.blending=mu,this.renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;default:console.warn("THREE.SSAOPass: Unknown output type.")}}renderPass(e,t,n,i,r){e.getClearColor(this.originalClearColor);const o=e.getClearAlpha(),a=e.autoClear;e.setRenderTarget(n),e.autoClear=!1,i!=null&&(e.setClearColor(i),e.setClearAlpha(r||0),e.clear()),this.fsQuad.material=t,this.fsQuad.render(e),e.autoClear=a,e.setClearColor(this.originalClearColor),e.setClearAlpha(o)}renderOverride(e,t,n,i,r){e.getClearColor(this.originalClearColor);const o=e.getClearAlpha(),a=e.autoClear;e.setRenderTarget(n),e.autoClear=!1,i=t.clearColor||i,r=t.clearAlpha||r,i!=null&&(e.setClearColor(i),e.setClearAlpha(r||0),e.clear()),this.scene.overrideMaterial=t,e.render(this.scene,this.camera),this.scene.overrideMaterial=null,e.autoClear=a,e.setClearColor(this.originalClearColor),e.setClearAlpha(o)}setSize(e,t){this.width=e,this.height=t,this.ssaoRenderTarget.setSize(e,t),this.normalRenderTarget.setSize(e,t),this.blurRenderTarget.setSize(e,t),this.ssaoMaterial.uniforms.resolution.value.set(e,t),this.ssaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.ssaoMaterial.uniforms.cameraInverseProjectionMatrix.value.copy(this.camera.projectionMatrixInverse),this.blurMaterial.uniforms.resolution.value.set(e,t)}generateSampleKernel(e){const t=this.kernel;for(let n=0;n<e;n++){const i=new I;i.x=Math.random()*2-1,i.y=Math.random()*2-1,i.z=Math.random(),i.normalize();let r=n/e;r=zt.lerp(.1,1,r*r),i.multiplyScalar(r),t.push(i)}}generateRandomKernelRotations(){const n=new px,i=4*4,r=new Float32Array(i);for(let o=0;o<i;o++){const a=Math.random()*2-1,l=Math.random()*2-1,c=0;r[o]=n.noise3d(a,l,c)}this.noiseTexture=new Ku(r,4,4,Au,Dn),this.noiseTexture.wrapS=Di,this.noiseTexture.wrapT=Di,this.noiseTexture.needsUpdate=!0}overrideVisibility(){const e=this.scene,t=this._visibilityCache;e.traverse(function(n){t.set(n,n.visible),(n.isPoints||n.isLine)&&(n.visible=!1)})}restoreVisibility(){const e=this.scene,t=this._visibilityCache;e.traverse(function(n){const i=t.get(n);n.visible=i}),t.clear()}}ii.OUTPUT={Default:0,SSAO:1,Blur:2,Depth:3,Normal:4};const mx={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Ne(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			vec3 luma = vec3( 0.299, 0.587, 0.114 );

			float v = dot( texel.xyz, luma );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class Es extends gi{constructor(e,t,n,i){super(),this.strength=t!==void 0?t:1,this.radius=n,this.threshold=i,this.resolution=e!==void 0?new _e(e.x,e.y):new _e(256,256),this.clearColor=new Ne(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new ln(r,o,{type:wn}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let u=0;u<this.nMips;u++){const d=new ln(r,o,{type:wn});d.texture.name="UnrealBloomPass.h"+u,d.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(d);const f=new ln(r,o,{type:wn});f.texture.name="UnrealBloomPass.v"+u,f.texture.generateMipmaps=!1,this.renderTargetsVertical.push(f),r=Math.round(r/2),o=Math.round(o/2)}const a=mx;this.highPassUniforms=Un.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=i,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new It({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];const l=[3,5,7,9,11];r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let u=0;u<this.nMips;u++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(l[u])),this.separableBlurMaterials[u].uniforms.invSize.value=new _e(1/r,1/o),r=Math.round(r/2),o=Math.round(o/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new I(1,1,1),new I(1,1,1),new I(1,1,1),new I(1,1,1),new I(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const h=Gs;this.copyUniforms=Un.clone(h.uniforms),this.blendMaterial=new It({uniforms:this.copyUniforms,vertexShader:h.vertexShader,fragmentShader:h.fragmentShader,blending:_a,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new Ne,this.oldClearAlpha=1,this.basic=new In,this.fsQuad=new ir(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),i=Math.round(t/2);this.renderTargetBright.setSize(n,i);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,i),this.renderTargetsVertical[r].setSize(n,i),this.separableBlurMaterials[r].uniforms.invSize.value=new _e(1/n,1/i),n=Math.round(n/2),i=Math.round(i/2)}render(e,t,n,i,r){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=n.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let a=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this.fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[l].uniforms.direction.value=Es.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=Es.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this.fsQuad.render(e),a=this.renderTargetsVertical[l];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(n),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=o}getSeperableBlurMaterial(e){const t=[];for(let n=0;n<e;n++)t.push(.39894*Math.exp(-.5*n*n/(e*e))/e);return new It({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new _e(.5,.5)},direction:{value:new _e(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(e){return new It({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}Es.BlurDirectionX=new _e(1,0);Es.BlurDirectionY=new _e(0,1);const gx={name:"FilmShader",uniforms:{tDiffuse:{value:null},time:{value:0},intensity:{value:.5},grayscale:{value:!1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		#include <common>

		uniform float intensity;
		uniform bool grayscale;
		uniform float time;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 base = texture2D( tDiffuse, vUv );

			float noise = rand( fract( vUv + time ) );

			vec3 color = base.rgb + base.rgb * clamp( 0.1 + noise, 0.0, 1.0 );

			color = mix( base.rgb, color, intensity );

			if ( grayscale ) {

				color = vec3( luminance( color ) ); // assuming linear-srgb

			}

			gl_FragColor = vec4( color, base.a );

		}`};class vx extends gi{constructor(e=.5,t=!1){super();const n=gx;this.uniforms=Un.clone(n.uniforms),this.material=new It({name:n.name,uniforms:this.uniforms,vertexShader:n.vertexShader,fragmentShader:n.fragmentShader}),this.uniforms.intensity.value=e,this.uniforms.grayscale.value=t,this.fsQuad=new ir(this.material)}render(e,t,n,i){this.uniforms.tDiffuse.value=n.texture,this.uniforms.time.value+=i,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const _x={name:"FXAAShader",uniforms:{tDiffuse:{value:null},resolution:{value:new _e(1/1024,1/512)}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`
		precision highp float;

		uniform sampler2D tDiffuse;

		uniform vec2 resolution;

		varying vec2 vUv;

		// FXAA 3.11 implementation by NVIDIA, ported to WebGL by Agost Biro (biro@archilogic.com)

		//----------------------------------------------------------------------------------
		// File:        es3-keplerFXAAassetsshaders/FXAA_DefaultES.frag
		// SDK Version: v3.00
		// Email:       gameworks@nvidia.com
		// Site:        http://developer.nvidia.com/
		//
		// Copyright (c) 2014-2015, NVIDIA CORPORATION. All rights reserved.
		//
		// Redistribution and use in source and binary forms, with or without
		// modification, are permitted provided that the following conditions
		// are met:
		//  * Redistributions of source code must retain the above copyright
		//    notice, this list of conditions and the following disclaimer.
		//  * Redistributions in binary form must reproduce the above copyright
		//    notice, this list of conditions and the following disclaimer in the
		//    documentation and/or other materials provided with the distribution.
		//  * Neither the name of NVIDIA CORPORATION nor the names of its
		//    contributors may be used to endorse or promote products derived
		//    from this software without specific prior written permission.
		//
		// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS ''AS IS'' AND ANY
		// EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
		// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
		// PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
		// CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
		// EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
		// PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
		// PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
		// OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
		// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
		// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
		//
		//----------------------------------------------------------------------------------

		#ifndef FXAA_DISCARD
			//
			// Only valid for PC OpenGL currently.
			// Probably will not work when FXAA_GREEN_AS_LUMA = 1.
			//
			// 1 = Use discard on pixels which don't need AA.
			//     For APIs which enable concurrent TEX+ROP from same surface.
			// 0 = Return unchanged color on pixels which don't need AA.
			//
			#define FXAA_DISCARD 0
		#endif

		/*--------------------------------------------------------------------------*/
		#define FxaaTexTop(t, p) texture2D(t, p, -100.0)
		#define FxaaTexOff(t, p, o, r) texture2D(t, p + (o * r), -100.0)
		/*--------------------------------------------------------------------------*/

		#define NUM_SAMPLES 5

		// assumes colors have premultipliedAlpha, so that the calculated color contrast is scaled by alpha
		float contrast( vec4 a, vec4 b ) {
			vec4 diff = abs( a - b );
			return max( max( max( diff.r, diff.g ), diff.b ), diff.a );
		}

		/*============================================================================

									FXAA3 QUALITY - PC

		============================================================================*/

		/*--------------------------------------------------------------------------*/
		vec4 FxaaPixelShader(
			vec2 posM,
			sampler2D tex,
			vec2 fxaaQualityRcpFrame,
			float fxaaQualityEdgeThreshold,
			float fxaaQualityinvEdgeThreshold
		) {
			vec4 rgbaM = FxaaTexTop(tex, posM);
			vec4 rgbaS = FxaaTexOff(tex, posM, vec2( 0.0, 1.0), fxaaQualityRcpFrame.xy);
			vec4 rgbaE = FxaaTexOff(tex, posM, vec2( 1.0, 0.0), fxaaQualityRcpFrame.xy);
			vec4 rgbaN = FxaaTexOff(tex, posM, vec2( 0.0,-1.0), fxaaQualityRcpFrame.xy);
			vec4 rgbaW = FxaaTexOff(tex, posM, vec2(-1.0, 0.0), fxaaQualityRcpFrame.xy);
			// . S .
			// W M E
			// . N .

			bool earlyExit = max( max( max(
					contrast( rgbaM, rgbaN ),
					contrast( rgbaM, rgbaS ) ),
					contrast( rgbaM, rgbaE ) ),
					contrast( rgbaM, rgbaW ) )
					< fxaaQualityEdgeThreshold;
			// . 0 .
			// 0 0 0
			// . 0 .

			#if (FXAA_DISCARD == 1)
				if(earlyExit) FxaaDiscard;
			#else
				if(earlyExit) return rgbaM;
			#endif

			float contrastN = contrast( rgbaM, rgbaN );
			float contrastS = contrast( rgbaM, rgbaS );
			float contrastE = contrast( rgbaM, rgbaE );
			float contrastW = contrast( rgbaM, rgbaW );

			float relativeVContrast = ( contrastN + contrastS ) - ( contrastE + contrastW );
			relativeVContrast *= fxaaQualityinvEdgeThreshold;

			bool horzSpan = relativeVContrast > 0.;
			// . 1 .
			// 0 0 0
			// . 1 .

			// 45 deg edge detection and corners of objects, aka V/H contrast is too similar
			if( abs( relativeVContrast ) < .3 ) {
				// locate the edge
				vec2 dirToEdge;
				dirToEdge.x = contrastE > contrastW ? 1. : -1.;
				dirToEdge.y = contrastS > contrastN ? 1. : -1.;
				// . 2 .      . 1 .
				// 1 0 2  ~=  0 0 1
				// . 1 .      . 0 .

				// tap 2 pixels and see which ones are "outside" the edge, to
				// determine if the edge is vertical or horizontal

				vec4 rgbaAlongH = FxaaTexOff(tex, posM, vec2( dirToEdge.x, -dirToEdge.y ), fxaaQualityRcpFrame.xy);
				float matchAlongH = contrast( rgbaM, rgbaAlongH );
				// . 1 .
				// 0 0 1
				// . 0 H

				vec4 rgbaAlongV = FxaaTexOff(tex, posM, vec2( -dirToEdge.x, dirToEdge.y ), fxaaQualityRcpFrame.xy);
				float matchAlongV = contrast( rgbaM, rgbaAlongV );
				// V 1 .
				// 0 0 1
				// . 0 .

				relativeVContrast = matchAlongV - matchAlongH;
				relativeVContrast *= fxaaQualityinvEdgeThreshold;

				if( abs( relativeVContrast ) < .3 ) { // 45 deg edge
					// 1 1 .
					// 0 0 1
					// . 0 1

					// do a simple blur
					return mix(
						rgbaM,
						(rgbaN + rgbaS + rgbaE + rgbaW) * .25,
						.4
					);
				}

				horzSpan = relativeVContrast > 0.;
			}

			if(!horzSpan) rgbaN = rgbaW;
			if(!horzSpan) rgbaS = rgbaE;
			// . 0 .      1
			// 1 0 1  ->  0
			// . 0 .      1

			bool pairN = contrast( rgbaM, rgbaN ) > contrast( rgbaM, rgbaS );
			if(!pairN) rgbaN = rgbaS;

			vec2 offNP;
			offNP.x = (!horzSpan) ? 0.0 : fxaaQualityRcpFrame.x;
			offNP.y = ( horzSpan) ? 0.0 : fxaaQualityRcpFrame.y;

			bool doneN = false;
			bool doneP = false;

			float nDist = 0.;
			float pDist = 0.;

			vec2 posN = posM;
			vec2 posP = posM;

			int iterationsUsed = 0;
			int iterationsUsedN = 0;
			int iterationsUsedP = 0;
			for( int i = 0; i < NUM_SAMPLES; i++ ) {
				iterationsUsed = i;

				float increment = float(i + 1);

				if(!doneN) {
					nDist += increment;
					posN = posM + offNP * nDist;
					vec4 rgbaEndN = FxaaTexTop(tex, posN.xy);
					doneN = contrast( rgbaEndN, rgbaM ) > contrast( rgbaEndN, rgbaN );
					iterationsUsedN = i;
				}

				if(!doneP) {
					pDist += increment;
					posP = posM - offNP * pDist;
					vec4 rgbaEndP = FxaaTexTop(tex, posP.xy);
					doneP = contrast( rgbaEndP, rgbaM ) > contrast( rgbaEndP, rgbaN );
					iterationsUsedP = i;
				}

				if(doneN || doneP) break;
			}


			if ( !doneP && !doneN ) return rgbaM; // failed to find end of edge

			float dist = min(
				doneN ? float( iterationsUsedN ) / float( NUM_SAMPLES - 1 ) : 1.,
				doneP ? float( iterationsUsedP ) / float( NUM_SAMPLES - 1 ) : 1.
			);

			// hacky way of reduces blurriness of mostly diagonal edges
			// but reduces AA quality
			dist = pow(dist, .5);

			dist = 1. - dist;

			return mix(
				rgbaM,
				rgbaN,
				dist * .5
			);
		}

		void main() {
			const float edgeDetectionQuality = .2;
			const float invEdgeDetectionQuality = 1. / edgeDetectionQuality;

			gl_FragColor = FxaaPixelShader(
				vUv,
				tDiffuse,
				resolution,
				edgeDetectionQuality, // [0,1] contrast needed, otherwise early discard
				invEdgeDetectionQuality
			);

		}
	`};class xx{constructor(e,t,n){this.renderer=e,this.scene=t,this.camera=n;const i=e.getSize(new _e),r=e.getPixelRatio(),o=i.width,a=i.height,l=Math.max(256,Math.floor(o*r*.5)),c=Math.max(256,Math.floor(a*r*.5));this.composer=new hx(e),this.composer.addPass(new ux(t,n)),this.ssaoPass=new ii(t,n,l,c,32),this.ssaoPass.kernelRadius=8,this.ssaoPass.minDistance=.005,this.ssaoPass.maxDistance=.1,this.ssaoPass.enabled=!1,this.composer.addPass(this.ssaoPass);const h=new _e(o*r,a*r);this.bloomPass=new Es(h,1,.4,.85),this.bloomPass.enabled=!1,this.composer.addPass(this.bloomPass),this.fxaaPass=new sd(_x),this.fxaaPass.material.uniforms.resolution.value.set(1/(o*r),1/(a*r)),this.fxaaPass.enabled=!1,this.composer.addPass(this.fxaaPass),this.filmPass=new vx(.5,!1),this.filmPass.enabled=!1,this.composer.addPass(this.filmPass),this.composer.addPass(new fx),this._originalToneMapping=e.toneMapping,this._originalToneMappingExposure=e.toneMappingExposure}setEnabled(e){this._enabled=!!e,e?(this.renderer.toneMapping=Ha,this.renderer.toneMappingExposure=1):(this.renderer.toneMapping=this._originalToneMapping,this.renderer.toneMappingExposure=this._originalToneMappingExposure)}isEnabled(){return!!this._enabled}render(e){return this._enabled?(this.composer.render(e),!0):!1}setSize(e,t){const n=this.renderer.getPixelRatio();this.composer.setSize(e,t),this.composer.setPixelRatio(n);const i=Math.max(256,Math.floor(e*n*.5)),r=Math.max(256,Math.floor(t*n*.5));this.ssaoPass.setSize(i,r),this.bloomPass.resolution.set(e*n,t*n),this.fxaaPass.material.uniforms.resolution.value.set(1/(e*n),1/(t*n))}setBloom(e){this.bloomPass.enabled=!!e}setBloomStrength(e){this.bloomPass.strength=e}setBloomRadius(e){this.bloomPass.radius=e}setBloomThreshold(e){this.bloomPass.threshold=e}setFXAA(e){this.fxaaPass.enabled=!!e}setFilm(e){this.filmPass.enabled=!!e}setFilmIntensity(e){this.filmPass.uniforms.intensity.value=e}setFilmGrayscale(e){this.filmPass.uniforms.grayscale.value=!!e}setSSAO(e){this.ssaoPass.enabled=!!e}setSSAOKernelRadius(e){this.ssaoPass.kernelRadius=e}setSSAOMinDistance(e){this.ssaoPass.minDistance=e}setSSAOMaxDistance(e){this.ssaoPass.maxDistance=e}setToneMappingExposure(e){this.renderer.toneMappingExposure=e}dispose(){this.composer.dispose()}}const rd={tavern:{id:"tavern",width:2,height:1,name:"Tavern",color:14251782},shipwright:{id:"shipwright",width:2,height:1,name:"Shipwright",color:6583435},market:{id:"market",width:2,height:1,name:"Market",color:1483594},lighthouse:{id:"lighthouse",width:1,height:1,name:"Lighthouse",color:16498468},warehouse:{id:"warehouse",width:2,height:2,name:"Warehouse",color:7893356},fort:{id:"fort",width:3,height:2,name:"Fort",color:7041664},docks:{id:"docks",width:3,height:1,name:"Docks",color:959977,allowOverWater:!0},dragon_sanctuary:{id:"dragon_sanctuary",width:3,height:3,name:"Dragon Sanctuary",color:8141549},castle:{id:"castle",width:3,height:3,name:"Castle",color:3621201,description:"Store cargo, gold/pieces-of-eight for crew wages, receive tax from buildings and player trading"},blacksmith:{id:"blacksmith",width:2,height:1,name:"Blacksmith",color:11817737,description:"Craft and sell cannons, cannonballs, and swords"}};function an(s){return rd[s]??null}function la(s){const e=an(s);return!!(e&&e.allowOverWater)}let cs={};function od(s,e,t){e!=null||t!=null?(cs[s]=cs[s]||{},e!=null&&(cs[s].width=Math.max(1,Math.min(5,e))),t!=null&&(cs[s].height=Math.max(1,Math.min(5,t)))):delete cs[s]}function oi(s){const e=an(s),t=e?{width:e.width,height:e.height}:{width:1,height:1},n=cs[s];return n?{width:n.width??t.width,height:n.height??t.height}:t}function Pn(s){return s&&s.width!=null&&s.height!=null?{width:s.width,height:s.height}:oi((s==null?void 0:s.type)??"")}const ad={berry_bush_01:{id:"berry_bush_01",name:"Berry Bush",color:2278750,fbxPath:"/props/BerryBush_01/BerryBush_01.fbx",placeholderShape:"sphere"},oak_tree_01:{id:"oak_tree_01",name:"Oak Tree",color:1409085,fbxPath:"/props/OakTree_01/OakTree_01.fbx",placeholderShape:"cone",defaultScale:8},palm_tree_01:{id:"palm_tree_01",name:"Palm Tree 1",color:1483594,fbxPath:"/props/PalmTree_01/PalmTree_01.fbx",placeholderShape:"cylinder",defaultScale:8},palm_tree_02:{id:"palm_tree_02",name:"Palm Tree 2",color:1409085,fbxPath:"/props/PalmTree_02/PalmTree_02.fbx",placeholderShape:"cylinder",defaultScale:8},rock_01:{id:"rock_01",name:"Rock",color:7041664,fbxPath:"/props/Rock_01/Rock_01.fbx",placeholderShape:"sphere"},rock_06:{id:"rock_06",name:"Brimstone Rock",color:8330525,fbxPath:"/props/Rock_06/Rock_06.fbx",placeholderShape:"sphere"},sign:{id:"sign",name:"Sign",color:7893356,placeholderShape:"signpost"}};function En(s){return ad[s]??null}/*!
fflate - fast JavaScript compression/decompression
<https://101arrowz.github.io/fflate>
Licensed under MIT. https://github.com/101arrowz/fflate/blob/master/LICENSE
version 0.6.9
*/var Sh=function(s){return URL.createObjectURL(new Blob([s],{type:"text/javascript"}))};try{URL.revokeObjectURL(Sh(""))}catch{Sh=function(e){return"data:application/javascript;charset=UTF-8,"+encodeURI(e)}}var gn=Uint8Array,ai=Uint16Array,La=Uint32Array,ld=new gn([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),cd=new gn([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),Mx=new gn([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),hd=function(s,e){for(var t=new ai(31),n=0;n<31;++n)t[n]=e+=1<<s[n-1];for(var i=new La(t[30]),n=1;n<30;++n)for(var r=t[n];r<t[n+1];++r)i[r]=r-t[n]<<5|n;return[t,i]},ud=hd(ld,2),dd=ud[0],yx=ud[1];dd[28]=258,yx[258]=28;var Sx=hd(cd,0),Ex=Sx[0],Ia=new ai(32768);for(var pt=0;pt<32768;++pt){var ei=(pt&43690)>>>1|(pt&21845)<<1;ei=(ei&52428)>>>2|(ei&13107)<<2,ei=(ei&61680)>>>4|(ei&3855)<<4,Ia[pt]=((ei&65280)>>>8|(ei&255)<<8)>>>1}var Ws=function(s,e,t){for(var n=s.length,i=0,r=new ai(e);i<n;++i)++r[s[i]-1];var o=new ai(e);for(i=0;i<e;++i)o[i]=o[i-1]+r[i-1]<<1;var a;if(t){a=new ai(1<<e);var l=15-e;for(i=0;i<n;++i)if(s[i])for(var c=i<<4|s[i],h=e-s[i],u=o[s[i]-1]++<<h,d=u|(1<<h)-1;u<=d;++u)a[Ia[u]>>>l]=c}else for(a=new ai(n),i=0;i<n;++i)s[i]&&(a[i]=Ia[o[s[i]-1]++]>>>15-s[i]);return a},sr=new gn(288);for(var pt=0;pt<144;++pt)sr[pt]=8;for(var pt=144;pt<256;++pt)sr[pt]=9;for(var pt=256;pt<280;++pt)sr[pt]=7;for(var pt=280;pt<288;++pt)sr[pt]=8;var fd=new gn(32);for(var pt=0;pt<32;++pt)fd[pt]=5;var bx=Ws(sr,9,1),Tx=Ws(fd,5,1),ca=function(s){for(var e=s[0],t=1;t<s.length;++t)s[t]>e&&(e=s[t]);return e},Mn=function(s,e,t){var n=e/8|0;return(s[n]|s[n+1]<<8)>>(e&7)&t},ha=function(s,e){var t=e/8|0;return(s[t]|s[t+1]<<8|s[t+2]<<16)>>(e&7)},wx=function(s){return(s/8|0)+(s&7&&1)},Ax=function(s,e,t){(t==null||t>s.length)&&(t=s.length);var n=new(s instanceof ai?ai:s instanceof La?La:gn)(t-e);return n.set(s.subarray(e,t)),n},Px=function(s,e,t){var n=s.length;if(!n||t&&!t.l&&n<5)return e||new gn(0);var i=!e||t,r=!t||t.i;t||(t={}),e||(e=new gn(n*3));var o=function(ve){var fe=e.length;if(ve>fe){var Se=new gn(Math.max(fe*2,ve));Se.set(e),e=Se}},a=t.f||0,l=t.p||0,c=t.b||0,h=t.l,u=t.d,d=t.m,f=t.n,g=n*8;do{if(!h){t.f=a=Mn(s,l,1);var v=Mn(s,l+1,3);if(l+=3,v)if(v==1)h=bx,u=Tx,d=9,f=5;else if(v==2){var x=Mn(s,l,31)+257,M=Mn(s,l+10,15)+4,y=x+Mn(s,l+5,31)+1;l+=14;for(var b=new gn(y),T=new gn(19),L=0;L<M;++L)T[Mx[L]]=Mn(s,l+L*3,7);l+=M*3;for(var S=ca(T),E=(1<<S)-1,C=Ws(T,S,1),L=0;L<y;){var U=C[Mn(s,l,E)];l+=U&15;var m=U>>>4;if(m<16)b[L++]=m;else{var z=0,D=0;for(m==16?(D=3+Mn(s,l,3),l+=2,z=b[L-1]):m==17?(D=3+Mn(s,l,7),l+=3):m==18&&(D=11+Mn(s,l,127),l+=7);D--;)b[L++]=z}}var N=b.subarray(0,x),H=b.subarray(x);d=ca(N),f=ca(H),h=Ws(N,d,1),u=Ws(H,f,1)}else throw"invalid block type";else{var m=wx(l)+4,p=s[m-4]|s[m-3]<<8,_=m+p;if(_>n){if(r)throw"unexpected EOF";break}i&&o(c+p),e.set(s.subarray(m,_),c),t.b=c+=p,t.p=l=_*8;continue}if(l>g){if(r)throw"unexpected EOF";break}}i&&o(c+131072);for(var Z=(1<<d)-1,B=(1<<f)-1,X=l;;X=l){var z=h[ha(s,l)&Z],$=z>>>4;if(l+=z&15,l>g){if(r)throw"unexpected EOF";break}if(!z)throw"invalid length/literal";if($<256)e[c++]=$;else if($==256){X=l,h=null;break}else{var te=$-254;if($>264){var L=$-257,Q=ld[L];te=Mn(s,l,(1<<Q)-1)+dd[L],l+=Q}var V=u[ha(s,l)&B],J=V>>>4;if(!V)throw"invalid distance";l+=V&15;var H=Ex[J];if(J>3){var Q=cd[J];H+=ha(s,l)&(1<<Q)-1,l+=Q}if(l>g){if(r)throw"unexpected EOF";break}i&&o(c+131072);for(var ce=c+te;c<ce;c+=4)e[c]=e[c-H],e[c+1]=e[c+1-H],e[c+2]=e[c+2-H],e[c+3]=e[c+3-H];c=ce}}t.l=h,t.p=X,t.b=c,h&&(a=1,t.m=d,t.d=u,t.n=f)}while(!a);return c==e.length?e:Ax(e,0,c)},Rx=new gn(0),Cx=function(s){if((s[0]&15)!=8||s[0]>>>4>7||(s[0]<<8|s[1])%31)throw"invalid zlib data";if(s[1]&32)throw"invalid zlib data: preset dictionaries not supported"};function Lx(s,e){return Px((Cx(s),s.subarray(2,-4)),e)}var Ix=typeof TextDecoder<"u"&&new TextDecoder,Dx=0;try{Ix.decode(Rx,{stream:!0}),Dx=1}catch{}function pd(s,e,t){const n=t.length-s-1;if(e>=t[n])return n-1;if(e<=t[s])return s;let i=s,r=n,o=Math.floor((i+r)/2);for(;e<t[o]||e>=t[o+1];)e<t[o]?r=o:i=o,o=Math.floor((i+r)/2);return o}function Ux(s,e,t,n){const i=[],r=[],o=[];i[0]=1;for(let a=1;a<=t;++a){r[a]=e-n[s+1-a],o[a]=n[s+a]-e;let l=0;for(let c=0;c<a;++c){const h=o[c+1],u=r[a-c],d=i[c]/(h+u);i[c]=l+h*d,l=u*d}i[a]=l}return i}function Fx(s,e,t,n){const i=pd(s,n,e),r=Ux(i,n,s,e),o=new at(0,0,0,0);for(let a=0;a<=s;++a){const l=t[i-s+a],c=r[a],h=l.w*c;o.x+=l.x*h,o.y+=l.y*h,o.z+=l.z*h,o.w+=l.w*c}return o}function Nx(s,e,t,n,i){const r=[];for(let u=0;u<=t;++u)r[u]=0;const o=[];for(let u=0;u<=n;++u)o[u]=r.slice(0);const a=[];for(let u=0;u<=t;++u)a[u]=r.slice(0);a[0][0]=1;const l=r.slice(0),c=r.slice(0);for(let u=1;u<=t;++u){l[u]=e-i[s+1-u],c[u]=i[s+u]-e;let d=0;for(let f=0;f<u;++f){const g=c[f+1],v=l[u-f];a[u][f]=g+v;const m=a[f][u-1]/a[u][f];a[f][u]=d+g*m,d=v*m}a[u][u]=d}for(let u=0;u<=t;++u)o[0][u]=a[u][t];for(let u=0;u<=t;++u){let d=0,f=1;const g=[];for(let v=0;v<=t;++v)g[v]=r.slice(0);g[0][0]=1;for(let v=1;v<=n;++v){let m=0;const p=u-v,_=t-v;u>=v&&(g[f][0]=g[d][0]/a[_+1][p],m=g[f][0]*a[p][_]);const x=p>=-1?1:-p,M=u-1<=_?v-1:t-u;for(let b=x;b<=M;++b)g[f][b]=(g[d][b]-g[d][b-1])/a[_+1][p+b],m+=g[f][b]*a[p+b][_];u<=_&&(g[f][v]=-g[d][v-1]/a[_+1][u],m+=g[f][v]*a[u][_]),o[v][u]=m;const y=d;d=f,f=y}}let h=t;for(let u=1;u<=n;++u){for(let d=0;d<=t;++d)o[u][d]*=h;h*=t-u}return o}function Ox(s,e,t,n,i){const r=i<s?i:s,o=[],a=pd(s,n,e),l=Nx(a,n,s,r,e),c=[];for(let h=0;h<t.length;++h){const u=t[h].clone(),d=u.w;u.x*=d,u.y*=d,u.z*=d,c[h]=u}for(let h=0;h<=r;++h){const u=c[a-s].clone().multiplyScalar(l[h][0]);for(let d=1;d<=s;++d)u.add(c[a-s+d].clone().multiplyScalar(l[h][d]));o[h]=u}for(let h=r+1;h<=i+1;++h)o[h]=new at(0,0,0);return o}function Bx(s,e){let t=1;for(let i=2;i<=s;++i)t*=i;let n=1;for(let i=2;i<=e;++i)n*=i;for(let i=2;i<=s-e;++i)n*=i;return t/n}function zx(s){const e=s.length,t=[],n=[];for(let r=0;r<e;++r){const o=s[r];t[r]=new I(o.x,o.y,o.z),n[r]=o.w}const i=[];for(let r=0;r<e;++r){const o=t[r].clone();for(let a=1;a<=r;++a)o.sub(i[r-a].clone().multiplyScalar(Bx(r,a)*n[a]));i[r]=o.divideScalar(n[0])}return i}function Hx(s,e,t,n,i){const r=Ox(s,e,t,n,i);return zx(r)}class kx extends e_{constructor(e,t,n,i,r){super(),this.degree=e,this.knots=t,this.controlPoints=[],this.startKnot=i||0,this.endKnot=r||this.knots.length-1;for(let o=0;o<n.length;++o){const a=n[o];this.controlPoints[o]=new at(a.x,a.y,a.z,a.w)}}getPoint(e,t=new I){const n=t,i=this.knots[this.startKnot]+e*(this.knots[this.endKnot]-this.knots[this.startKnot]),r=Fx(this.degree,this.knots,this.controlPoints,i);return r.w!==1&&r.divideScalar(r.w),n.set(r.x,r.y,r.z)}getTangent(e,t=new I){const n=t,i=this.knots[0]+e*(this.knots[this.knots.length-1]-this.knots[0]),r=Hx(this.degree,this.knots,this.controlPoints,i,1);return n.copy(r[1]).normalize(),n}}let $e,At,Zt;class Vx extends Oi{constructor(e){super(e)}load(e,t,n,i){const r=this,o=r.path===""?z_.extractUrlBase(e):r.path,a=new I_(this.manager);a.setPath(r.path),a.setResponseType("arraybuffer"),a.setRequestHeader(r.requestHeader),a.setWithCredentials(r.withCredentials),a.load(e,function(l){try{t(r.parse(l,o))}catch(c){i?i(c):console.error(c),r.manager.itemError(e)}},n,i)}parse(e,t){if(qx(e))$e=new jx().parse(e);else{const i=_d(e);if(!Zx(i))throw new Error("THREE.FBXLoader: Unknown format.");if(bh(i)<7e3)throw new Error("THREE.FBXLoader: FBX version not supported, FileVersion: "+bh(i));$e=new Yx().parse(i)}const n=new U_(this.manager).setPath(this.resourcePath||t).setCrossOrigin(this.crossOrigin);return new Gx(n,this.manager).parse($e)}}class Gx{constructor(e,t){this.textureLoader=e,this.manager=t}parse(){At=this.parseConnections();const e=this.parseImages(),t=this.parseTextures(e),n=this.parseMaterials(t),i=this.parseDeformers(),r=new Wx().parse(i);return this.parseScene(i,r,n),Zt}parseConnections(){const e=new Map;return"Connections"in $e&&$e.Connections.connections.forEach(function(n){const i=n[0],r=n[1],o=n[2];e.has(i)||e.set(i,{parents:[],children:[]});const a={ID:r,relationship:o};e.get(i).parents.push(a),e.has(r)||e.set(r,{parents:[],children:[]});const l={ID:i,relationship:o};e.get(r).children.push(l)}),e}parseImages(){const e={},t={};if("Video"in $e.Objects){const n=$e.Objects.Video;for(const i in n){const r=n[i],o=parseInt(i);if(e[o]=r.RelativeFilename||r.Filename,"Content"in r){const a=r.Content instanceof ArrayBuffer&&r.Content.byteLength>0,l=typeof r.Content=="string"&&r.Content!=="";if(a||l){const c=this.parseImage(n[i]);t[r.RelativeFilename||r.Filename]=c}}}}for(const n in e){const i=e[n];t[i]!==void 0?e[n]=t[i]:e[n]=e[n].split("\\").pop()}return e}parseImage(e){const t=e.Content,n=e.RelativeFilename||e.Filename,i=n.slice(n.lastIndexOf(".")+1).toLowerCase();let r;switch(i){case"bmp":r="image/bmp";break;case"jpg":case"jpeg":r="image/jpeg";break;case"png":r="image/png";break;case"tif":r="image/tiff";break;case"tga":this.manager.getHandler(".tga")===null&&console.warn("FBXLoader: TGA loader not found, skipping ",n),r="image/tga";break;default:console.warn('FBXLoader: Image type "'+i+'" is not supported.');return}if(typeof t=="string")return"data:"+r+";base64,"+t;{const o=new Uint8Array(t);return window.URL.createObjectURL(new Blob([o],{type:r}))}}parseTextures(e){const t=new Map;if("Texture"in $e.Objects){const n=$e.Objects.Texture;for(const i in n){const r=this.parseTexture(n[i],e);t.set(parseInt(i),r)}}return t}parseTexture(e,t){const n=this.loadTexture(e,t);n.ID=e.id,n.name=e.attrName;const i=e.WrapModeU,r=e.WrapModeV,o=i!==void 0?i.value:0,a=r!==void 0?r.value:0;if(n.wrapS=o===0?Di:on,n.wrapT=a===0?Di:on,"Scaling"in e){const l=e.Scaling.value;n.repeat.x=l[0],n.repeat.y=l[1]}if("Translation"in e){const l=e.Translation.value;n.offset.x=l[0],n.offset.y=l[1]}return n}loadTexture(e,t){let n;const i=this.textureLoader.path,r=At.get(e.id).children;r!==void 0&&r.length>0&&t[r[0].ID]!==void 0&&(n=t[r[0].ID],(n.indexOf("blob:")===0||n.indexOf("data:")===0)&&this.textureLoader.setPath(void 0));let o;const a=e.FileName.slice(-3).toLowerCase();if(a==="tga"){const l=this.manager.getHandler(".tga");l===null?(console.warn("FBXLoader: TGA loader not found, creating placeholder texture for",e.RelativeFilename),o=new Bt):(l.setPath(this.textureLoader.path),o=l.load(n))}else if(a==="dds"){const l=this.manager.getHandler(".dds");l===null?(console.warn("FBXLoader: DDS loader not found, creating placeholder texture for",e.RelativeFilename),o=new Bt):(l.setPath(this.textureLoader.path),o=l.load(n))}else a==="psd"?(console.warn("FBXLoader: PSD textures are not supported, creating placeholder texture for",e.RelativeFilename),o=new Bt):o=this.textureLoader.load(n);return this.textureLoader.setPath(i),o}parseMaterials(e){const t=new Map;if("Material"in $e.Objects){const n=$e.Objects.Material;for(const i in n){const r=this.parseMaterial(n[i],e);r!==null&&t.set(parseInt(i),r)}}return t}parseMaterial(e,t){const n=e.id,i=e.attrName;let r=e.ShadingModel;if(typeof r=="object"&&(r=r.value),!At.has(n))return null;const o=this.parseParameters(e,t,n);let a;switch(r.toLowerCase()){case"phong":a=new na;break;case"lambert":a=new _s;break;default:console.warn('THREE.FBXLoader: unknown material type "%s". Defaulting to MeshPhongMaterial.',r),a=new na;break}return a.setValues(o),a.name=i,a}parseParameters(e,t,n){const i={};e.BumpFactor&&(i.bumpScale=e.BumpFactor.value),e.Diffuse?i.color=new Ne().fromArray(e.Diffuse.value).convertSRGBToLinear():e.DiffuseColor&&(e.DiffuseColor.type==="Color"||e.DiffuseColor.type==="ColorRGB")&&(i.color=new Ne().fromArray(e.DiffuseColor.value).convertSRGBToLinear()),e.DisplacementFactor&&(i.displacementScale=e.DisplacementFactor.value),e.Emissive?i.emissive=new Ne().fromArray(e.Emissive.value).convertSRGBToLinear():e.EmissiveColor&&(e.EmissiveColor.type==="Color"||e.EmissiveColor.type==="ColorRGB")&&(i.emissive=new Ne().fromArray(e.EmissiveColor.value).convertSRGBToLinear()),e.EmissiveFactor&&(i.emissiveIntensity=parseFloat(e.EmissiveFactor.value)),e.Opacity&&(i.opacity=parseFloat(e.Opacity.value)),i.opacity<1&&(i.transparent=!0),e.ReflectionFactor&&(i.reflectivity=e.ReflectionFactor.value),e.Shininess&&(i.shininess=e.Shininess.value),e.Specular?i.specular=new Ne().fromArray(e.Specular.value).convertSRGBToLinear():e.SpecularColor&&e.SpecularColor.type==="Color"&&(i.specular=new Ne().fromArray(e.SpecularColor.value).convertSRGBToLinear());const r=this;return At.get(n).children.forEach(function(o){const a=o.relationship;switch(a){case"Bump":i.bumpMap=r.getTexture(t,o.ID);break;case"Maya|TEX_ao_map":i.aoMap=r.getTexture(t,o.ID);break;case"DiffuseColor":case"Maya|TEX_color_map":i.map=r.getTexture(t,o.ID),i.map!==void 0&&(i.map.colorSpace=Pt);break;case"DisplacementColor":i.displacementMap=r.getTexture(t,o.ID);break;case"EmissiveColor":i.emissiveMap=r.getTexture(t,o.ID),i.emissiveMap!==void 0&&(i.emissiveMap.colorSpace=Pt);break;case"NormalMap":case"Maya|TEX_normal_map":i.normalMap=r.getTexture(t,o.ID);break;case"ReflectionColor":i.envMap=r.getTexture(t,o.ID),i.envMap!==void 0&&(i.envMap.mapping=$r,i.envMap.colorSpace=Pt);break;case"SpecularColor":i.specularMap=r.getTexture(t,o.ID),i.specularMap!==void 0&&(i.specularMap.colorSpace=Pt);break;case"TransparentColor":case"TransparencyFactor":i.alphaMap=r.getTexture(t,o.ID),i.transparent=!0;break;case"AmbientColor":case"ShininessExponent":case"SpecularFactor":case"VectorDisplacementColor":default:console.warn("THREE.FBXLoader: %s map is not supported in three.js, skipping texture.",a);break}}),i}getTexture(e,t){return"LayeredTexture"in $e.Objects&&t in $e.Objects.LayeredTexture&&(console.warn("THREE.FBXLoader: layered textures are not supported in three.js. Discarding all but first layer."),t=At.get(t).children[0].ID),e.get(t)}parseDeformers(){const e={},t={};if("Deformer"in $e.Objects){const n=$e.Objects.Deformer;for(const i in n){const r=n[i],o=At.get(parseInt(i));if(r.attrType==="Skin"){const a=this.parseSkeleton(o,n);a.ID=i,o.parents.length>1&&console.warn("THREE.FBXLoader: skeleton attached to more than one geometry is not supported."),a.geometryID=o.parents[0].ID,e[i]=a}else if(r.attrType==="BlendShape"){const a={id:i};a.rawTargets=this.parseMorphTargets(o,n),a.id=i,o.parents.length>1&&console.warn("THREE.FBXLoader: morph target attached to more than one geometry is not supported."),t[i]=a}}}return{skeletons:e,morphTargets:t}}parseSkeleton(e,t){const n=[];return e.children.forEach(function(i){const r=t[i.ID];if(r.attrType!=="Cluster")return;const o={ID:i.ID,indices:[],weights:[],transformLink:new Le().fromArray(r.TransformLink.a)};"Indexes"in r&&(o.indices=r.Indexes.a,o.weights=r.Weights.a),n.push(o)}),{rawBones:n,bones:[]}}parseMorphTargets(e,t){const n=[];for(let i=0;i<e.children.length;i++){const r=e.children[i],o=t[r.ID],a={name:o.attrName,initialWeight:o.DeformPercent,id:o.id,fullWeights:o.FullWeights.a};if(o.attrType!=="BlendShapeChannel")return;a.geoID=At.get(parseInt(r.ID)).children.filter(function(l){return l.relationship===void 0})[0].ID,n.push(a)}return n}parseScene(e,t,n){Zt=new Sn;const i=this.parseModels(e.skeletons,t,n),r=$e.Objects.Model,o=this;i.forEach(function(l){const c=r[l.ID];o.setLookAtProperties(l,c),At.get(l.ID).parents.forEach(function(u){const d=i.get(u.ID);d!==void 0&&d.add(l)}),l.parent===null&&Zt.add(l)}),this.bindSkeleton(e.skeletons,t,i),this.addGlobalSceneSettings(),Zt.traverse(function(l){if(l.userData.transformData){l.parent&&(l.userData.transformData.parentMatrix=l.parent.matrix,l.userData.transformData.parentMatrixWorld=l.parent.matrixWorld);const c=gd(l.userData.transformData);l.applyMatrix4(c),l.updateWorldMatrix()}});const a=new Xx().parse();Zt.children.length===1&&Zt.children[0].isGroup&&(Zt.children[0].animations=a,Zt=Zt.children[0]),Zt.animations=a}parseModels(e,t,n){const i=new Map,r=$e.Objects.Model;for(const o in r){const a=parseInt(o),l=r[o],c=At.get(a);let h=this.buildSkeleton(c,e,a,l.attrName);if(!h){switch(l.attrType){case"Camera":h=this.createCamera(c);break;case"Light":h=this.createLight(c);break;case"Mesh":h=this.createMesh(c,t,n);break;case"NurbsCurve":h=this.createCurve(c,t);break;case"LimbNode":case"Root":h=new Aa;break;case"Null":default:h=new Sn;break}h.name=l.attrName?ot.sanitizeNodeName(l.attrName):"",h.userData.originalName=l.attrName,h.ID=a}this.getTransformData(h,l),i.set(a,h)}return i}buildSkeleton(e,t,n,i){let r=null;return e.parents.forEach(function(o){for(const a in t){const l=t[a];l.rawBones.forEach(function(c,h){if(c.ID===o.ID){const u=r;r=new Aa,r.matrixWorld.copy(c.transformLink),r.name=i?ot.sanitizeNodeName(i):"",r.userData.originalName=i,r.ID=n,l.bones[h]=r,u!==null&&r.add(u)}})}}),r}createCamera(e){let t,n;if(e.children.forEach(function(i){const r=$e.Objects.NodeAttribute[i.ID];r!==void 0&&(n=r)}),n===void 0)t=new ut;else{let i=0;n.CameraProjectionType!==void 0&&n.CameraProjectionType.value===1&&(i=1);let r=1;n.NearPlane!==void 0&&(r=n.NearPlane.value/1e3);let o=1e3;n.FarPlane!==void 0&&(o=n.FarPlane.value/1e3);let a=window.innerWidth,l=window.innerHeight;n.AspectWidth!==void 0&&n.AspectHeight!==void 0&&(a=n.AspectWidth.value,l=n.AspectHeight.value);const c=a/l;let h=45;n.FieldOfView!==void 0&&(h=n.FieldOfView.value);const u=n.FocalLength?n.FocalLength.value:null;switch(i){case 0:t=new $t(h,c,r,o),u!==null&&t.setFocalLength(u);break;case 1:t=new uo(-a/2,a/2,l/2,-l/2,r,o);break;default:console.warn("THREE.FBXLoader: Unknown camera type "+i+"."),t=new ut;break}}return t}createLight(e){let t,n;if(e.children.forEach(function(i){const r=$e.Objects.NodeAttribute[i.ID];r!==void 0&&(n=r)}),n===void 0)t=new ut;else{let i;n.LightType===void 0?i=0:i=n.LightType.value;let r=16777215;n.Color!==void 0&&(r=new Ne().fromArray(n.Color.value).convertSRGBToLinear());let o=n.Intensity===void 0?1:n.Intensity.value/100;n.CastLightOnObject!==void 0&&n.CastLightOnObject.value===0&&(o=0);let a=0;n.FarAttenuationEnd!==void 0&&(n.EnableFarAttenuation!==void 0&&n.EnableFarAttenuation.value===0?a=0:a=n.FarAttenuationEnd.value);const l=1;switch(i){case 0:t=new ah(r,o,a,l);break;case 1:t=new nd(r,o);break;case 2:let c=Math.PI/3;n.InnerAngle!==void 0&&(c=zt.degToRad(n.InnerAngle.value));let h=0;n.OuterAngle!==void 0&&(h=zt.degToRad(n.OuterAngle.value),h=Math.max(h,1)),t=new N_(r,o,a,c,h,l);break;default:console.warn("THREE.FBXLoader: Unknown light type "+n.LightType.value+", defaulting to a PointLight."),t=new ah(r,o);break}n.CastShadows!==void 0&&n.CastShadows.value===1&&(t.castShadow=!0)}return t}createMesh(e,t,n){let i,r=null,o=null;const a=[];return e.children.forEach(function(l){t.has(l.ID)&&(r=t.get(l.ID)),n.has(l.ID)&&a.push(n.get(l.ID))}),a.length>1?o=a:a.length>0?o=a[0]:(o=new na({name:Oi.DEFAULT_MATERIAL_NAME,color:13421772}),a.push(o)),"color"in r.attributes&&a.forEach(function(l){l.vertexColors=!0}),r.FBX_Deformer?(i=new Qv(r,o),i.normalizeSkinWeights()):i=new le(r,o),i}createCurve(e,t){const n=e.children.reduce(function(r,o){return t.has(o.ID)&&(r=t.get(o.ID)),r},null),i=new ni({name:Oi.DEFAULT_MATERIAL_NAME,color:3342591,linewidth:1});return new yn(n,i)}getTransformData(e,t){const n={};"InheritType"in t&&(n.inheritType=parseInt(t.InheritType.value)),"RotationOrder"in t?n.eulerOrder=vd(t.RotationOrder.value):n.eulerOrder="ZYX","Lcl_Translation"in t&&(n.translation=t.Lcl_Translation.value),"PreRotation"in t&&(n.preRotation=t.PreRotation.value),"Lcl_Rotation"in t&&(n.rotation=t.Lcl_Rotation.value),"PostRotation"in t&&(n.postRotation=t.PostRotation.value),"Lcl_Scaling"in t&&(n.scale=t.Lcl_Scaling.value),"ScalingOffset"in t&&(n.scalingOffset=t.ScalingOffset.value),"ScalingPivot"in t&&(n.scalingPivot=t.ScalingPivot.value),"RotationOffset"in t&&(n.rotationOffset=t.RotationOffset.value),"RotationPivot"in t&&(n.rotationPivot=t.RotationPivot.value),e.userData.transformData=n}setLookAtProperties(e,t){"LookAtProperty"in t&&At.get(e.ID).children.forEach(function(i){if(i.relationship==="LookAtProperty"){const r=$e.Objects.Model[i.ID];if("Lcl_Translation"in r){const o=r.Lcl_Translation.value;e.target!==void 0?(e.target.position.fromArray(o),Zt.add(e.target)):e.lookAt(new I().fromArray(o))}}})}bindSkeleton(e,t,n){const i=this.parsePoseNodes();for(const r in e){const o=e[r];At.get(parseInt(o.ID)).parents.forEach(function(l){if(t.has(l.ID)){const c=l.ID;At.get(c).parents.forEach(function(u){n.has(u.ID)&&n.get(u.ID).bind(new Za(o.bones),i[u.ID])})}})}}parsePoseNodes(){const e={};if("Pose"in $e.Objects){const t=$e.Objects.Pose;for(const n in t)if(t[n].attrType==="BindPose"&&t[n].NbPoseNodes>0){const i=t[n].PoseNode;Array.isArray(i)?i.forEach(function(r){e[r.Node]=new Le().fromArray(r.Matrix.a)}):e[i.Node]=new Le().fromArray(i.Matrix.a)}}return e}addGlobalSceneSettings(){if("GlobalSettings"in $e){if("AmbientColor"in $e.GlobalSettings){const e=$e.GlobalSettings.AmbientColor.value,t=e[0],n=e[1],i=e[2];if(t!==0||n!==0||i!==0){const r=new Ne(t,n,i).convertSRGBToLinear();Zt.add(new id(r,1))}}"UnitScaleFactor"in $e.GlobalSettings&&(Zt.userData.unitScaleFactor=$e.GlobalSettings.UnitScaleFactor.value)}}}class Wx{constructor(){this.negativeMaterialIndices=!1}parse(e){const t=new Map;if("Geometry"in $e.Objects){const n=$e.Objects.Geometry;for(const i in n){const r=At.get(parseInt(i)),o=this.parseGeometry(r,n[i],e);t.set(parseInt(i),o)}}return this.negativeMaterialIndices===!0&&console.warn("THREE.FBXLoader: The FBX file contains invalid (negative) material indices. The asset might not render as expected."),t}parseGeometry(e,t,n){switch(t.attrType){case"Mesh":return this.parseMeshGeometry(e,t,n);case"NurbsCurve":return this.parseNurbsGeometry(t)}}parseMeshGeometry(e,t,n){const i=n.skeletons,r=[],o=e.parents.map(function(u){return $e.Objects.Model[u.ID]});if(o.length===0)return;const a=e.children.reduce(function(u,d){return i[d.ID]!==void 0&&(u=i[d.ID]),u},null);e.children.forEach(function(u){n.morphTargets[u.ID]!==void 0&&r.push(n.morphTargets[u.ID])});const l=o[0],c={};"RotationOrder"in l&&(c.eulerOrder=vd(l.RotationOrder.value)),"InheritType"in l&&(c.inheritType=parseInt(l.InheritType.value)),"GeometricTranslation"in l&&(c.translation=l.GeometricTranslation.value),"GeometricRotation"in l&&(c.rotation=l.GeometricRotation.value),"GeometricScaling"in l&&(c.scale=l.GeometricScaling.value);const h=gd(c);return this.genGeometry(t,a,r,h)}genGeometry(e,t,n,i){const r=new St;e.attrName&&(r.name=e.attrName);const o=this.parseGeoNode(e,t),a=this.genBuffers(o),l=new it(a.vertex,3);if(l.applyMatrix4(i),r.setAttribute("position",l),a.colors.length>0&&r.setAttribute("color",new it(a.colors,3)),t&&(r.setAttribute("skinIndex",new Xa(a.weightsIndices,4)),r.setAttribute("skinWeight",new it(a.vertexWeights,4)),r.FBX_Deformer=t),a.normal.length>0){const c=new Qe().getNormalMatrix(i),h=new it(a.normal,3);h.applyNormalMatrix(c),r.setAttribute("normal",h)}if(a.uvs.forEach(function(c,h){const u=h===0?"uv":`uv${h}`;r.setAttribute(u,new it(a.uvs[h],2))}),o.material&&o.material.mappingType!=="AllSame"){let c=a.materialIndex[0],h=0;if(a.materialIndex.forEach(function(u,d){u!==c&&(r.addGroup(h,d-h,c),c=u,h=d)}),r.groups.length>0){const u=r.groups[r.groups.length-1],d=u.start+u.count;d!==a.materialIndex.length&&r.addGroup(d,a.materialIndex.length-d,c)}r.groups.length===0&&r.addGroup(0,a.materialIndex.length,a.materialIndex[0])}return this.addMorphTargets(r,e,n,i),r}parseGeoNode(e,t){const n={};if(n.vertexPositions=e.Vertices!==void 0?e.Vertices.a:[],n.vertexIndices=e.PolygonVertexIndex!==void 0?e.PolygonVertexIndex.a:[],e.LayerElementColor&&(n.color=this.parseVertexColors(e.LayerElementColor[0])),e.LayerElementMaterial&&(n.material=this.parseMaterialIndices(e.LayerElementMaterial[0])),e.LayerElementNormal&&(n.normal=this.parseNormals(e.LayerElementNormal[0])),e.LayerElementUV){n.uv=[];let i=0;for(;e.LayerElementUV[i];)e.LayerElementUV[i].UV&&n.uv.push(this.parseUVs(e.LayerElementUV[i])),i++}return n.weightTable={},t!==null&&(n.skeleton=t,t.rawBones.forEach(function(i,r){i.indices.forEach(function(o,a){n.weightTable[o]===void 0&&(n.weightTable[o]=[]),n.weightTable[o].push({id:r,weight:i.weights[a]})})})),n}genBuffers(e){const t={vertex:[],normal:[],colors:[],uvs:[],materialIndex:[],vertexWeights:[],weightsIndices:[]};let n=0,i=0,r=!1,o=[],a=[],l=[],c=[],h=[],u=[];const d=this;return e.vertexIndices.forEach(function(f,g){let v,m=!1;f<0&&(f=f^-1,m=!0);let p=[],_=[];if(o.push(f*3,f*3+1,f*3+2),e.color){const x=jr(g,n,f,e.color);l.push(x[0],x[1],x[2])}if(e.skeleton){if(e.weightTable[f]!==void 0&&e.weightTable[f].forEach(function(x){_.push(x.weight),p.push(x.id)}),_.length>4){r||(console.warn("THREE.FBXLoader: Vertex has more than 4 skinning weights assigned to vertex. Deleting additional weights."),r=!0);const x=[0,0,0,0],M=[0,0,0,0];_.forEach(function(y,b){let T=y,L=p[b];M.forEach(function(S,E,C){if(T>S){C[E]=T,T=S;const U=x[E];x[E]=L,L=U}})}),p=x,_=M}for(;_.length<4;)_.push(0),p.push(0);for(let x=0;x<4;++x)h.push(_[x]),u.push(p[x])}if(e.normal){const x=jr(g,n,f,e.normal);a.push(x[0],x[1],x[2])}e.material&&e.material.mappingType!=="AllSame"&&(v=jr(g,n,f,e.material)[0],v<0&&(d.negativeMaterialIndices=!0,v=0)),e.uv&&e.uv.forEach(function(x,M){const y=jr(g,n,f,x);c[M]===void 0&&(c[M]=[]),c[M].push(y[0]),c[M].push(y[1])}),i++,m&&(d.genFace(t,e,o,v,a,l,c,h,u,i),n++,i=0,o=[],a=[],l=[],c=[],h=[],u=[])}),t}getNormalNewell(e){const t=new I(0,0,0);for(let n=0;n<e.length;n++){const i=e[n],r=e[(n+1)%e.length];t.x+=(i.y-r.y)*(i.z+r.z),t.y+=(i.z-r.z)*(i.x+r.x),t.z+=(i.x-r.x)*(i.y+r.y)}return t.normalize(),t}getNormalTangentAndBitangent(e){const t=this.getNormalNewell(e),i=(Math.abs(t.z)>.5?new I(0,1,0):new I(0,0,1)).cross(t).normalize(),r=t.clone().cross(i).normalize();return{normal:t,tangent:i,bitangent:r}}flattenVertex(e,t,n){return new _e(e.dot(t),e.dot(n))}genFace(e,t,n,i,r,o,a,l,c,h){let u;if(h>3){const d=[];for(let m=0;m<n.length;m+=3)d.push(new I(t.vertexPositions[n[m]],t.vertexPositions[n[m+1]],t.vertexPositions[n[m+2]]));const{tangent:f,bitangent:g}=this.getNormalTangentAndBitangent(d),v=[];for(const m of d)v.push(this.flattenVertex(m,f,g));u=$a.triangulateShape(v,[])}else u=[[0,1,2]];for(const[d,f,g]of u)e.vertex.push(t.vertexPositions[n[d*3]]),e.vertex.push(t.vertexPositions[n[d*3+1]]),e.vertex.push(t.vertexPositions[n[d*3+2]]),e.vertex.push(t.vertexPositions[n[f*3]]),e.vertex.push(t.vertexPositions[n[f*3+1]]),e.vertex.push(t.vertexPositions[n[f*3+2]]),e.vertex.push(t.vertexPositions[n[g*3]]),e.vertex.push(t.vertexPositions[n[g*3+1]]),e.vertex.push(t.vertexPositions[n[g*3+2]]),t.skeleton&&(e.vertexWeights.push(l[d*4]),e.vertexWeights.push(l[d*4+1]),e.vertexWeights.push(l[d*4+2]),e.vertexWeights.push(l[d*4+3]),e.vertexWeights.push(l[f*4]),e.vertexWeights.push(l[f*4+1]),e.vertexWeights.push(l[f*4+2]),e.vertexWeights.push(l[f*4+3]),e.vertexWeights.push(l[g*4]),e.vertexWeights.push(l[g*4+1]),e.vertexWeights.push(l[g*4+2]),e.vertexWeights.push(l[g*4+3]),e.weightsIndices.push(c[d*4]),e.weightsIndices.push(c[d*4+1]),e.weightsIndices.push(c[d*4+2]),e.weightsIndices.push(c[d*4+3]),e.weightsIndices.push(c[f*4]),e.weightsIndices.push(c[f*4+1]),e.weightsIndices.push(c[f*4+2]),e.weightsIndices.push(c[f*4+3]),e.weightsIndices.push(c[g*4]),e.weightsIndices.push(c[g*4+1]),e.weightsIndices.push(c[g*4+2]),e.weightsIndices.push(c[g*4+3])),t.color&&(e.colors.push(o[d*3]),e.colors.push(o[d*3+1]),e.colors.push(o[d*3+2]),e.colors.push(o[f*3]),e.colors.push(o[f*3+1]),e.colors.push(o[f*3+2]),e.colors.push(o[g*3]),e.colors.push(o[g*3+1]),e.colors.push(o[g*3+2])),t.material&&t.material.mappingType!=="AllSame"&&(e.materialIndex.push(i),e.materialIndex.push(i),e.materialIndex.push(i)),t.normal&&(e.normal.push(r[d*3]),e.normal.push(r[d*3+1]),e.normal.push(r[d*3+2]),e.normal.push(r[f*3]),e.normal.push(r[f*3+1]),e.normal.push(r[f*3+2]),e.normal.push(r[g*3]),e.normal.push(r[g*3+1]),e.normal.push(r[g*3+2])),t.uv&&t.uv.forEach(function(v,m){e.uvs[m]===void 0&&(e.uvs[m]=[]),e.uvs[m].push(a[m][d*2]),e.uvs[m].push(a[m][d*2+1]),e.uvs[m].push(a[m][f*2]),e.uvs[m].push(a[m][f*2+1]),e.uvs[m].push(a[m][g*2]),e.uvs[m].push(a[m][g*2+1])})}addMorphTargets(e,t,n,i){if(n.length===0)return;e.morphTargetsRelative=!0,e.morphAttributes.position=[];const r=this;n.forEach(function(o){o.rawTargets.forEach(function(a){const l=$e.Objects.Geometry[a.geoID];l!==void 0&&r.genMorphGeometry(e,t,l,i,a.name)})})}genMorphGeometry(e,t,n,i,r){const o=t.PolygonVertexIndex!==void 0?t.PolygonVertexIndex.a:[],a=n.Vertices!==void 0?n.Vertices.a:[],l=n.Indexes!==void 0?n.Indexes.a:[],c=e.attributes.position.count*3,h=new Float32Array(c);for(let g=0;g<l.length;g++){const v=l[g]*3;h[v]=a[g*3],h[v+1]=a[g*3+1],h[v+2]=a[g*3+2]}const u={vertexIndices:o,vertexPositions:h},d=this.genBuffers(u),f=new it(d.vertex,3);f.name=r||n.attrName,f.applyMatrix4(i),e.morphAttributes.position.push(f)}parseNormals(e){const t=e.MappingInformationType,n=e.ReferenceInformationType,i=e.Normals.a;let r=[];return n==="IndexToDirect"&&("NormalIndex"in e?r=e.NormalIndex.a:"NormalsIndex"in e&&(r=e.NormalsIndex.a)),{dataSize:3,buffer:i,indices:r,mappingType:t,referenceType:n}}parseUVs(e){const t=e.MappingInformationType,n=e.ReferenceInformationType,i=e.UV.a;let r=[];return n==="IndexToDirect"&&(r=e.UVIndex.a),{dataSize:2,buffer:i,indices:r,mappingType:t,referenceType:n}}parseVertexColors(e){const t=e.MappingInformationType,n=e.ReferenceInformationType,i=e.Colors.a;let r=[];n==="IndexToDirect"&&(r=e.ColorIndex.a);for(let o=0,a=new Ne;o<i.length;o+=4)a.fromArray(i,o).convertSRGBToLinear().toArray(i,o);return{dataSize:4,buffer:i,indices:r,mappingType:t,referenceType:n}}parseMaterialIndices(e){const t=e.MappingInformationType,n=e.ReferenceInformationType;if(t==="NoMappingInformation")return{dataSize:1,buffer:[0],indices:[0],mappingType:"AllSame",referenceType:n};const i=e.Materials.a,r=[];for(let o=0;o<i.length;++o)r.push(o);return{dataSize:1,buffer:i,indices:r,mappingType:t,referenceType:n}}parseNurbsGeometry(e){const t=parseInt(e.Order);if(isNaN(t))return console.error("THREE.FBXLoader: Invalid Order %s given for geometry ID: %s",e.Order,e.id),new St;const n=t-1,i=e.KnotVector.a,r=[],o=e.Points.a;for(let u=0,d=o.length;u<d;u+=4)r.push(new at().fromArray(o,u));let a,l;if(e.Form==="Closed")r.push(r[0]);else if(e.Form==="Periodic"){a=n,l=i.length-1-a;for(let u=0;u<n;++u)r.push(r[u])}const h=new kx(n,i,r,a,l).getPoints(r.length*12);return new St().setFromPoints(h)}}class Xx{parse(){const e=[],t=this.parseClips();if(t!==void 0)for(const n in t){const i=t[n],r=this.addClip(i);e.push(r)}return e}parseClips(){if($e.Objects.AnimationCurve===void 0)return;const e=this.parseAnimationCurveNodes();this.parseAnimationCurves(e);const t=this.parseAnimationLayers(e);return this.parseAnimStacks(t)}parseAnimationCurveNodes(){const e=$e.Objects.AnimationCurveNode,t=new Map;for(const n in e){const i=e[n];if(i.attrName.match(/S|R|T|DeformPercent/)!==null){const r={id:i.id,attr:i.attrName,curves:{}};t.set(r.id,r)}}return t}parseAnimationCurves(e){const t=$e.Objects.AnimationCurve;for(const n in t){const i={id:t[n].id,times:t[n].KeyTime.a.map(Kx),values:t[n].KeyValueFloat.a},r=At.get(i.id);if(r!==void 0){const o=r.parents[0].ID,a=r.parents[0].relationship;a.match(/X/)?e.get(o).curves.x=i:a.match(/Y/)?e.get(o).curves.y=i:a.match(/Z/)?e.get(o).curves.z=i:a.match(/DeformPercent/)&&e.has(o)&&(e.get(o).curves.morph=i)}}}parseAnimationLayers(e){const t=$e.Objects.AnimationLayer,n=new Map;for(const i in t){const r=[],o=At.get(parseInt(i));o!==void 0&&(o.children.forEach(function(l,c){if(e.has(l.ID)){const h=e.get(l.ID);if(h.curves.x!==void 0||h.curves.y!==void 0||h.curves.z!==void 0){if(r[c]===void 0){const u=At.get(l.ID).parents.filter(function(d){return d.relationship!==void 0})[0].ID;if(u!==void 0){const d=$e.Objects.Model[u.toString()];if(d===void 0){console.warn("THREE.FBXLoader: Encountered a unused curve.",l);return}const f={modelName:d.attrName?ot.sanitizeNodeName(d.attrName):"",ID:d.id,initialPosition:[0,0,0],initialRotation:[0,0,0],initialScale:[1,1,1]};Zt.traverse(function(g){g.ID===d.id&&(f.transform=g.matrix,g.userData.transformData&&(f.eulerOrder=g.userData.transformData.eulerOrder))}),f.transform||(f.transform=new Le),"PreRotation"in d&&(f.preRotation=d.PreRotation.value),"PostRotation"in d&&(f.postRotation=d.PostRotation.value),r[c]=f}}r[c]&&(r[c][h.attr]=h)}else if(h.curves.morph!==void 0){if(r[c]===void 0){const u=At.get(l.ID).parents.filter(function(p){return p.relationship!==void 0})[0].ID,d=At.get(u).parents[0].ID,f=At.get(d).parents[0].ID,g=At.get(f).parents[0].ID,v=$e.Objects.Model[g],m={modelName:v.attrName?ot.sanitizeNodeName(v.attrName):"",morphName:$e.Objects.Deformer[u].attrName};r[c]=m}r[c][h.attr]=h}}}),n.set(parseInt(i),r))}return n}parseAnimStacks(e){const t=$e.Objects.AnimationStack,n={};for(const i in t){const r=At.get(parseInt(i)).children;r.length>1&&console.warn("THREE.FBXLoader: Encountered an animation stack with multiple layers, this is currently not supported. Ignoring subsequent layers.");const o=e.get(r[0].ID);n[i]={name:t[i].attrName,layer:o}}return n}addClip(e){let t=[];const n=this;return e.layer.forEach(function(i){t=t.concat(n.generateTracks(i))}),new w_(e.name,-1,t)}generateTracks(e){const t=[];let n=new I,i=new I;if(e.transform&&e.transform.decompose(n,new ft,i),n=n.toArray(),i=i.toArray(),e.T!==void 0&&Object.keys(e.T.curves).length>0){const r=this.generateVectorTrack(e.modelName,e.T.curves,n,"position");r!==void 0&&t.push(r)}if(e.R!==void 0&&Object.keys(e.R.curves).length>0){const r=this.generateRotationTrack(e.modelName,e.R.curves,e.preRotation,e.postRotation,e.eulerOrder);r!==void 0&&t.push(r)}if(e.S!==void 0&&Object.keys(e.S.curves).length>0){const r=this.generateVectorTrack(e.modelName,e.S.curves,i,"scale");r!==void 0&&t.push(r)}if(e.DeformPercent!==void 0){const r=this.generateMorphTrack(e);r!==void 0&&t.push(r)}return t}generateVectorTrack(e,t,n,i){const r=this.getTimesForAllAxes(t),o=this.getKeyframeTrackValues(r,t,n);return new $s(e+"."+i,r,o)}generateRotationTrack(e,t,n,i,r){let o,a;if(t.x!==void 0&&t.y!==void 0&&t.z!==void 0){const u=this.interpolateRotations(t.x,t.y,t.z,r);o=u[0],a=u[1]}n!==void 0&&(n=n.map(zt.degToRad),n.push(r),n=new Kt().fromArray(n),n=new ft().setFromEuler(n)),i!==void 0&&(i=i.map(zt.degToRad),i.push(r),i=new Kt().fromArray(i),i=new ft().setFromEuler(i).invert());const l=new ft,c=new Kt,h=[];if(!a||!o)return new Ni(e+".quaternion",[],[]);for(let u=0;u<a.length;u+=3)c.set(a[u],a[u+1],a[u+2],r),l.setFromEuler(c),n!==void 0&&l.premultiply(n),i!==void 0&&l.multiply(i),u>2&&new ft().fromArray(h,(u-3)/3*4).dot(l)<0&&l.set(-l.x,-l.y,-l.z,-l.w),l.toArray(h,u/3*4);return new Ni(e+".quaternion",o,h)}generateMorphTrack(e){const t=e.DeformPercent.curves.morph,n=t.values.map(function(r){return r/100}),i=Zt.getObjectByName(e.modelName).morphTargetDictionary[e.morphName];return new Ks(e.modelName+".morphTargetInfluences["+i+"]",t.times,n)}getTimesForAllAxes(e){let t=[];if(e.x!==void 0&&(t=t.concat(e.x.times)),e.y!==void 0&&(t=t.concat(e.y.times)),e.z!==void 0&&(t=t.concat(e.z.times)),t=t.sort(function(n,i){return n-i}),t.length>1){let n=1,i=t[0];for(let r=1;r<t.length;r++){const o=t[r];o!==i&&(t[n]=o,i=o,n++)}t=t.slice(0,n)}return t}getKeyframeTrackValues(e,t,n){const i=n,r=[];let o=-1,a=-1,l=-1;return e.forEach(function(c){if(t.x&&(o=t.x.times.indexOf(c)),t.y&&(a=t.y.times.indexOf(c)),t.z&&(l=t.z.times.indexOf(c)),o!==-1){const h=t.x.values[o];r.push(h),i[0]=h}else r.push(i[0]);if(a!==-1){const h=t.y.values[a];r.push(h),i[1]=h}else r.push(i[1]);if(l!==-1){const h=t.z.values[l];r.push(h),i[2]=h}else r.push(i[2])}),r}interpolateRotations(e,t,n,i){const r=[],o=[];r.push(e.times[0]),o.push(zt.degToRad(e.values[0])),o.push(zt.degToRad(t.values[0])),o.push(zt.degToRad(n.values[0]));for(let a=1;a<e.values.length;a++){const l=[e.values[a-1],t.values[a-1],n.values[a-1]];if(isNaN(l[0])||isNaN(l[1])||isNaN(l[2]))continue;const c=l.map(zt.degToRad),h=[e.values[a],t.values[a],n.values[a]];if(isNaN(h[0])||isNaN(h[1])||isNaN(h[2]))continue;const u=h.map(zt.degToRad),d=[h[0]-l[0],h[1]-l[1],h[2]-l[2]],f=[Math.abs(d[0]),Math.abs(d[1]),Math.abs(d[2])];if(f[0]>=180||f[1]>=180||f[2]>=180){const v=Math.max(...f)/180,m=new Kt(...c,i),p=new Kt(...u,i),_=new ft().setFromEuler(m),x=new ft().setFromEuler(p);_.dot(x)&&x.set(-x.x,-x.y,-x.z,-x.w);const M=e.times[a-1],y=e.times[a]-M,b=new ft,T=new Kt;for(let L=0;L<1;L+=1/v)b.copy(_.clone().slerp(x.clone(),L)),r.push(M+L*y),T.setFromQuaternion(b,i),o.push(T.x),o.push(T.y),o.push(T.z)}else r.push(e.times[a]),o.push(zt.degToRad(e.values[a])),o.push(zt.degToRad(t.values[a])),o.push(zt.degToRad(n.values[a]))}return[r,o]}}class Yx{getPrevNode(){return this.nodeStack[this.currentIndent-2]}getCurrentNode(){return this.nodeStack[this.currentIndent-1]}getCurrentProp(){return this.currentProp}pushStack(e){this.nodeStack.push(e),this.currentIndent+=1}popStack(){this.nodeStack.pop(),this.currentIndent-=1}setCurrentProp(e,t){this.currentProp=e,this.currentPropName=t}parse(e){this.currentIndent=0,this.allNodes=new md,this.nodeStack=[],this.currentProp=[],this.currentPropName="";const t=this,n=e.split(/[\r\n]+/);return n.forEach(function(i,r){const o=i.match(/^[\s\t]*;/),a=i.match(/^[\s\t]*$/);if(o||a)return;const l=i.match("^\\t{"+t.currentIndent+"}(\\w+):(.*){",""),c=i.match("^\\t{"+t.currentIndent+"}(\\w+):[\\s\\t\\r\\n](.*)"),h=i.match("^\\t{"+(t.currentIndent-1)+"}}");l?t.parseNodeBegin(i,l):c?t.parseNodeProperty(i,c,n[++r]):h?t.popStack():i.match(/^[^\s\t}]/)&&t.parseNodePropertyContinued(i)}),this.allNodes}parseNodeBegin(e,t){const n=t[1].trim().replace(/^"/,"").replace(/"$/,""),i=t[2].split(",").map(function(l){return l.trim().replace(/^"/,"").replace(/"$/,"")}),r={name:n},o=this.parseNodeAttr(i),a=this.getCurrentNode();this.currentIndent===0?this.allNodes.add(n,r):n in a?(n==="PoseNode"?a.PoseNode.push(r):a[n].id!==void 0&&(a[n]={},a[n][a[n].id]=a[n]),o.id!==""&&(a[n][o.id]=r)):typeof o.id=="number"?(a[n]={},a[n][o.id]=r):n!=="Properties70"&&(n==="PoseNode"?a[n]=[r]:a[n]=r),typeof o.id=="number"&&(r.id=o.id),o.name!==""&&(r.attrName=o.name),o.type!==""&&(r.attrType=o.type),this.pushStack(r)}parseNodeAttr(e){let t=e[0];e[0]!==""&&(t=parseInt(e[0]),isNaN(t)&&(t=e[0]));let n="",i="";return e.length>1&&(n=e[1].replace(/^(\w+)::/,""),i=e[2]),{id:t,name:n,type:i}}parseNodeProperty(e,t,n){let i=t[1].replace(/^"/,"").replace(/"$/,"").trim(),r=t[2].replace(/^"/,"").replace(/"$/,"").trim();i==="Content"&&r===","&&(r=n.replace(/"/g,"").replace(/,$/,"").trim());const o=this.getCurrentNode();if(o.name==="Properties70"){this.parseNodeSpecialProperty(e,i,r);return}if(i==="C"){const l=r.split(",").slice(1),c=parseInt(l[0]),h=parseInt(l[1]);let u=r.split(",").slice(3);u=u.map(function(d){return d.trim().replace(/^"/,"")}),i="connections",r=[c,h],Qx(r,u),o[i]===void 0&&(o[i]=[])}i==="Node"&&(o.id=r),i in o&&Array.isArray(o[i])?o[i].push(r):i!=="a"?o[i]=r:o.a=r,this.setCurrentProp(o,i),i==="a"&&r.slice(-1)!==","&&(o.a=da(r))}parseNodePropertyContinued(e){const t=this.getCurrentNode();t.a+=e,e.slice(-1)!==","&&(t.a=da(t.a))}parseNodeSpecialProperty(e,t,n){const i=n.split('",').map(function(h){return h.trim().replace(/^\"/,"").replace(/\s/,"_")}),r=i[0],o=i[1],a=i[2],l=i[3];let c=i[4];switch(o){case"int":case"enum":case"bool":case"ULongLong":case"double":case"Number":case"FieldOfView":c=parseFloat(c);break;case"Color":case"ColorRGB":case"Vector3D":case"Lcl_Translation":case"Lcl_Rotation":case"Lcl_Scaling":c=da(c);break}this.getPrevNode()[r]={type:o,type2:a,flag:l,value:c},this.setCurrentProp(this.getPrevNode(),r)}}class jx{parse(e){const t=new Eh(e);t.skip(23);const n=t.getUint32();if(n<6400)throw new Error("THREE.FBXLoader: FBX version not supported, FileVersion: "+n);const i=new md;for(;!this.endOfContent(t);){const r=this.parseNode(t,n);r!==null&&i.add(r.name,r)}return i}endOfContent(e){return e.size()%16===0?(e.getOffset()+160+16&-16)>=e.size():e.getOffset()+160+16>=e.size()}parseNode(e,t){const n={},i=t>=7500?e.getUint64():e.getUint32(),r=t>=7500?e.getUint64():e.getUint32();t>=7500?e.getUint64():e.getUint32();const o=e.getUint8(),a=e.getString(o);if(i===0)return null;const l=[];for(let d=0;d<r;d++)l.push(this.parseProperty(e));const c=l.length>0?l[0]:"",h=l.length>1?l[1]:"",u=l.length>2?l[2]:"";for(n.singleProperty=r===1&&e.getOffset()===i;i>e.getOffset();){const d=this.parseNode(e,t);d!==null&&this.parseSubNode(a,n,d)}return n.propertyList=l,typeof c=="number"&&(n.id=c),h!==""&&(n.attrName=h),u!==""&&(n.attrType=u),a!==""&&(n.name=a),n}parseSubNode(e,t,n){if(n.singleProperty===!0){const i=n.propertyList[0];Array.isArray(i)?(t[n.name]=n,n.a=i):t[n.name]=i}else if(e==="Connections"&&n.name==="C"){const i=[];n.propertyList.forEach(function(r,o){o!==0&&i.push(r)}),t.connections===void 0&&(t.connections=[]),t.connections.push(i)}else if(n.name==="Properties70")Object.keys(n).forEach(function(r){t[r]=n[r]});else if(e==="Properties70"&&n.name==="P"){let i=n.propertyList[0],r=n.propertyList[1];const o=n.propertyList[2],a=n.propertyList[3];let l;i.indexOf("Lcl ")===0&&(i=i.replace("Lcl ","Lcl_")),r.indexOf("Lcl ")===0&&(r=r.replace("Lcl ","Lcl_")),r==="Color"||r==="ColorRGB"||r==="Vector"||r==="Vector3D"||r.indexOf("Lcl_")===0?l=[n.propertyList[4],n.propertyList[5],n.propertyList[6]]:l=n.propertyList[4],t[i]={type:r,type2:o,flag:a,value:l}}else t[n.name]===void 0?typeof n.id=="number"?(t[n.name]={},t[n.name][n.id]=n):t[n.name]=n:n.name==="PoseNode"?(Array.isArray(t[n.name])||(t[n.name]=[t[n.name]]),t[n.name].push(n)):t[n.name][n.id]===void 0&&(t[n.name][n.id]=n)}parseProperty(e){const t=e.getString(1);let n;switch(t){case"C":return e.getBoolean();case"D":return e.getFloat64();case"F":return e.getFloat32();case"I":return e.getInt32();case"L":return e.getInt64();case"R":return n=e.getUint32(),e.getArrayBuffer(n);case"S":return n=e.getUint32(),e.getString(n);case"Y":return e.getInt16();case"b":case"c":case"d":case"f":case"i":case"l":const i=e.getUint32(),r=e.getUint32(),o=e.getUint32();if(r===0)switch(t){case"b":case"c":return e.getBooleanArray(i);case"d":return e.getFloat64Array(i);case"f":return e.getFloat32Array(i);case"i":return e.getInt32Array(i);case"l":return e.getInt64Array(i)}const a=Lx(new Uint8Array(e.getArrayBuffer(o))),l=new Eh(a.buffer);switch(t){case"b":case"c":return l.getBooleanArray(i);case"d":return l.getFloat64Array(i);case"f":return l.getFloat32Array(i);case"i":return l.getInt32Array(i);case"l":return l.getInt64Array(i)}break;default:throw new Error("THREE.FBXLoader: Unknown property type "+t)}}}class Eh{constructor(e,t){this.dv=new DataView(e),this.offset=0,this.littleEndian=t!==void 0?t:!0,this._textDecoder=new TextDecoder}getOffset(){return this.offset}size(){return this.dv.buffer.byteLength}skip(e){this.offset+=e}getBoolean(){return(this.getUint8()&1)===1}getBooleanArray(e){const t=[];for(let n=0;n<e;n++)t.push(this.getBoolean());return t}getUint8(){const e=this.dv.getUint8(this.offset);return this.offset+=1,e}getInt16(){const e=this.dv.getInt16(this.offset,this.littleEndian);return this.offset+=2,e}getInt32(){const e=this.dv.getInt32(this.offset,this.littleEndian);return this.offset+=4,e}getInt32Array(e){const t=[];for(let n=0;n<e;n++)t.push(this.getInt32());return t}getUint32(){const e=this.dv.getUint32(this.offset,this.littleEndian);return this.offset+=4,e}getInt64(){let e,t;return this.littleEndian?(e=this.getUint32(),t=this.getUint32()):(t=this.getUint32(),e=this.getUint32()),t&2147483648?(t=~t&4294967295,e=~e&4294967295,e===4294967295&&(t=t+1&4294967295),e=e+1&4294967295,-(t*4294967296+e)):t*4294967296+e}getInt64Array(e){const t=[];for(let n=0;n<e;n++)t.push(this.getInt64());return t}getUint64(){let e,t;return this.littleEndian?(e=this.getUint32(),t=this.getUint32()):(t=this.getUint32(),e=this.getUint32()),t*4294967296+e}getFloat32(){const e=this.dv.getFloat32(this.offset,this.littleEndian);return this.offset+=4,e}getFloat32Array(e){const t=[];for(let n=0;n<e;n++)t.push(this.getFloat32());return t}getFloat64(){const e=this.dv.getFloat64(this.offset,this.littleEndian);return this.offset+=8,e}getFloat64Array(e){const t=[];for(let n=0;n<e;n++)t.push(this.getFloat64());return t}getArrayBuffer(e){const t=this.dv.buffer.slice(this.offset,this.offset+e);return this.offset+=e,t}getString(e){const t=this.offset;let n=new Uint8Array(this.dv.buffer,t,e);this.skip(e);const i=n.indexOf(0);return i>=0&&(n=new Uint8Array(this.dv.buffer,t,i)),this._textDecoder.decode(n)}}class md{add(e,t){this[e]=t}}function qx(s){const e="Kaydara FBX Binary  \0";return s.byteLength>=e.length&&e===_d(s,0,e.length)}function Zx(s){const e=["K","a","y","d","a","r","a","\\","F","B","X","\\","B","i","n","a","r","y","\\","\\"];let t=0;function n(i){const r=s[i-1];return s=s.slice(t+i),t++,r}for(let i=0;i<e.length;++i)if(n(1)===e[i])return!1;return!0}function bh(s){const e=/FBXVersion: (\d+)/,t=s.match(e);if(t)return parseInt(t[1]);throw new Error("THREE.FBXLoader: Cannot find the version number for the file given.")}function Kx(s){return s/46186158e3}const $x=[];function jr(s,e,t,n){let i;switch(n.mappingType){case"ByPolygonVertex":i=s;break;case"ByPolygon":i=e;break;case"ByVertice":i=t;break;case"AllSame":i=n.indices[0];break;default:console.warn("THREE.FBXLoader: unknown attribute mapping type "+n.mappingType)}n.referenceType==="IndexToDirect"&&(i=n.indices[i]);const r=i*n.dataSize,o=r+n.dataSize;return Jx($x,n.buffer,r,o)}const ua=new Kt,os=new I;function gd(s){const e=new Le,t=new Le,n=new Le,i=new Le,r=new Le,o=new Le,a=new Le,l=new Le,c=new Le,h=new Le,u=new Le,d=new Le,f=s.inheritType?s.inheritType:0;if(s.translation&&e.setPosition(os.fromArray(s.translation)),s.preRotation){const E=s.preRotation.map(zt.degToRad);E.push(s.eulerOrder||Kt.DEFAULT_ORDER),t.makeRotationFromEuler(ua.fromArray(E))}if(s.rotation){const E=s.rotation.map(zt.degToRad);E.push(s.eulerOrder||Kt.DEFAULT_ORDER),n.makeRotationFromEuler(ua.fromArray(E))}if(s.postRotation){const E=s.postRotation.map(zt.degToRad);E.push(s.eulerOrder||Kt.DEFAULT_ORDER),i.makeRotationFromEuler(ua.fromArray(E)),i.invert()}s.scale&&r.scale(os.fromArray(s.scale)),s.scalingOffset&&a.setPosition(os.fromArray(s.scalingOffset)),s.scalingPivot&&o.setPosition(os.fromArray(s.scalingPivot)),s.rotationOffset&&l.setPosition(os.fromArray(s.rotationOffset)),s.rotationPivot&&c.setPosition(os.fromArray(s.rotationPivot)),s.parentMatrixWorld&&(u.copy(s.parentMatrix),h.copy(s.parentMatrixWorld));const g=t.clone().multiply(n).multiply(i),v=new Le;v.extractRotation(h);const m=new Le;m.copyPosition(h);const p=m.clone().invert().multiply(h),_=v.clone().invert().multiply(p),x=r,M=new Le;if(f===0)M.copy(v).multiply(g).multiply(_).multiply(x);else if(f===1)M.copy(v).multiply(_).multiply(g).multiply(x);else{const C=new Le().scale(new I().setFromMatrixScale(u)).clone().invert(),U=_.clone().multiply(C);M.copy(v).multiply(g).multiply(U).multiply(x)}const y=c.clone().invert(),b=o.clone().invert();let T=e.clone().multiply(l).multiply(c).multiply(t).multiply(n).multiply(i).multiply(y).multiply(a).multiply(o).multiply(r).multiply(b);const L=new Le().copyPosition(T),S=h.clone().multiply(L);return d.copyPosition(S),T=d.clone().multiply(M),T.premultiply(h.invert()),T}function vd(s){s=s||0;const e=["ZYX","YZX","XZY","ZXY","YXZ","XYZ"];return s===6?(console.warn("THREE.FBXLoader: unsupported Euler Order: Spherical XYZ. Animations and rotations may be incorrect."),e[0]):e[s]}function da(s){return s.split(",").map(function(t){return parseFloat(t)})}function _d(s,e,t){return e===void 0&&(e=0),t===void 0&&(t=s.byteLength),new TextDecoder().decode(new Uint8Array(s,e,t))}function Qx(s,e){for(let t=0,n=s.length,i=e.length;t<i;t++,n++)s[n]=e[t]}function Jx(s,e,t,n){for(let i=t,r=0;i<n;i++,r++)s[r]=e[i];return s}const eM=new Vx,hs=new Map,fa=new Map;function Da(s,e=.08){const t=(s==null?void 0:s.color)??8947848,n=new _s({color:t});if((s==null?void 0:s.placeholderShape)==="signpost"||(s==null?void 0:s.id)==="sign"){const l=new Sn,c=1,h=.04,u=new Mt(h,h*1.1,c,8),d=new le(u,n);d.position.y=c/2,l.add(d);const f=.5,g=.25,v=.04,m=new ht(f,v,g),p=new le(m,n);return p.position.y=c+v/2,l.add(p),l.rotation.x=Math.PI/2,l}let i,r;const o=1;switch((s==null?void 0:s.placeholderShape)??"sphere"){case"sphere":i=new fi(o/2,8,6),r=new le(i,n),r.position.y=o/2;break;case"cylinder":i=new Mt(o*.2,o*.25,o,8),r=new le(i,n),r.position.y=o/2;break;case"cone":i=new tr(o*.3,o,8),r=new le(i,n),r.position.y=o/2;break;case"box":i=new ht(o*.2,o,o*.1),r=new le(i,n),r.position.y=o/2;break;default:i=new fi(o/2,8,6),r=new le(i,n),r.position.y=o/2}const a=new Sn;return a.add(r),a.rotation.x=-Math.PI/2,a}function tM(s){s.traverse(o=>{o.isMesh&&(o.castShadow=!0,o.receiveShadow=!0)});const e=new zi().setFromObject(s),t=new I;e.getSize(t);const i=1/Math.max(t.x,t.y,t.z,.001);s.scale.setScalar(i),s.rotation.x=Math.PI/2;const r=new Sn;return r.add(s),s.position.z=-e.min.y*i,r}function nM(s){if(hs.has(s))return Promise.resolve(hs.get(s));if(fa.has(s))return fa.get(s);const e=En(s);if(!(e!=null&&e.fbxPath)){const n=Da(e);return hs.set(s,n),Promise.resolve(n)}const t=new Promise(n=>{eM.load(e.fbxPath,i=>{const r=tM(i);hs.set(s,r),n(r)},void 0,()=>{const i=Da(e);hs.set(s,i),n(i)})});return fa.set(s,t),t}function Th(s,e){const t=(s==null?void 0:s.color)??8947848,n=new _s({color:t}),i=1,r=e==="low",o=r?4:6,a=r?3:4;let l,c;switch((s==null?void 0:s.placeholderShape)??"sphere"){case"cylinder":l=new Mt(i*.2,i*.25,i,o),c=new le(l,n),c.position.y=i/2;break;case"cone":l=new tr(i*.3,i,o),c=new le(l,n),c.position.y=i/2;break;case"box":l=new ht(i*.2,i,i*.1),c=new le(l,n),c.position.y=i/2;break;case"signpost":l=new Mt(.04,.044,i,o),c=new le(l,n),c.position.y=i/2;break;default:l=new fi(i/2,o,a),c=new le(l,n),c.position.y=i/2}const h=new Sn;return h.add(c),h.rotation.x=-Math.PI/2,h}const iM=1.2,sM=2.5;function rM(s){var o;const e=En(s),t=Ua(s),n=Th(e,"medium"),i=Th(e,"low"),r=new Kv;return r.addLevel(t,0),r.addLevel(n,iM),r.addLevel(i,sM),r.userData.fromPropCache=((o=t.userData)==null?void 0:o.fromPropCache)??!1,r}function Ua(s){const e=En(s),t=hs.get(s);if(t){const i=t.clone(!0);return i.userData.fromPropCache=!0,i.traverse(r=>{r.isMesh&&r.material&&(r.material=r.material.clone())}),i}const n=Da(e);return n.userData.fromPropCache=!1,n}const oM=9139029;function xd(s){const e=Pn(s),t=e.width,n=e.height;return{tx:Math.floor(s.chunkX+t/2),ty:Math.floor(s.chunkY+n/2)}}function Fa(s,e,t,n,i,r,o,a){const l=i.length-1;function c(_,x){var L;if(_<0||_>=o||x<0||x>=a)return!1;const M=Math.floor(l/o),y=Math.min(l,Math.floor((_+.5)*M)),b=Math.min(l,Math.floor((x+.5)*M));return(((L=i[b])==null?void 0:L[y])??0)>r}const h=(_,x)=>`${_},${x}`,u=new Map,d=new Set,f=new Map,g=new Map,v=new Map,m=h(s,e);f.set(m,0),g.set(m,Math.abs(t-s)+Math.abs(n-e)),u.set(m,{tx:s,ty:e,f:g.get(m)});const p=[[0,1],[1,0],[0,-1],[-1,0],[1,1],[1,-1],[-1,-1],[-1,1]];for(;u.size>0;){let _=null,x=1/0;for(const[y,b]of u)b.f<x&&(x=b.f,_=y);if(_===null)break;const M=u.get(_);if(u.delete(_),d.add(_),M.tx===t&&M.ty===n){const y=[];let b=_;for(;b;){const[T,L]=b.split(",").map(Number);y.unshift({tx:T,ty:L}),b=v.get(b)}return y}for(const[y,b]of p){const T=M.tx+y,L=M.ty+b,S=h(T,L);if(d.has(S)||!c(T,L))continue;const E=y!==0&&b!==0?1.414:1,C=(f.get(_)??1/0)+E;if(C>=(f.get(S)??1/0))continue;v.set(S,_),f.set(S,C);const U=Math.abs(t-T)+Math.abs(n-L);g.set(S,C+U),u.set(S,{tx:T,ty:L,f:C+U})}}return null}function wh(s,e,t,n){if(!s||e<=1)return s;let i=new Set(s);const r=[[0,1],[1,0],[0,-1],[-1,0]];for(let o=0;o<e-1;o++){const a=new Set(i);for(const l of i){const[c,h]=l.split(",").map(Number);for(const[u,d]of r){const f=c+u,g=h+d;f>=0&&f<t&&g>=0&&g<n&&a.add(`${f},${g}`)}}i=a}return i}function aM(s,e,t){const n=new Set;if(!e||!s||s.length<2)return n;const i=e.length-1,r=(t==null?void 0:t.tileSize)??(t==null?void 0:t.chunkSize)??8,o=(t==null?void 0:t.tilesX)??Math.floor(i/r),a=(t==null?void 0:t.tilesY)??Math.floor(i/r),l=(t==null?void 0:t.seaLevel)??.12,c=Math.max(1,Math.min(5,parseInt(t==null?void 0:t.pathWidth,10)||1)),h=s.map(v=>xd(v)),u=h.length;for(const v of h)n.add(`${v.tx},${v.ty}`);if(u<2)return wh(n,c,o,a);const d=[];for(let v=0;v<u;v++)for(let m=v+1;m<u;m++){const p=Fa(h[v].tx,h[v].ty,h[m].tx,h[m].ty,e,l,o,a);p&&p.length>0&&d.push({i:v,j:m,path:p,len:p.length})}const f=new Set([0]),g=[];for(;f.size<u;){let v=null;for(const m of d){const p=f.has(m.i),_=f.has(m.j);p!==_&&(v===null||m.len<v.len)&&(v=m)}if(v===null)break;g.push(v),f.add(v.i),f.add(v.j)}for(let v=1;v<u;v++){if(f.has(v))continue;const m=Fa(h[0].tx,h[0].ty,h[v].tx,h[v].ty,e,l,o,a);m&&(g.push({i:0,j:v,path:m,len:m.length}),f.add(v))}for(const v of g)for(const{tx:m,ty:p}of v.path)n.add(`${m},${p}`);return wh(n,c,o,a)}function lM(s,e,t){var o;if(!s||!e||e.size===0)return;const n=s.length-1,i=(t==null?void 0:t.tileSize)??(t==null?void 0:t.chunkSize)??8;(t==null?void 0:t.tilesX)??Math.floor(n/i),(t==null?void 0:t.tilesY)??Math.floor(n/i);const r=[];for(const a of e){const[l,c]=a.split(",").map(Number),h=Math.max(0,l*i),u=Math.max(0,c*i),d=Math.min(n,(l+1)*i),f=Math.min(n,(c+1)*i);let g=0,v=0;for(let m=u;m<=f;m++)for(let p=h;p<=d;p++)g+=((o=s[m])==null?void 0:o[p])??0,v++;if(v>0){const m=g/v;r.push({x0:h,y0:u,x1:d,y1:f,avg:m})}}for(const{x0:a,y0:l,x1:c,y1:h,avg:u}of r)for(let d=l;d<=h;d++)for(let f=a;f<=c;f++)s[d]&&(s[d][f]=u)}function Ah(s,e,t,n,i,r){if(!n||n.length===0||!i||i.length<2)return!0;const o=i.length-1,a=(r==null?void 0:r.tileSize)??(r==null?void 0:r.chunkSize)??8,l=(r==null?void 0:r.tilesX)??Math.floor(o/a),c=(r==null?void 0:r.tilesY)??Math.floor(o/a),h=(r==null?void 0:r.seaLevel)??.12,u=oi(s),d=Math.floor(e+u.width/2),f=Math.floor(t+u.height/2);for(const g of n){const v=xd(g),m=Fa(d,f,v.tx,v.ty,i,h,l,c);if(m&&m.length>0)return!0}return!1}function Hi(s,e,t){const n=e?e.map(r=>[...r]):null;if(!n)return{pathTiles:new Set,heightMap:n};const i=aM(s,n,t);return lM(n,i,t),{pathTiles:i,heightMap:n}}const Na={normal:{water:3900150,beach:16708551,grass:4881497,rock:7041664,snow:15792639},volcanic:{water:1981023,beach:2960685,grass:6045747,rock:9127187,snow:14423100},icey:{water:8900331,beach:14745599,grass:11584734,rock:7372944,snow:16775920},swampy:{water:3100495,beach:7029795,grass:2969622,rock:4873507,snow:9139029}};function Ph(s="normal"){return Na[s]??Na.normal}function Rh(s,e,t=Na.normal){if(s<=e)return t.water;const n=(s-e)/(1.2-e);return n<.12?t.beach:n<.4?t.grass:n<.7?t.rock:t.snow}function Ch(s){return[(s>>16&255)/255,(s>>8&255)/255,(s&255)/255]}class cM{constructor(e){this.container=e,this.scene=null,this.camera=null,this.renderer=null,this.controls=null,this.islandMesh=null,this.waterMesh=null,this.hoverOverlayMesh=null,this.buildingMeshes=[],this.gridOverlayMesh=null,this.zoneHintsOverlayMesh=null,this.placementPreviewMesh=null,this.buildingHighlightMesh=null,this.propMeshes=[],this.propPlacementPreviewMesh=null,this.propHighlightMesh=null,this._lastHighlightedProp=null,this.rampPreviewMesh=null,this._inputMode="view",this._spaceHeld=!1,this.ambientLight=null,this.directionalLight=null,this.config={waterColor:2450411,wireframe:!1,showWater:!0,heightScale:1,useVertexColors:!0,seaLevel:.12,pathColor:oM,shadows:!0,antialias:!0,theme:"normal"},this.pathTiles=new Set,this._onPropMeshLoaded=null,this.transformControls=null,this._onPropTransformChange=null,this._gizmoTileConfig=null,this._gizmoHeightMap=null,this._gizmoSnapEnabled=!1,this._gizmoBaseSize=.8,this._gizmoRefDistance=1.5,this._gizmoPos=new I,this._frameCount=0,this._gizmoSizeUpdateInterval=10,this.postProcessing=null,this._lastFrameTime=performance.now()}setOnPropMeshLoaded(e){this._onPropMeshLoaded=e}setOnPropTransformChange(e){this._onPropTransformChange=e}init(){const e=this.container.clientWidth,t=this.container.clientHeight;this.scene=new Zv,this.scene.background=new Ne(8900331),this.camera=new $t(55,e/t,.1,1e3),this.camera.position.set(1.5,1.2,1.5),this.camera.lookAt(0,0,0),this.camera.layers.enable(1),this.renderer=new Zu({antialias:this.config.antialias!==!1,powerPreference:"high-performance"}),this.renderer.setSize(e,t),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.shadowMap.enabled=this.config.shadows!==!1,this.renderer.shadowMap.type=Hd,this.container.appendChild(this.renderer.domElement),this.controls=new $_(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.05,this.controls.minDistance=.5,this.controls.maxDistance=8,this.ambientLight=new id(16777215,.55),this.scene.add(this.ambientLight),this.directionalLight=new nd(16777215,.85),this.directionalLight.position.set(2,4,2),this.directionalLight.castShadow=this.config.shadows!==!1,this.directionalLight.shadow.mapSize.width=512,this.directionalLight.shadow.mapSize.height=512;const n=this.directionalLight.shadow.camera;n.left=n.bottom=-1.2,n.right=n.top=1.2,n.near=.1,n.far=8,this.scene.add(this.directionalLight),this.transformControls=new Q_(this.camera,this.renderer.domElement),this.transformControls.setMode("translate"),this.transformControls.setSpace("world"),this.transformControls.setSize(this._gizmoBaseSize),this.transformControls.layers.enableAll(),this.transformControls.addEventListener("dragging-changed",i=>{this.controls.enabled=!i.value}),this.transformControls.addEventListener("objectChange",()=>this._onGizmoObjectChange()),this.postProcessing=new xx(this.renderer,this.scene,this.camera),window.addEventListener("resize",()=>this.onResize())}getPropMeshForProp(e){var t;for(const n of this.propMeshes)if(((t=n.userData)==null?void 0:t.prop)===e)return n;return null}setPropGizmoAttached(e,t,n){if(this.detachPropGizmo(),!e||!this.transformControls)return;const i=this.getPropMeshForProp(e);i&&(this._gizmoTileConfig=t,this._gizmoHeightMap=n,this.transformControls.attach(i),this._applyGizmoSnap(),this.transformControls.parent||this.scene.add(this.transformControls))}detachPropGizmo(){this.transformControls&&(this.transformControls.detach(),this.transformControls.parent&&this.scene.remove(this.transformControls)),this._gizmoTileConfig=null,this._gizmoHeightMap=null}setGizmoMode(e){this.transformControls&&this.transformControls.setMode(e)}setGizmoSpace(e){this.transformControls&&this.transformControls.setSpace(e)}setGizmoSnap(e){this._gizmoSnapEnabled=!!e,this._applyGizmoSnap()}isGizmoSnapEnabled(){return this._gizmoSnapEnabled}_applyGizmoSnap(){if(!this.transformControls)return;if(!this._gizmoSnapEnabled){this.transformControls.translationSnap=null,this.transformControls.rotationSnap=null,this.transformControls.scaleSnap=null;return}const e=this._gizmoTileConfig,t=(e==null?void 0:e.tilesX)??8,n=(e==null?void 0:e.tilesY)??t,i=Math.min(1/t,1/n);this.transformControls.translationSnap=i,this.transformControls.rotationSnap=Math.PI/12,this.transformControls.scaleSnap=.1}_onGizmoObjectChange(){var C,U,z,D,N,H;const e=(C=this.transformControls)==null?void 0:C.object;if(!e||!((U=e.userData)!=null&&U.prop)||!this._gizmoTileConfig||!this._gizmoHeightMap)return;const t=e.userData.prop,{tileSize:n,tilesX:i,tilesY:r}=this._gizmoTileConfig,o=i??1,a=r??1,l=this._gizmoHeightMap.length-1,c=e.position,h=(c.x+.5)*o,u=(.5-c.y)*a,d=Math.max(0,Math.min(i-1,Math.floor(h-.5))),f=Math.max(0,Math.min(r-1,Math.floor(u-.5))),g=h-d-.5,v=u-f-.5,m=(-e.rotation.z*180/Math.PI+360)%360,p=En(t.type);p==null||p.defaultScale;const _=1/o,x=e.scale.x/_,M=Math.max(.25,Math.min(100,x)),y=n??8,b=Math.min(l,Math.max(0,Math.floor((d+.5)*y))),T=Math.min(l,Math.max(0,Math.floor((f+.5)*y))),L=(((z=this._gizmoHeightMap[T])==null?void 0:z[b])??0)*this.config.heightScale+.02,S=Math.max(-.5,Math.min(.5,(e.position.z-L-.01)/this.config.heightScale)),E={chunkX:d,chunkY:f,offsetX:g,offsetY:v,offsetZ:S,rotation:m,scale:M};Object.assign(t,E),e.position.z=L+.01+S*this.config.heightScale,(D=this._onPropTransformChange)==null||D.call(this,t,E),(N=this.postProcessing)!=null&&N.isEnabled()?this.postProcessing.render():(H=this.renderer)==null||H.render(this.scene,this.camera)}onResize(){var n;const e=this.container.clientWidth,t=this.container.clientHeight;this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t),(n=this.postProcessing)==null||n.setSize(e,t)}setPixelRatio(e){var r;const t=Math.max(.5,Math.min(2,parseFloat(e)||1));this.renderer.setPixelRatio(t);const n=this.container.clientWidth,i=this.container.clientHeight;this.renderer.setSize(n,i),(r=this.postProcessing)==null||r.setSize(n,i)}render(e){var v;if(!(e!=null&&e.heightMap))return;this.hoverOverlayMesh&&(this.islandMesh&&this.islandMesh.remove(this.hoverOverlayMesh),this.hoverOverlayMesh.geometry.dispose(),this.hoverOverlayMesh.material.dispose(),this.hoverOverlayMesh=null),this._clearRampPreview(),this._clearContourOverlay(),this._clearBuildings(),this._clearGridOverlay(),this.islandMesh&&(this.scene.remove(this.islandMesh),this.islandMesh.geometry.dispose(),this.islandMesh.material.dispose()),this.waterMesh&&(this.scene.remove(this.waterMesh),this.waterMesh.geometry.dispose(),this.waterMesh.material.dispose());const{heightMap:t,config:n}=e;this.pathTiles=e.pathTiles?new Set(e.pathTiles):new Set;const i=(n==null?void 0:n.gridSize)??t.length-1,r=(n==null?void 0:n.seaLevel)??this.config.seaLevel;this.config.seaLevel=r,this.config.theme=e.theme??(n==null?void 0:n.theme)??"normal";const o=Ph(this.config.theme),a=(n==null?void 0:n.tileSize)??(n==null?void 0:n.chunkSize)??8;(n==null?void 0:n.tilesX)??Math.floor(i/a);const l=1,c=i,h=new ri(l,l,c,c),u=h.attributes.position,d=u.count,f=new Float32Array(d*3);for(let m=0;m<d;m++){const p=Math.floor(m%(c+1)),_=Math.floor(m/(c+1)),x=((v=t[_])==null?void 0:v[p])??0;u.setZ(m,x*this.config.heightScale);const M=Math.floor(p/a),y=Math.floor(_/a),b=`${M},${y}`,T=this.pathTiles.has(b)?this.config.pathColor:Rh(x,r,o),[L,S,E]=Ch(T);f[m*3]=L,f[m*3+1]=S,f[m*3+2]=E}h.setAttribute("color",new An(f,3)),h.computeVertexNormals();const g=new _s({vertexColors:this.config.useVertexColors,flatShading:!1,wireframe:this.config.wireframe});if(this.islandMesh=new le(h,g),this.islandMesh.rotation.x=-Math.PI/2,this.islandMesh.receiveShadow=!0,this.islandMesh.castShadow=!0,this.scene.add(this.islandMesh),this.config.showWater){const m=new ri(l*1.5,l*1.5,1,1),p=new _s({color:this.config.waterColor,transparent:!0,opacity:.75});this.waterMesh=new le(m,p),this.waterMesh.rotation.x=-Math.PI/2,this.waterMesh.position.y=-.02,this.scene.add(this.waterMesh)}}setHoverOverlay(e,t){var x,M;if(this.hoverOverlayMesh&&((x=this.islandMesh)==null||x.remove(this.hoverOverlayMesh),this.hoverOverlayMesh.geometry.dispose(),this.hoverOverlayMesh.material.dispose(),this.hoverOverlayMesh=null),!e||!t||!this.islandMesh)return;const{x0:n,y0:i,x1:r,y1:o}=e,a=t.length-1,l=Math.max(1,r-n),c=Math.max(1,o-i),h=Math.min(l,a),u=Math.min(c,a),d=(r-n)/a,f=(o-i)/a,g=new ri(d,f,h,u),v=g.attributes.position;for(let y=0;y<v.count;y++){const b=Math.min(a,n+y%(h+1)),T=Math.min(a,i+Math.floor(y/(h+1))),L=((M=t[T])==null?void 0:M[b])??0;v.setZ(y,L*this.config.heightScale+.012)}g.computeVertexNormals();const m=new In({color:16707722,transparent:!0,opacity:.5,depthTest:!0,depthWrite:!1});this.hoverOverlayMesh=new le(g,m),this.hoverOverlayMesh.layers.set(1);const p=(n+r)/(2*a)-.5,_=.5-(i+o)/(2*a);this.hoverOverlayMesh.position.set(p,_,0),this.islandMesh.add(this.hoverOverlayMesh)}_clearBuildings(){var e,t;for(const n of this.buildingMeshes)n.parent&&n.parent.remove(n),(e=n.geometry)==null||e.dispose(),(t=n.material)==null||t.dispose();this.buildingMeshes=[]}_clearGridOverlay(){this.gridOverlayMesh&&(this.gridOverlayMesh.parent&&this.gridOverlayMesh.parent.remove(this.gridOverlayMesh),this.gridOverlayMesh.geometry.dispose(),this.gridOverlayMesh.material.dispose(),this.gridOverlayMesh=null)}_clearPlacementPreview(){var e,t;this.placementPreviewMesh&&this.islandMesh&&(this.islandMesh.remove(this.placementPreviewMesh),(e=this.placementPreviewMesh.geometry)==null||e.dispose(),(t=this.placementPreviewMesh.material)==null||t.dispose(),this.placementPreviewMesh=null)}_clearBuildingHighlight(){var e,t;this.buildingHighlightMesh&&this.islandMesh&&(this.islandMesh.remove(this.buildingHighlightMesh),(e=this.buildingHighlightMesh.geometry)==null||e.dispose(),(t=this.buildingHighlightMesh.material)==null||t.dispose(),this.buildingHighlightMesh=null)}_clearRampPreview(){var e,t;this.rampPreviewMesh&&this.islandMesh&&(this.islandMesh.remove(this.rampPreviewMesh),(e=this.rampPreviewMesh.geometry)==null||e.dispose(),(t=this.rampPreviewMesh.material)==null||t.dispose(),this.rampPreviewMesh=null)}setRampPreview(e,t,n){if(this._clearRampPreview(),!e||!t||!this.islandMesh||n<=0)return;const i=1/n,r=e.gx*i-.5,o=.5-e.gy*i,a=(e.h??0)*this.config.heightScale+.01,l=t.gx*i-.5,c=.5-t.gy*i,h=(t.h??0)*this.config.heightScale+.01,u=new St().setFromPoints([new I(r,o,a),new I(l,c,h)]),d=new ni({color:16498468,linewidth:2});this.rampPreviewMesh=new yn(u,d),this.rampPreviewMesh.layers.set(1),this.islandMesh.add(this.rampPreviewMesh)}_clearContourOverlay(){var e,t;this.contourOverlayMesh&&this.islandMesh&&(this.islandMesh.remove(this.contourOverlayMesh),(e=this.contourOverlayMesh.geometry)==null||e.dispose(),(t=this.contourOverlayMesh.material)==null||t.dispose(),this.contourOverlayMesh=null)}setContourOverlay(e,t,n=.1){var h,u,d,f;if(this._clearContourOverlay(),!e||!t||!this.islandMesh||n<=0)return;const i=t.length-1;if(i<=0)return;const r=1/i,o=[],a=(g,v,m,p,_,x)=>{o.push(g,v,m,p,_,x)};for(let g=n;g<1;g+=n)for(let v=0;v<i;v++)for(let m=0;m<i;m++){const p=((h=t[v])==null?void 0:h[m])??0,_=((u=t[v])==null?void 0:u[m+1])??0,x=((d=t[v+1])==null?void 0:d[m])??0,M=((f=t[v+1])==null?void 0:f[m+1])??0,y=(T,L)=>T<=g&&g<=L||L<=g&&g<=T,b=[];if(y(p,_)){const T=(g-p)/(_-p||1e-9);b.push([(m+T)*r-.5,.5-v*r,g*this.config.heightScale+.005])}if(y(_,M)){const T=(g-_)/(M-_||1e-9);b.push([(m+1)*r-.5,.5-(v+T)*r,g*this.config.heightScale+.005])}if(y(M,x)){const T=(g-M)/(x-M||1e-9);b.push([(m+1-T)*r-.5,.5-(v+1)*r,g*this.config.heightScale+.005])}if(y(x,p)){const T=(g-x)/(p-x||1e-9);b.push([m*r-.5,.5-(v+1-T)*r,g*this.config.heightScale+.005])}b.length>=2&&a(b[0][0],b[0][1],b[0][2],b[1][0],b[1][1],b[1][2])}if(o.length<6)return;const l=new St;l.setAttribute("position",new it(o,3)),l.setDrawRange(0,o.length/3);const c=new ni({color:959977,transparent:!0,opacity:.6});this.contourOverlayMesh=new Dr(l,c),this.contourOverlayMesh.layers.set(1),this.islandMesh.add(this.contourOverlayMesh)}setPlacementPreview(e,t,n,i,r,o,a,l,c=!0){var S;if(this._clearPlacementPreview(),e==null||t==null||!this.islandMesh||!r)return;const h=an(n);if(!h)return;const u=oi(n),d=u.width,f=u.height,g=r.length-1,v=o||8,m=a??Math.floor(g/v),p=l??Math.floor(g/v),_=(e+d/2)/m-.5,x=.5-(t+f/2)/p,M=Math.min(g,Math.floor((e+d/2)*v)),y=Math.min(g,Math.floor((t+f/2)*v)),b=(((S=r[y])==null?void 0:S[M])??0)*this.config.heightScale+.02,T=d*v/g,L=f*v/g;if(i){const E=Math.max(b*.5,.08),C=new ht(T,L,E),U=c?h.color:16096779,z=new In({color:U,transparent:!0,opacity:.6,depthTest:!0,depthWrite:!1,side:rn});this.placementPreviewMesh=new le(C,z),this.placementPreviewMesh.position.set(_,x,b+E*.5+.015),this.placementPreviewMesh.layers.set(1),this.islandMesh.add(this.placementPreviewMesh)}else{const E=new ri(T,L),C=new In({color:15680580,transparent:!0,opacity:.5,depthTest:!0,depthWrite:!1,side:rn});this.placementPreviewMesh=new le(E,C),this.placementPreviewMesh.position.set(_,x,b+.02),this.placementPreviewMesh.layers.set(1),this.islandMesh.add(this.placementPreviewMesh)}}setBuildingHighlight(e,t,n,i,r){var U;if(this._clearBuildingHighlight(),!e||!this.islandMesh||!t||!an(e.type))return;const a=Pn(e),l=a.width,c=a.height,h=t.length-1,u=n||8,d=i??Math.floor(h/u),f=r??Math.floor(h/u),g=e.chunkX??0,v=e.chunkY??0,m=(e.rotation??0)*(Math.PI/180),p=(g+l/2)/d-.5,_=.5-(v+c/2)/f,x=Math.min(h,Math.floor((g+l/2)*u)),M=Math.min(h,Math.floor((v+c/2)*u)),y=(((U=t[M])==null?void 0:U[x])??0)*this.config.heightScale+.02,b=l*u/h,T=c*u/h,L=Math.max(y*.5,.08),S=new ht(b,T,L+.02),E=new Jc(S);S.dispose();const C=new ni({color:16498468,linewidth:2});this.buildingHighlightMesh=new Dr(E,C),this.buildingHighlightMesh.position.set(p,_,y+L*.5),this.buildingHighlightMesh.rotation.z=-m,this.buildingHighlightMesh.layers.set(1),this.islandMesh.add(this.buildingHighlightMesh)}clearPlacementPreview(){this._clearPlacementPreview()}clearBuildingHighlight(){this._clearBuildingHighlight()}_clearProps(){for(const e of this.propMeshes)e.parent&&e.parent.remove(e),e.traverse(t=>{t.geometry&&t.geometry.dispose(),t.material&&t.material.dispose()});this.propMeshes=[]}_clearPropPlacementPreview(){this.propPlacementPreviewMesh&&this.islandMesh&&(this.islandMesh.remove(this.propPlacementPreviewMesh),this.propPlacementPreviewMesh.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&e.material.dispose()}),this.propPlacementPreviewMesh=null)}_clearPropHighlight(){this.propHighlightMesh&&this.islandMesh&&(this.islandMesh.remove(this.propHighlightMesh),this.propHighlightMesh.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&e.material.dispose()}),this.propHighlightMesh=null),this._lastHighlightedProp=null}_createPropPlaceholderGeometry(e,t=.08){switch(e){case"sphere":return new fi(t,8,6);case"cylinder":return new Mt(t*.4,t*.5,t*1.5,8);case"cone":return new tr(t*.6,t*1.2,8);case"box":return new ht(t*.4,t*1.2,t*.2);case"signpost":return new Mt(t*.15,t*.2,t*1.2,8);default:return new fi(t,8,6)}}renderProps(e,t,n,i,r,o={}){var d,f;if(this.detachPropGizmo(),this._clearProps(),!this.islandMesh||!t||!Array.isArray(e))return;const a=t.length-1,l=n||8,c=i??Math.floor(a/l),h=r??Math.floor(a/l),u=new Set;for(const g of e){const v=En(g.type);if(!v)continue;const m=g.chunkX??0,p=g.chunkY??0,_=(g.rotation??0)*(Math.PI/180),x=(g.offsetX??0)/c,M=(g.offsetY??0)/h,y=(g.offsetZ??0)*this.config.heightScale,b=(m+.5)/c-.5+x,T=.5-(p+.5)/h-M,L=Math.min(a,Math.floor((m+.5)*l)),S=Math.min(a,Math.floor((p+.5)*l)),E=(((d=t[S])==null?void 0:d[L])??0)*this.config.heightScale+.02,C=rM(g.type);v!=null&&v.fbxPath&&!((f=C.userData)!=null&&f.fromPropCache)&&u.add(g.type);const U=v.defaultScale??1,D=1/c*(g.scale??U);C.scale.setScalar(D),C.position.set(b,T,E+.01+y),C.rotation.z=-_,C.traverse(N=>{N.isMesh&&(N.castShadow=!0,N.receiveShadow=!0)}),C.userData.prop=g,this.islandMesh.add(C),this.propMeshes.push(C)}for(const g of u)nM(g).then(()=>{var v;(v=o.onMeshLoaded||this._onPropMeshLoaded)==null||v()})}setPropPlacementPreview(e,t,n,i,r,o,a,l){var T;if(this._clearPropPlacementPreview(),e==null||t==null||!this.islandMesh||!r)return;const c=En(n);if(!c)return;const h=r.length-1,u=o||8,d=a??Math.floor(h/u),f=l??Math.floor(h/u),g=(e+.5)/d-.5,v=.5-(t+.5)/f,m=Math.min(h,Math.floor((e+.5)*u)),p=Math.min(h,Math.floor((t+.5)*u)),_=(((T=r[p])==null?void 0:T[m])??0)*this.config.heightScale+.02,x=c.defaultScale??1,y=1/d*x,b=Ua(n);b.scale.setScalar(y),b.position.set(g,v,_+.01),b.rotation.z=0,b.traverse(L=>{L.isMesh&&L.material&&(L.material=new In({color:i?c.color:15680580,transparent:!0,opacity:i?.6:.5,depthTest:!0,depthWrite:!1}))}),this.propPlacementPreviewMesh=b,this.propPlacementPreviewMesh.layers.set(1),this.islandMesh.add(this.propPlacementPreviewMesh)}setPropHighlight(e,t,n,i,r){var C;if(e===this._lastHighlightedProp||(this._lastHighlightedProp=e,this._clearPropHighlight(),!e||!this.islandMesh||!t))return;const o=En(e.type);if(!o)return;const a=t.length-1,l=n||8,c=i??Math.floor(a/l),h=r??Math.floor(a/l),u=e.chunkX??0,d=e.chunkY??0,f=(e.rotation??0)*(Math.PI/180),g=(e.offsetX??0)/c,v=(e.offsetY??0)/h,m=(e.offsetZ??0)*this.config.heightScale,p=(u+.5)/c-.5+g,_=.5-(d+.5)/h-v,x=Math.min(a,Math.floor((u+.5)*l)),M=Math.min(a,Math.floor((d+.5)*l)),y=(((C=t[M])==null?void 0:C[x])??0)*this.config.heightScale+.02,b=o.defaultScale??1,L=1/c*(e.scale??b),S=Ua(e.type);S.scale.setScalar(L),S.position.set(p,_,y+.01+m),S.rotation.z=-f,this.islandMesh.add(S),S.updateMatrixWorld(!0);const E=new Sn;S.traverse(U=>{if(U.isMesh&&U.geometry){const z=new Jc(U.geometry),D=new Dr(z,new ni({color:16498468}));D.matrix.copy(U.matrixWorld),D.matrixAutoUpdate=!1,E.add(D)}}),this.islandMesh.remove(S),this.propHighlightMesh=E,this.propHighlightMesh.layers.set(1),this.islandMesh.add(this.propHighlightMesh),this._lastHighlightedProp=e}clearPropPlacementPreview(){this._clearPropPlacementPreview()}clearPropHighlight(){this._clearPropHighlight()}pickPropAt(e){var n,i;if(!this.camera||!((n=this.propMeshes)!=null&&n.length))return null;this._pickRaycaster||(this._pickRaycaster=new nr),this._pickRaycaster.setFromCamera(e,this.camera),this._pickRaycaster.layers.set(0);const t=this._pickRaycaster.intersectObjects(this.propMeshes,!0);for(const r of t){let o=r.object;for(;o;){if((i=o.userData)!=null&&i.prop)return o.userData.prop;o=o.parent}}return null}renderBuildings(e,t,n,i,r){var h;if(this._clearBuildings(),!this.islandMesh||!t||!Array.isArray(e))return;const o=t.length-1,a=n||8,l=i??Math.floor(o/a),c=r??Math.floor(o/a);for(const u of e){const d=an(u.type);if(!d)continue;const f=Pn(u),g=f.width,v=f.height,m=u.chunkX??0,p=u.chunkY??0,_=(u.rotation??0)*(Math.PI/180),x=(m+g/2)/l-.5,M=.5-(p+v/2)/c,y=Math.min(o,Math.floor((m+g/2)*a)),b=Math.min(o,Math.floor((p+v/2)*a)),T=(((h=t[b])==null?void 0:h[y])??0)*this.config.heightScale+.02,L=g*a/o,S=v*a/o,E=Math.max(T*.5,.08),C=new ht(L,S,E),U=new _s({color:d.color}),z=new le(C,U);z.position.set(x,M,T+E*.5),z.rotation.z=-_,z.castShadow=!0,z.receiveShadow=!0,this.islandMesh.add(z),this.buildingMeshes.push(z)}}setTileGridOverlay(e,t,n,i){if(this._clearGridOverlay(),!e||!this.islandMesh||t<=0||n<=0)return;const r=[];for(let l=0;l<=t;l++){const c=l/t-.5;r.push(c,-.5,.01,c,.5,.01)}for(let l=0;l<=n;l++){const c=l/n-.5;r.push(-.5,c,.01,.5,c,.01)}const o=new St;o.setAttribute("position",new it(r,3)),o.setDrawRange(0,r.length/3);const a=new ni({color:959977,transparent:!0,opacity:.4});this.gridOverlayMesh=new Dr(o,a),this.gridOverlayMesh.layers.set(1),this.islandMesh.add(this.gridOverlayMesh)}setZoneHintsOverlay(e,t,n,i,r,o){var f;if(this.zoneHintsOverlayMesh&&(this.zoneHintsOverlayMesh.parent&&this.zoneHintsOverlayMesh.parent.remove(this.zoneHintsOverlayMesh),this.zoneHintsOverlayMesh.geometry.dispose(),this.zoneHintsOverlayMesh.material.dispose(),this.zoneHintsOverlayMesh=null),!e||!this.islandMesh||!t||t.size===0||!n)return;const a=n.length-1,l=[],c=[];let h=0;for(const g of t){const[v,m]=g.split(",").map(Number),p=v/r-.5,_=.5-(m+1)/o,x=(v+1)/r-.5,M=.5-m/o,y=Math.min(a,Math.floor((v+.5)*ts)),b=Math.min(a,Math.floor((m+.5)*ts)),T=(((f=n[b])==null?void 0:f[y])??0)*this.config.heightScale+.02;l.push(p,_,T,x,_,T,x,M,T,p,M,T),c.push(h,h+1,h+2,h,h+2,h+3),h+=4}if(l.length===0)return;const u=new St;u.setAttribute("position",new it(l,3)),u.setIndex(c);const d=new In({color:2278750,transparent:!0,opacity:.25,depthTest:!0,depthWrite:!1,side:rn});this.zoneHintsOverlayMesh=new le(u,d),this.zoneHintsOverlayMesh.layers.set(1),this.islandMesh.add(this.zoneHintsOverlayMesh)}updateFromHeightMap(e,t,n){var h;if(!this.islandMesh||!e)return;t!=null&&(this.pathTiles=t instanceof Set?t:new Set(t));const i=this.islandMesh.geometry.attributes.position,r=this.islandMesh.geometry.attributes.color,o=Math.sqrt(i.count)-1,a=this.config.seaLevel,l=n??Math.max(1,Math.floor(o/16)),c=Ph(this.config.theme??"normal");for(let u=0;u<i.count;u++){const d=Math.floor(u%(o+1)),f=Math.floor(u/(o+1)),g=((h=e[f])==null?void 0:h[d])??0;i.setZ(u,g*this.config.heightScale);const v=Math.floor(d/l),m=Math.floor(f/l),p=`${v},${m}`,_=this.pathTiles.has(p)?this.config.pathColor:Rh(g,a,c),[x,M,y]=Ch(_);r.setXYZ(u,x,M,y)}i.needsUpdate=!0,r.needsUpdate=!0,this.islandMesh.geometry.computeVertexNormals()}setConfig(e){Object.assign(this.config,e),this.directionalLight&&"shadows"in e&&(this.directionalLight.castShadow=this.config.shadows!==!1),this.renderer&&"shadows"in e&&(this.renderer.shadowMap.enabled=this.config.shadows!==!1)}getMesh(){return this.islandMesh}getScene(){return this.scene}getCamera(){return this.camera}getRenderer(){return this.renderer}getControls(){return this.controls}getPostProcessing(){return this.postProcessing??null}setInputMode(e){this.controls&&(this._inputMode=e,this._spaceHeld=!1,this._removeSpaceListeners(),e==="edit"?(this._applyEditMouseButtons(),this._spaceKeyDown=t=>{var n,i;t.code==="Space"&&!t.repeat&&!((i=(n=document.activeElement)==null?void 0:n.closest)!=null&&i.call(n,"input, textarea, select"))&&(t.preventDefault(),this._spaceHeld=!0,this._applyEditMouseButtons())},this._spaceKeyUp=t=>{t.code==="Space"&&!t.repeat&&this._spaceHeld&&(t.preventDefault(),this._spaceHeld=!1,this._applyEditMouseButtons())},window.addEventListener("keydown",this._spaceKeyDown),window.addEventListener("keyup",this._spaceKeyUp)):(this.controls.mouseButtons.LEFT=sn.ROTATE,this.controls.mouseButtons.MIDDLE=sn.DOLLY,this.controls.mouseButtons.RIGHT=sn.PAN))}_applyEditMouseButtons(){this.controls&&(this._spaceHeld?(this.controls.mouseButtons.LEFT=sn.ROTATE,this.controls.mouseButtons.RIGHT=sn.PAN):(this.controls.mouseButtons.LEFT=null,this.controls.mouseButtons.RIGHT=sn.ROTATE),this.controls.mouseButtons.MIDDLE=sn.DOLLY)}isSpaceHeld(){return this._spaceHeld===!0}_removeSpaceListeners(){this._spaceKeyDown&&(window.removeEventListener("keydown",this._spaceKeyDown),window.removeEventListener("keyup",this._spaceKeyUp),this._spaceKeyDown=null,this._spaceKeyUp=null)}animate(){var i,r,o,a;requestAnimationFrame(()=>this.animate()),(i=this.controls)==null||i.update(),this._frameCount++;const e=(r=this.transformControls)==null?void 0:r.object;if(e&&this.camera&&this._frameCount%this._gizmoSizeUpdateInterval===0){e.getWorldPosition(this._gizmoPos);const l=this.camera.position.distanceTo(this._gizmoPos),c=this._gizmoBaseSize*(l/this._gizmoRefDistance);this.transformControls.setSize(Math.max(.3,Math.min(1.5,c)))}const t=performance.now(),n=(t-this._lastFrameTime)/1e3;this._lastFrameTime=t,(o=this.postProcessing)!=null&&o.isEnabled()?this.postProcessing.render(n):(a=this.renderer)==null||a.render(this.scene,this.camera)}}const hM={sea:.12,beach:.2,grass:.35,rock:.55,snow:.75};class uM{constructor(e){this.visualizer=e,this.raycaster=new nr,this.mouse=new _e,this.isEditing=!1,this.brushMode="raise",this.brushSizeInTiles=1,this.brushStrength=.02,this.brushTargetHeight=.35,this.heightMap=null,this.gridSize=0,this.tileSize=8,this.tilesX=0,this.tilesY=0,this.seaLevel=.12,this._boundHandleMouse=this._handleMouse.bind(this),this.onHeightAtCursor=null,this.onBeforeBrush=null,this.onAfterBrush=null,this.onHoverTile=null,this.applyOnClickOnly=!1,this.canPaint=null,this.elevMin=0,this.elevMax=1,this.rampPointA=null,this.onRampPreview=null}setElevationClamp(e,t){this.elevMin=e!=null?Math.max(0,Math.min(1,e)):0,this.elevMax=t!=null?Math.max(0,Math.min(1,t)):1}setHeightMap(e){this.heightMap=e?e.map(t=>[...t]):null,this.gridSize=this.heightMap?this.heightMap.length-1:0}setTileConfig(e,t,n){this.tileSize=e||8,this.tilesX=t||Math.floor(this.gridSize/this.tileSize),this.tilesY=n||Math.floor(this.gridSize/this.tileSize)}getHeightMap(){return this.heightMap}setBrushSizeInTiles(e){this.brushSizeInTiles=Math.max(1,Math.min(5,e))}setBrushStrength(e){this.brushStrength=Math.max(.001,Math.min(.2,e))}setBrushMode(e){this.brushMode=e,e!=="ramp"&&(this.rampPointA=null)}setBrushTargetHeight(e){this.brushTargetHeight=Math.max(0,Math.min(1,e))}setSeaLevel(e){this.seaLevel=e}setApplyOnClickOnly(e){this.applyOnClickOnly=!!e}setCanPaint(e){this.canPaint=typeof e=="function"?e:null}enable(e){this.domElement=e,e.addEventListener("mousedown",this._boundHandleMouse),e.addEventListener("mousemove",this._boundHandleMouse),e.addEventListener("mouseup",this._boundHandleMouse),e.addEventListener("mouseleave",this._boundHandleMouse),this.isEditing=!0}disable(){this.domElement&&(this.domElement.removeEventListener("mousedown",this._boundHandleMouse),this.domElement.removeEventListener("mousemove",this._boundHandleMouse),this.domElement.removeEventListener("mouseup",this._boundHandleMouse),this.domElement.removeEventListener("mouseleave",this._boundHandleMouse)),this.isEditing=!1,this.onHeightAtCursor&&this.onHeightAtCursor(null),this.onHoverTile&&this.onHoverTile(null)}_handleMouse(e){if(!this.heightMap||!this.visualizer.getMesh())return;const t=this.domElement.getBoundingClientRect();if(this.mouse.x=(e.clientX-t.left)/t.width*2-1,this.mouse.y=-((e.clientY-t.top)/t.height)*2+1,e.type==="mouseup"||e.type==="mouseleave"){e.type==="mouseleave"&&(this.onHeightAtCursor&&this.onHeightAtCursor(null),this.onHoverTile&&this.onHoverTile(null),this.onRampPreview&&this.onRampPreview(null,null)),e.type==="mouseup"&&e.buttons===2&&this.brushMode==="ramp"&&(this.rampPointA=null,this.onRampPreview&&this.onRampPreview(null,null));return}if(e.type==="mousemove"){const n=this._getTileAtCursor(),i=n?this.heightMap[n.gy][n.gx]:null;if(this.onHeightAtCursor&&this.onHeightAtCursor(i,n),this.brushMode==="ramp"&&this.rampPointA&&n&&this.onRampPreview?this.onRampPreview(this.rampPointA,{gx:n.gx,gy:n.gy,h:i}):this.brushMode==="ramp"&&!this.rampPointA&&this.onRampPreview&&this.onRampPreview(null,null),this.onHoverTile&&n){const r=this.brushSizeInTiles,o=this.tileSize,a=Math.floor(r/2),l=Math.max(0,n.tx-a),c=Math.max(0,n.ty-a),h=Math.min(this.tilesX,n.tx-a+r),u=Math.min(this.tilesY,n.ty-a+r),d=l*o,f=c*o,g=Math.min(this.gridSize+1,h*o+1),v=Math.min(this.gridSize+1,u*o+1);this.onHoverTile({t0x:l,t0y:c,t1x:h,t1y:u,x0:d,y0:f,x1:g,y1:v})}else this.onHoverTile&&this.onHoverTile(null);this.brushMode!=="ramp"&&e.buttons===1&&!this.applyOnClickOnly&&(!this.canPaint||this.canPaint())&&this._applyBrush(!1);return}if(e.type==="mousedown"&&e.buttons===1&&(!this.canPaint||this.canPaint())){const n=this._getTileAtCursor();this.brushMode==="ramp"?this._handleRampClick(n):this._applyBrush(!0)}}_handleRampClick(e){if(!e||!this.heightMap)return;const t=this.heightMap[e.gy][e.gx];if(!this.rampPointA){this.rampPointA={gx:e.gx,gy:e.gy,h:t};return}const n=this.rampPointA,i={gx:e.gx,gy:e.gy,h:this.heightMap[e.gy][e.gx]};n.gx===i.gx&&n.gy===i.gy||(this.onBeforeBrush&&this.onBeforeBrush(),this._applyRamp(n,i),this.rampPointA=null,this.onRampPreview&&this.onRampPreview(null,null),this.visualizer.updateFromHeightMap(this.heightMap),this.onAfterBrush&&this.onAfterBrush())}_applyRamp(e,t){const n=Math.abs(t.gx-e.gx),i=Math.abs(t.gy-e.gy),r=Math.max(n,i,1);Math.sqrt((t.gx-e.gx)**2+(t.gy-e.gy)**2);for(let o=0;o<=r;o++){const a=o/r,l=Math.round(e.gx+(t.gx-e.gx)*a),c=Math.round(e.gy+(t.gy-e.gy)*a);if(l<0||l>this.gridSize||c<0||c>this.gridSize)continue;const h=e.h+(t.h-e.h)*a;let u=Math.max(0,Math.min(2,h));(this.elevMin>0||this.elevMax<1)&&(u=Math.max(this.elevMin>0?this.elevMin:0,Math.min(this.elevMax<1?this.elevMax:2,u))),this.heightMap[c][l]=u}}_getTileAtCursor(){const e=this.visualizer.getMesh();if(!e||!this.heightMap)return null;this.raycaster.setFromCamera(this.mouse,this.visualizer.getCamera()),this.raycaster.layers.set(0);const t=this.raycaster.intersectObject(e,!1);if(t.length===0)return null;const n=t[0];let i,r;if(n.uv)i=Math.max(0,Math.min(1,n.uv.x)),r=Math.max(0,Math.min(1,1-n.uv.y));else{const h=n.point.clone();e.worldToLocal(h),i=Math.max(0,Math.min(1,h.x+.5)),r=Math.max(0,Math.min(1,.5-h.y))}if(this.tilesX<=0||this.tilesY<=0)return null;const o=Math.min(this.tilesX-1,Math.max(0,Math.floor(i*this.tilesX))),a=Math.min(this.tilesY-1,Math.max(0,Math.floor(r*this.tilesY))),l=Math.min(this.gridSize,Math.max(0,Math.round(i*this.gridSize))),c=Math.min(this.gridSize,Math.max(0,Math.round(r*this.gridSize)));return{tx:o,ty:a,gx:l,gy:c}}_getHeightAtCursor(){const e=this._getTileAtCursor();return e?this.heightMap[e.gy][e.gx]:null}_applyBrush(e=!1){if(!this.visualizer.getMesh()||!this.heightMap)return;const n=this._getTileAtCursor();if(!n)return;const{tx:i,ty:r}=n,o=this.brushSizeInTiles,a=this.tileSize,l=Math.floor(o/2),c=Math.max(0,i-l),h=Math.max(0,r-l),u=Math.min(this.tilesX,i-l+o),d=Math.min(this.tilesY,r-l+o),f=c*a,g=h*a,v=Math.min(this.gridSize+1,u*a+1),m=Math.min(this.gridSize+1,d*a+1),p=this.brushMode==="plateau"?this.heightMap[n.gy][n.gx]:null;e&&this.onBeforeBrush&&this.onBeforeBrush();let _=!1;if(this.brushMode==="smooth"){const x=this.heightMap.map(M=>[...M]);for(let M=g;M<m;M++)for(let y=f;y<v;y++){if(M>this.gridSize||y>this.gridSize)continue;let b=0,T=0;for(let C=-1;C<=1;C++)for(let U=-1;U<=1;U++){const z=y+U,D=M+C;z>=0&&z<=this.gridSize&&D>=0&&D<=this.gridSize&&(b+=this.heightMap[D][z],T++)}const L=T>0?b/T:this.heightMap[M][y],S=this.brushStrength*5;let E=Math.max(0,Math.min(2,this.heightMap[M][y]+(L-this.heightMap[M][y])*S));(this.elevMin>0||this.elevMax<1)&&(E=Math.max(this.elevMin>0?this.elevMin:0,Math.min(this.elevMax<1?this.elevMax:2,E))),x[M][y]=E,_=!0}for(let M=g;M<m;M++)for(let y=f;y<v;y++)M<=this.gridSize&&y<=this.gridSize&&(this.heightMap[M][y]=x[M][y])}else for(let x=g;x<m;x++)for(let M=f;M<v;M++){if(x>this.gridSize||M>this.gridSize)continue;let y=this.heightMap[x][M];this.brushMode==="raise"?y=Math.min(2,y+this.brushStrength):this.brushMode==="lower"?y=Math.max(0,y-this.brushStrength):this.brushMode==="flatten"?y=y+(this.brushTargetHeight-y)*this.brushStrength*5:this.brushMode==="absolute"?(y=y+(this.brushTargetHeight-y)*this.brushStrength*10,y=Math.max(0,Math.min(2,y))):this.brushMode==="set"?y=this.brushTargetHeight:this.brushMode==="plateau"&&p!=null&&(y=y+(p-y)*this.brushStrength*8,y=Math.max(0,Math.min(2,y))),(this.elevMin>0||this.elevMax<1)&&(y=Math.max(this.elevMin>0?this.elevMin:0,Math.min(this.elevMax<1?this.elevMax:2,y))),this.heightMap[x][M]=y,_=!0}_&&(this.visualizer.updateFromHeightMap(this.heightMap),this.onAfterBrush&&this.onAfterBrush())}}class dM{constructor(e){this.visualizer=e,this.raycaster=new nr,this.mouse=new _e,this.buildings=[],this.heightMap=null,this.gridSize=0,this.tileSize=8,this.tilesX=0,this.tilesY=0,this.seaLevel=.12,this.selectedType="tavern",this.isPlacing=!1,this.domElement=null,this._boundHandleMouse=this._handleMouse.bind(this),this.onBuildingsChange=null,this.onHeightMapChange=null,this.onPlacementHover=null,this.onConnectivityWarning=null,this.connectivityCheckEnabled=!0,this.onBuildingHover=null,this.onBuildingSelect=null,this._boundHandleMouseMove=this._handleMouseMove.bind(this)}setHeightMap(e){this.heightMap=e?e.map(t=>[...t]):null,this.gridSize=this.heightMap?this.heightMap.length-1:0}setTileConfig(e,t,n){this.tileSize=e||8,this.tilesX=t??Math.floor(this.gridSize/this.tileSize),this.tilesY=n??Math.floor(this.gridSize/this.tileSize)}setSeaLevel(e){this.seaLevel=e??.12}setBuildings(e,t={}){this.buildings=Array.isArray(e)?t.shared?e:e.map(n=>({...n})):[]}getBuildings(){return this.buildings.map(e=>({...e}))}getViableTiles(){const e=new Set;if(!this.heightMap||!this.tilesX||!this.tilesY)return e;const t=this.selectedType;for(let n=0;n<this.tilesY;n++)for(let i=0;i<this.tilesX;i++)this._canPlace(t,i,n)&&e.add(`${i},${n}`);return e}setSelectedType(e){rd[e]&&(this.selectedType=e)}enable(e,t={}){this.domElement=e,this._selectionOnly=!!t.selectionOnly,e.addEventListener("mousedown",this._boundHandleMouse),e.addEventListener("mousemove",this._boundHandleMouseMove),this.isPlacing=!this._selectionOnly}disable(){this.domElement&&(this.domElement.removeEventListener("mousedown",this._boundHandleMouse),this.domElement.removeEventListener("mousemove",this._boundHandleMouseMove)),this.isPlacing=!1,this._selectionOnly=!1,this.onPlacementHover&&this.onPlacementHover(null,null,!1),this.onBuildingHover&&this.onBuildingHover(null)}_updateMouseFromEvent(e){if(!this.domElement)return;const t=this.domElement.getBoundingClientRect();this.mouse.x=(e.clientX-t.left)/t.width*2-1,this.mouse.y=-((e.clientY-t.top)/t.height)*2+1}_handleMouseMove(e){if(!this.heightMap||!this.visualizer.getMesh()||!this.domElement)return;this._updateMouseFromEvent(e);const t=this._getTileAtCursor();if(!t){this.onPlacementHover&&this.onPlacementHover(null,null,!1),this.onBuildingHover&&this.onBuildingHover(null);return}const{tx:n,ty:i}=t,r=this._getBuildingAtTile(n,i);if(r)this.onPlacementHover&&this.onPlacementHover(null,null,!1),this.onBuildingHover&&this.onBuildingHover(r);else{if(this._selectionOnly)this.onPlacementHover&&this.onPlacementHover(null,null,!1,!0);else{const o=this._canPlace(this.selectedType,n,i);let a=!0;if(o&&this.connectivityCheckEnabled&&this.buildings.length>0){const l={tileSize:this.tileSize,tilesX:this.tilesX,tilesY:this.tilesY,seaLevel:this.seaLevel};a=Ah(this.selectedType,n,i,this.buildings,this.heightMap,l)}this.onPlacementHover&&this.onPlacementHover(n,i,o,a)}this.onBuildingHover&&this.onBuildingHover(null)}}_getTileAtCursor(){const e=this.visualizer.getMesh();if(!e||!this.heightMap)return null;this.raycaster.setFromCamera(this.mouse,this.visualizer.getCamera()),this.raycaster.layers.set(0);const t=this.raycaster.intersectObject(e,!1);if(t.length===0)return null;const n=t[0];let i,r;if(n.uv)i=Math.max(0,Math.min(1,n.uv.x)),r=Math.max(0,Math.min(1,1-n.uv.y));else{const l=n.point.clone();e.worldToLocal(l),i=Math.max(0,Math.min(1,l.x+.5)),r=Math.max(0,Math.min(1,.5-l.y))}if(this.tilesX<=0||this.tilesY<=0)return null;const o=Math.min(this.tilesX-1,Math.max(0,Math.floor(i*this.tilesX))),a=Math.min(this.tilesY-1,Math.max(0,Math.floor(r*this.tilesY)));return{tx:o,ty:a}}_getBuildingAtTile(e,t){for(const n of this.buildings){const i=oi(n.type),r=i.width,o=i.height;if(e>=n.chunkX&&e<n.chunkX+r&&t>=n.chunkY&&t<n.chunkY+o)return n}return null}flattenRegion(e,t,n,i,r){var p;if(!an(r)||!this.heightMap)return;const a=this.tileSize,l=this.heightMap.length-1,c=Math.max(0,e*a),h=Math.max(0,t*a),u=Math.min(l,(e+n)*a),d=Math.min(l,(t+i)*a);let f=0,g=0;for(let _=h;_<=d;_++)for(let x=c;x<=u;x++){const M=((p=this.heightMap[_])==null?void 0:p[x])??0;M>this.seaLevel&&(f+=M,g++)}const v=g>0?f/g:this.seaLevel+.02,m=this.seaLevel+.02;for(let _=h;_<=d;_++)for(let x=c;x<=u;x++){if(!this.heightMap[_])continue;const M=this.heightMap[_][x]??0;la(r)&&M<=this.seaLevel?this.heightMap[_][x]=m:this.heightMap[_][x]=v}this.onHeightMapChange&&this.onHeightMapChange(this.heightMap.map(_=>[..._]))}_flattenUnderBuilding(e,t,n){const i=oi(e);this.flattenRegion(t,n,i.width,i.height,e)}canPlaceAtFootprint(e,t,n,i,r,o=null){var h;const a=la(r);if(!a&&(e+n>this.tilesX||t+i>this.tilesY||e<0||t<0))return!1;const l=this.tileSize;let c=0;for(let u=0;u<i;u++)for(let d=0;d<n;d++){const f=e+d,g=t+u;if(f<0||f>=this.tilesX||g<0||g>=this.tilesY)continue;const v=Math.min(this.gridSize,f*l),m=Math.min(this.gridSize,g*l);if((((h=this.heightMap[m])==null?void 0:h[v])??0)>this.seaLevel)c++;else if(!a)return!1}if(c===0||a&&(e+n<=0||t+i<=0||e>=this.tilesX||t>=this.tilesY))return!1;for(const u of this.buildings){if(o&&u.chunkX===o.chunkX&&u.chunkY===o.chunkY)continue;const d=Pn(u),f=u.chunkX+d.width,g=u.chunkY+d.height;if(e<f&&e+n>u.chunkX&&t<g&&t+i>u.chunkY)return!1}return!0}_canPlace(e,t,n){var u;if(!an(e))return!1;const r=oi(e),o=r.width,a=r.height,l=la(e);if(!l&&(t+o>this.tilesX||n+a>this.tilesY||t<0||n<0))return!1;const c=this.tileSize;let h=0;for(let d=0;d<a;d++)for(let f=0;f<o;f++){const g=t+f,v=n+d;if(g<0||g>=this.tilesX||v<0||v>=this.tilesY)continue;const m=Math.min(this.gridSize,g*c),p=Math.min(this.gridSize,v*c);if((((u=this.heightMap[p])==null?void 0:u[m])??0)>this.seaLevel)h++;else if(!l)return!1}if(h===0||l&&(t+o<=0||n+a<=0||t>=this.tilesX||n>=this.tilesY))return!1;for(const d of this.buildings){const f=Pn(d),g=d.chunkX+f.width,v=d.chunkY+f.height;if(t<g&&t+o>d.chunkX&&n<v&&n+a>d.chunkY)return!1}return!0}_handleMouse(e){if(e.type!=="mousedown"||e.buttons!==1||!this.heightMap||!this.visualizer.getMesh()||!this.domElement)return;this._updateMouseFromEvent(e);const t=this._getTileAtCursor();if(!t)return;const{tx:n,ty:i}=t,r=this._getBuildingAtTile(n,i);if(r)if(e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation(),this._selectionOnly)this.onBuildingSelect&&this.onBuildingSelect(r);else if(e.shiftKey)this.buildings=this.buildings.filter(o=>o!==r);else{if(an(r.type)){const a=[0,90,180,270],l=a.indexOf(r.rotation??0);r.rotation=a[(l+1)%4]}this.onBuildingSelect&&this.onBuildingSelect(r)}else if(!this._selectionOnly&&an(this.selectedType)&&this._canPlace(this.selectedType,n,i)){if(this.connectivityCheckEnabled&&this.buildings.length>0){const c={tileSize:this.tileSize,tilesX:this.tilesX,tilesY:this.tilesY,seaLevel:this.seaLevel};Ah(this.selectedType,n,i,this.buildings,this.heightMap,c)||this.onConnectivityWarning&&this.onConnectivityWarning()}this._flattenUnderBuilding(this.selectedType,n,i);const a=oi(this.selectedType),l=a.width*a.height*10;this.buildings.push({id:"b"+Date.now(),type:this.selectedType,chunkX:n,chunkY:i,rotation:0,width:a.width,height:a.height,cargoSize:l})}this._selectionOnly||(this.visualizer.renderBuildings(this.buildings,this.heightMap,this.tileSize,this.tilesX,this.tilesY),this.onBuildingsChange&&this.onBuildingsChange(this.getBuildings()))}}class fM{constructor(e){this.visualizer=e,this.raycaster=new nr,this.mouse=new _e,this.props=[],this.buildings=[],this.heightMap=null,this.gridSize=0,this.tileSize=8,this.tilesX=0,this.tilesY=0,this.seaLevel=.12,this.selectedType="rock_01",this.domElement=null,this._boundHandleMouse=this._handleMouse.bind(this),this._boundHandleMouseMove=this._handleMouseMove.bind(this),this._hoverRafId=null,this._lastHoverProp=null,this.onPropsChange=null,this.onPlacementHover=null,this.onPropHover=null,this.onPropSelect=null}setHeightMap(e){this.heightMap=e?e.map(t=>[...t]):null,this.gridSize=this.heightMap?this.heightMap.length-1:0}setTileConfig(e,t,n){this.tileSize=e||8,this.tilesX=t??Math.floor(this.gridSize/this.tileSize),this.tilesY=n??Math.floor(this.gridSize/this.tileSize)}setSeaLevel(e){this.seaLevel=e??.12}setProps(e){this.props=Array.isArray(e)?e.map(t=>({...t})):[]}setBuildings(e){this.buildings=Array.isArray(e)?e:[]}getProps(){return this.props.map(e=>({...e}))}setSelectedType(e){ad[e]&&(this.selectedType=e)}enable(e,t={}){this.domElement=e,this._selectionOnly=!!t.selectionOnly,e.addEventListener("mousedown",this._boundHandleMouse),e.addEventListener("mousemove",this._boundHandleMouseMove)}disable(){this.domElement&&(this.domElement.removeEventListener("mousedown",this._boundHandleMouse),this.domElement.removeEventListener("mousemove",this._boundHandleMouseMove)),this._hoverRafId!=null&&(cancelAnimationFrame(this._hoverRafId),this._hoverRafId=null),this._lastHoverProp=null,this.onPlacementHover&&this.onPlacementHover(null,null,!1),this.onPropHover&&this.onPropHover(null)}_updateMouseFromEvent(e){var i,r,o,a;if(!this.domElement)return;const t=(o=(r=(i=this.visualizer).getRenderer)==null?void 0:r.call(i))==null?void 0:o.domElement,n=((a=t==null?void 0:t.getBoundingClientRect)==null?void 0:a.call(t))??this.domElement.getBoundingClientRect();n.width<=0||n.height<=0||(this.mouse.x=(e.clientX-n.left)/n.width*2-1,this.mouse.y=-((e.clientY-n.top)/n.height)*2+1)}_getTileAtCursor(){const e=this.visualizer.getMesh();if(!e||!this.heightMap)return null;this.raycaster.setFromCamera(this.mouse,this.visualizer.getCamera()),this.raycaster.layers.set(0);const t=this.raycaster.intersectObject(e,!1);if(t.length===0)return null;const n=t[0];let i,r;if(n.uv)i=Math.max(0,Math.min(1,n.uv.x)),r=Math.max(0,Math.min(1,1-n.uv.y));else{const l=n.point.clone();e.worldToLocal(l),i=Math.max(0,Math.min(1,l.x+.5)),r=Math.max(0,Math.min(1,.5-l.y))}if(this.tilesX<=0||this.tilesY<=0)return null;const o=Math.min(this.tilesX-1,Math.max(0,Math.floor(i*this.tilesX))),a=Math.min(this.tilesY-1,Math.max(0,Math.floor(r*this.tilesY)));return{tx:o,ty:a}}_getPropAtTile(e,t){for(const n of this.props)if(n.chunkX===e&&n.chunkY===t)return n;return null}_isBuildingTile(e,t){for(const n of this.buildings){const i=Pn(n),r=i.width,o=i.height;if(e>=n.chunkX&&e<n.chunkX+r&&t>=n.chunkY&&t<n.chunkY+o)return!0}return!1}_canPlaceProp(e,t){var o;if(e<0||e>=this.tilesX||t<0||t>=this.tilesY||this._isBuildingTile(e,t))return!1;const n=Math.min(this.gridSize,e*this.tileSize),i=Math.min(this.gridSize,t*this.tileSize);return(((o=this.heightMap[i])==null?void 0:o[n])??0)>this.seaLevel}_handleMouseMove(e){!this.heightMap||!this.visualizer.getMesh()||!this.domElement||(this._updateMouseFromEvent(e),this._hoverRafId==null&&(this._hoverRafId=requestAnimationFrame(()=>{this._hoverRafId=null,this._processHover()})))}_processHover(){var n,i;if(!this.heightMap||!this.visualizer.getMesh()||!this.domElement)return;const t=((i=(n=this.visualizer).pickPropAt)==null?void 0:i.call(n,this.mouse))??null??(()=>{const r=this._getTileAtCursor();return r?this._getPropAtTile(r.tx,r.ty):null})();if(t!==this._lastHoverProp)if(this._lastHoverProp=t,t)this.onPlacementHover&&this.onPlacementHover(null,null,!1),this.onPropHover&&this.onPropHover(t);else{const r=this._getTileAtCursor();if(!r){this.onPlacementHover&&this.onPlacementHover(null,null,!1),this.onPropHover&&this.onPropHover(null);return}const{tx:o,ty:a}=r,l=this._canPlaceProp(o,a);this.onPlacementHover&&this.onPlacementHover(o,a,l),this.onPropHover&&this.onPropHover(null)}}_handleMouse(e){var r,o;if(e.type!=="mousedown"||e.buttons!==1||!this.heightMap||!this.visualizer.getMesh()||!this.domElement)return;this._updateMouseFromEvent(e);const n=((o=(r=this.visualizer).pickPropAt)==null?void 0:o.call(r,this.mouse))??null??(()=>{const a=this._getTileAtCursor();return a?this._getPropAtTile(a.tx,a.ty):null})();let i=!1;if(n)e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation(),e.shiftKey?(this.props=this.props.filter(a=>a!==n),i=!0):this.onPropSelect&&this.onPropSelect(n);else if(!this._selectionOnly){const a=this._getTileAtCursor();if(!a)return;const{tx:l,ty:c}=a,h=En(this.selectedType);if(h&&this._canPlaceProp(l,c)){const u=h.defaultScale??1;this.props.push({id:"p"+Date.now(),type:this.selectedType,chunkX:l,chunkY:c,rotation:0,offsetX:0,offsetY:0,offsetZ:0,scale:u}),i=!0}}i&&(this.visualizer.renderProps(this.props,this.heightMap,this.tileSize,this.tilesX,this.tilesY),this.onPropsChange&&this.onPropsChange(this.getProps()))}}function pM(s){const e={version:1,config:s.config,display:s.display??{},buildings:s.buildings??[],props:s.props??[],seed:s.seed,name:s.name??"",description:s.description??"",dangerous:s.dangerous??!1,appealing:s.appealing??!1,treasureLevel:s.treasureLevel??0,portType:s.portType??"none",hazard:s.hazard??"none",faction:s.faction??"neutral",rumors:s.rumors??"",theme:s.theme??"normal"};return s.heightMap!=null&&(e.heightMap=s.heightMap),JSON.stringify(e)}function Md(s){const e=JSON.parse(s);if(!e.config||typeof e.config!="object")throw new Error("Invalid island file: missing config");return{heightMap:Array.isArray(e.heightMap)?e.heightMap:null,config:e.config,display:e.display??{},buildings:Array.isArray(e.buildings)?e.buildings:[],props:Array.isArray(e.props)?e.props:[],seed:e.seed??null,name:e.name??"",description:e.description??"",dangerous:e.dangerous??!1,appealing:e.appealing??!1,treasureLevel:e.treasureLevel??0,portType:e.portType??"none",hazard:e.hazard??"none",faction:e.faction??"neutral",rumors:e.rumors??"",theme:e.theme??"normal"}}const Fn=document.getElementById("canvas-container"),mM=document.getElementById("regenerate"),gM=document.getElementById("stats"),as=document.getElementById("elevation-hud"),un=document.getElementById("build-mode-hud"),j=new cM(Fn);j.init();j.animate();j.setOnPropMeshLoaded(()=>{var i,r;if(!((i=P==null?void 0:P.props)!=null&&i.length))return;const s=P.config,e=(s==null?void 0:s.tileSize)??(s==null?void 0:s.chunkSize)??8,t=(s==null?void 0:s.tilesX)??Math.floor((((r=P.heightMap)==null?void 0:r.length)-1)/e),n=(s==null?void 0:s.tilesY)??t;j.renderProps(P.props,P.heightMap,e,t,n),Qt()});j.setOnPropTransformChange(s=>{Yt()});const Ue=new uM(j),ee=new dM(j),Te=new fM(j);let P=null,Ci=!1,mt=!1,Li="buildings",Ge=null,Ye=null,Oa=!0;const vM=20;let Ii=[],Qs=[];function _M(s){const e=String(s).trim();if(!e)return null;const t=parseInt(e,10);return isNaN(t)?null:t}function tl(){var v;const s=Math.max(4,Math.min(32,parseInt(document.getElementById("tile-size").value,10)||8));let e=Math.max(16,Math.min(2048,parseInt(document.getElementById("grid-size").value,10)||1080));e=Math.floor(e/s)*s||s;const t=(parseInt(document.getElementById("elevation-scale").value,10)||80)/100,n=(parseInt(document.getElementById("island-radius").value,10)||70)/100,i=(parseInt(document.getElementById("coast-falloff").value,10)||35)/10,r=(parseInt(document.getElementById("coast-irregularity").value,10)||25)/100,o=(parseInt(document.getElementById("elongation").value,10)||80)/100,a=(parseInt(document.getElementById("sea-level").value,10)||12)/100,l=(parseInt(document.getElementById("terrain-roughness").value,10)||70)/100,c=(parseInt(document.getElementById("tile-variation").value,10)||0)/100,h=Math.max(1,Math.min(8,parseInt(document.getElementById("noise-octaves").value,10)||3)),u=(parseInt(document.getElementById("noise-frequency").value,10)||10)/10,d=(parseInt(document.getElementById("noise-persistence").value,10)||75)/100,f=(parseInt(document.getElementById("noise-lacunarity").value,10)||26)/10,g=Math.max(1,Math.min(5,parseInt((v=document.getElementById("path-width"))==null?void 0:v.value,10)||1));return{gridSize:e,tileSize:s,elevationScale:1.2*t,islandRadius:.2+n*.6,coastFalloff:i,coastIrregularity:r,elongation:o,seaLevel:a,terrainRoughness:l,tileVariation:c,chunkSize:s,noiseOctaves:h,frequency:u,persistence:d,lacunarity:f,pathWidth:g,seed:_M(document.getElementById("seed").value)}}function nl(s){var m;if(!s)return;const{heightMap:e,config:t,seed:n}=s,i=e.length,r=((m=e[0])==null?void 0:m.length)??0;let o=1/0,a=-1/0,l=0,c=0;for(let p=0;p<i;p++)for(let _=0;_<r;_++){const x=e[p][_];x>0&&(o=Math.min(o,x),a=Math.max(a,x),l+=x,c++)}const h=c?(l/c).toFixed(3):"—",u=n!=null?` Seed: ${n}`:"",d=(t==null?void 0:t.tileSize)??(t==null?void 0:t.chunkSize)??8,f=i-1,g=d>0?Math.floor(f/d)**2:0,v=g>0?` ${g} tiles`:"";gM.textContent=`${i}×${r} vertices. Min: ${o.toFixed(2)} Max: ${a.toFixed(2)} Avg: ${h}.${v}${u}`}function il(){var o,a,l,c,h,u,d,f,g,v,m,p;const s=document.getElementById("seed"),e=String(s.value).trim()!=="",t=tl(),n=Ba(t);if(n.config={...n.config,pathWidth:t.pathWidth},n.props=n.props??[],n.theme=((o=document.getElementById("island-prop-theme"))==null?void 0:o.value)??"normal",P=n,Ue.setHeightMap(n.heightMap),j.setConfig({heightScale:(parseInt(document.getElementById("height-scale").value,10)||100)/100,wireframe:document.getElementById("wireframe").checked,shadows:((a=document.getElementById("shadows"))==null?void 0:a.checked)!==!1,showWater:!0}),((l=n.buildings)==null?void 0:l.length)>=2){const{pathTiles:_,heightMap:x}=Hi(n.buildings,n.heightMap,n.config);n.heightMap=x,n.pathTiles=[..._]}else n.pathTiles=[];if(j.render(n),(c=n.buildings)!=null&&c.length){const _=n.config,x=(_==null?void 0:_.tileSize)??(_==null?void 0:_.chunkSize)??8,M=Math.floor((n.heightMap.length-1)/x),y=M;j.renderBuildings(n.buildings,n.heightMap,x,M,y)}if((h=n.props)!=null&&h.length){const _=n.config,x=(_==null?void 0:_.tileSize)??(_==null?void 0:_.chunkSize)??8,M=(_==null?void 0:_.tilesX)??Math.floor((n.heightMap.length-1)/x),y=(_==null?void 0:_.tilesY)??M;j.renderProps(n.props,n.heightMap,x,M,y)}if(((u=document.getElementById("show-grid-overlay"))==null?void 0:u.checked)&&(n!=null&&n.heightMap)){const _=n.config,x=(_==null?void 0:_.tileSize)??(_==null?void 0:_.chunkSize)??8,M=(_==null?void 0:_.tilesX)??Math.floor((n.heightMap.length-1)/x),y=(_==null?void 0:_.tilesY)??M;j.setTileGridOverlay(!0,M,y,n.heightMap.length-1)}e&&(s.value=n.seed),nl(n),sl(),Ge=null,Ye=null,Qt(),Xt(),Yt(),ki();const r=(f=(d=j.getRenderer())==null?void 0:d.getPixelRatio)==null?void 0:f.call(d);if(r!=null){const _=document.getElementById("pixel-ratio"),x=document.getElementById("val-pixel-ratio");_&&(_.value=Math.round(r*100)),x&&(x.textContent=r>=1?r.toFixed(0):r.toFixed(2))}if(mt||(ee.disable(),ee.onBuildingsChange=null,ee.onHeightMapChange=null,ee.onPlacementHover=null,ee.onConnectivityWarning=null,ee.onBuildingHover=null,ee.onBuildingSelect=null,Te.disable(),Te.onPropsChange=null,Te.onPlacementHover=null,Te.onPropHover=null,Te.onPropSelect=null),!mt&&(((g=n.buildings)==null?void 0:g.length)??0)>0){ee.setHeightMap(n.heightMap);const _=n.config,x=(_==null?void 0:_.tileSize)??(_==null?void 0:_.chunkSize)??8,M=(_==null?void 0:_.tilesX)??Math.floor((((v=n.heightMap)==null?void 0:v.length)-1)/x),y=(_==null?void 0:_.tilesY)??M;ee.setTileConfig(x,M,y),ee.setSeaLevel((_==null?void 0:_.seaLevel)??.12),ee.setBuildings(n.buildings,{shared:!0}),ee.onBuildingHover=b=>{const T=P==null?void 0:P.heightMap,L=P==null?void 0:P.config,S=(L==null?void 0:L.tileSize)??(L==null?void 0:L.chunkSize)??8,E=(L==null?void 0:L.tilesX)??Math.floor(((T==null?void 0:T.length)-1)/S),C=(L==null?void 0:L.tilesY)??E;b&&T?j.setBuildingHighlight(b,T,S,E,C):j.clearBuildingHighlight()},ee.onBuildingSelect=b=>{Ge=b,Xt()},ee.onPlacementHover=()=>j.clearPlacementPreview(),ee.enable(Fn,{selectionOnly:!0})}if(!mt&&(((m=n.props)==null?void 0:m.length)??0)>0){Te.setHeightMap(n.heightMap);const _=n.config,x=(_==null?void 0:_.tileSize)??(_==null?void 0:_.chunkSize)??8,M=(_==null?void 0:_.tilesX)??Math.floor((((p=n.heightMap)==null?void 0:p.length)-1)/x),y=(_==null?void 0:_.tilesY)??M;Te.setTileConfig(x,M,y),Te.setSeaLevel((_==null?void 0:_.seaLevel)??.12),Te.setProps(n.props),Te.setBuildings(n.buildings??[]),Te.onPropHover=b=>{const T=P==null?void 0:P.heightMap,L=P==null?void 0:P.config,S=(L==null?void 0:L.tileSize)??(L==null?void 0:L.chunkSize)??8,E=(L==null?void 0:L.tilesX)??Math.floor(((T==null?void 0:T.length)-1)/S),C=(L==null?void 0:L.tilesY)??E;b&&T?j.setPropHighlight(b,T,S,E,C):j.clearPropHighlight()},Te.onPropSelect=b=>{Ye=b,Ge=null,Yt(),Xt(),Qt()},Te.onPlacementHover=()=>j.clearPropPlacementPreview(),Te.enable(Fn,{selectionOnly:!0})}mt&&vo(!0)}function Ps(s){var i,r,o,a,l,c,h,u;s&&mt&&vo(!1),Ci=s;const e=document.getElementById("edit-panel"),t=document.getElementById("edit-mode-btn");e&&(e.style.display=s?"block":"none"),t&&(t.textContent=s?"Edit Mode (On)":"Edit Mode (Off)",t.classList.toggle("active",s)),j.setInputMode(s?"edit":"view");const n=document.getElementById("input-hint");if(n&&(n.textContent=s?"Left=paint · Right=orbit · Space+Left=orbit · Scroll=zoom":"Left=orbit · Right=pan · Scroll=zoom"),s){Ue.setHeightMap(P==null?void 0:P.heightMap);const d=P==null?void 0:P.config;Ue.setTileConfig((d==null?void 0:d.tileSize)??(d==null?void 0:d.chunkSize)??8,d==null?void 0:d.tilesX,d==null?void 0:d.tilesY),Ue.enable(Fn),Ue.setBrushSizeInTiles(parseInt((i=document.getElementById("brush-size-tiles"))==null?void 0:i.value,10)||1),Ue.setBrushStrength((parseInt(document.getElementById("brush-strength").value,10)||16)/40*.2),Ue.setBrushMode(document.getElementById("brush-mode").value),Ue.setApplyOnClickOnly(((r=document.getElementById("brush-apply-mode"))==null?void 0:r.value)==="click"),Ue.setCanPaint(()=>!j.isSpaceHeld()),Ue.setBrushTargetHeight(parseFloat(document.getElementById("brush-target").value)||.35),Ue.setSeaLevel(((o=P==null?void 0:P.config)==null?void 0:o.seaLevel)??.12);const f=((a=P==null?void 0:P.config)==null?void 0:a.seaLevel)??.12,g=parseFloat((l=document.getElementById("elev-min"))==null?void 0:l.value)||0,v=parseFloat((c=document.getElementById("elev-max"))==null?void 0:c.value)??1;Ue.setElevationClamp(g,v),Ue.onHeightAtCursor=(p,_)=>{if(as)if(as.style.display=p!=null?"block":"none",p!=null){const x=p<=f?"Water":p<.2?"Beach":p<.45?"Grass":p<.7?"Rock":"Snow",M=_?` | Tile: (${_.tx},${_.ty})`:"";as.textContent=`Elev: ${p.toFixed(3)} | ${x}${M}`}else as.textContent="Elev: —"},Ue.onHoverTile=p=>{if(p){const _=Ue.getHeightMap();_?j.setHoverOverlay({x0:p.x0,y0:p.y0,x1:p.x1,y1:p.y1},_):j.setHoverOverlay(null)}else j.setHoverOverlay(null)},Ue.onBeforeBrush=xM,Ue.onAfterBrush=ki,Ue.onRampPreview=(p,_)=>{var M,y;const x=((M=P==null?void 0:P.heightMap)==null?void 0:M.length)-1;p&&_&&x>0?j.setRampPreview(p,_,x):(y=j._clearRampPreview)==null||y.call(j)},Ii=[],Qs=[];const m=((h=document.getElementById("brush-mode"))==null?void 0:h.value)||"raise";document.querySelectorAll(".brush-tool-btn").forEach(p=>p.setAttribute("aria-pressed",p.dataset.mode===m?"true":"false"))}else Ue.setCanPaint(null),Ue.onRampPreview=null,Ue.disable(),j.setHoverOverlay(null),(u=j._clearRampPreview)==null||u.call(j),as&&(as.style.display="none")}function vo(s){var i,r,o,a,l,c,h,u,d,f,g,v,m,p,_;s&&Ci&&Ps(!1),mt=s;const e=document.getElementById("build-panel"),t=document.getElementById("build-mode-btn");e&&(e.style.display=s?"block":"none"),t&&(t.textContent=s?"Build Mode (On)":"Build Mode (Off)",t.classList.toggle("active",s)),j.setInputMode(s||Ci?"edit":"view");const n=document.getElementById("input-hint");if(n&&(n.textContent=s?"Left=place · Right=orbit · Shift+Left=remove · Scroll=zoom":Ci?"Left=paint · Right=orbit · Space+Left=orbit · Scroll=zoom":"Left=orbit · Right=pan · Scroll=zoom"),s){Li=((i=document.querySelector('input[name="place-mode"]:checked'))==null?void 0:i.value)||"buildings";const x=P==null?void 0:P.config,M=(x==null?void 0:x.tileSize)??(x==null?void 0:x.chunkSize)??8,y=(x==null?void 0:x.tilesX)??Math.floor((((r=P==null?void 0:P.heightMap)==null?void 0:r.length)-1)/M),b=(x==null?void 0:x.tilesY)??y;ee.setHeightMap(P==null?void 0:P.heightMap),ee.setTileConfig(M,y,b),ee.setSeaLevel((x==null?void 0:x.seaLevel)??.12),ee.setBuildings((P==null?void 0:P.buildings)??[]),ee.setSelectedType(((o=document.getElementById("building-type"))==null?void 0:o.value)||"tavern"),Te.setHeightMap(P==null?void 0:P.heightMap),Te.setTileConfig(M,y,b),Te.setSeaLevel((x==null?void 0:x.seaLevel)??.12),Te.setProps((P==null?void 0:P.props)??[]),Te.setBuildings((P==null?void 0:P.buildings)??[]),Te.setSelectedType(((l=(a=document.querySelector("#prop-palette .prop-palette-btn.selected"))==null?void 0:a.dataset)==null?void 0:l.type)||"rock_01"),ee.onBuildingsChange=E=>{var N;P={...P,buildings:E},Js();const C=P==null?void 0:P.config,U=(C==null?void 0:C.tileSize)??(C==null?void 0:C.chunkSize)??8,z=(C==null?void 0:C.tilesX)??Math.floor((((N=P==null?void 0:P.heightMap)==null?void 0:N.length)-1)/U),D=(C==null?void 0:C.tilesY)??z;if(E.length>=2&&(P!=null&&P.heightMap)){const{pathTiles:H,heightMap:Z}=Hi(E,P.heightMap,{...C,tilesX:z,tilesY:D});P={...P,heightMap:Z,pathTiles:[...H]},ee.setHeightMap(Z),Ue.setHeightMap(Z),j.updateFromHeightMap(Z,H,U)}else P={...P,pathTiles:[]},j.updateFromHeightMap(P.heightMap,new Set,U);li(),Ih()},ee.onHeightMapChange=E=>{P={...P,heightMap:E},Ue.setHeightMap(E);const C=P==null?void 0:P.config,U=(C==null?void 0:C.tileSize)??(C==null?void 0:C.chunkSize)??8,z=P!=null&&P.pathTiles?new Set(P.pathTiles):new Set;j.updateFromHeightMap(E,z,U)},ee.onPlacementHover=(E,C,U,z)=>{Oa=z;const D=P==null?void 0:P.heightMap,N=P==null?void 0:P.config,H=(N==null?void 0:N.tileSize)??(N==null?void 0:N.chunkSize)??8,Z=(N==null?void 0:N.tilesX)??Math.floor(((D==null?void 0:D.length)-1)/H),B=(N==null?void 0:N.tilesY)??Z;E!=null&&C!=null&&D?j.setPlacementPreview(E,C,ee.selectedType,U,D,H,Z,B,z):(j.clearPlacementPreview(),Oa=!0),li()},ee.onConnectivityWarning=()=>{if(un){const E=un.textContent;un.textContent="⚠ Building isolated (no path to others)",un.style.color="#f59e0b",setTimeout(()=>{un.textContent=E,un.style.color="",li()},2500)}},ee.onBuildingHover=E=>{const C=P==null?void 0:P.heightMap,U=P==null?void 0:P.config,z=(U==null?void 0:U.tileSize)??(U==null?void 0:U.chunkSize)??8,D=(U==null?void 0:U.tilesX)??Math.floor(((C==null?void 0:C.length)-1)/z),N=(U==null?void 0:U.tilesY)??D;E&&C?j.setBuildingHighlight(E,C,z,D,N):j.clearBuildingHighlight()},ee.onBuildingSelect=E=>{Ge=E,Ye=null,Qt(),Xt(),Yt()},Te.onPropsChange=E=>{P={...P,props:E},j.renderProps(E,(P==null?void 0:P.heightMap)??[],M,y,b),Qt(),typeof Lh=="function"&&Lh()},Te.onPlacementHover=(E,C,U)=>{const z=P==null?void 0:P.heightMap;E!=null&&C!=null&&z?j.setPropPlacementPreview(E,C,Te.selectedType,U,z,M,y,b):j.clearPropPlacementPreview()},Te.onPropHover=E=>{const C=P==null?void 0:P.heightMap;E&&C?j.setPropHighlight(E,C,M,y,b):j.clearPropHighlight()},Te.onPropSelect=E=>{Ye=E,Ge=null,Yt(),Xt(),Qt()},ee.connectivityCheckEnabled=((c=document.getElementById("connectivity-check"))==null?void 0:c.checked)??!0,Li==="buildings"?((h=ee.setHeightMap)==null||h.call(ee,P.heightMap),(u=ee.setTileConfig)==null||u.call(ee,M,y,b),(d=ee.setBuildings)==null||d.call(ee,P.buildings??[],{shared:!0}),(f=ee.setSeaLevel)==null||f.call(ee,(x==null?void 0:x.seaLevel)??.12),ee.enable(Fn),Te.disable()):(Te.enable(Fn),ee.disable());const T=(g=document.getElementById("show-grid-overlay"))==null?void 0:g.checked;j.setTileGridOverlay(T,y,b,((v=P==null?void 0:P.heightMap)==null?void 0:v.length)-1),Js(),cl(ee.selectedType),ll(ee.selectedType),Ed(Te.selectedType);const L=document.getElementById("place-buildings-panel"),S=document.getElementById("place-props-panel");Li==="buildings"?(L&&(L.style.display="block"),S&&(S.style.display="none")):(L&&(L.style.display="none"),S&&(S.style.display="block")),Ih(),Xt(),Yt()}else{ee.disable(),Te.disable(),ee.onBuildingsChange=null,ee.onHeightMapChange=null,ee.onPlacementHover=null,ee.onConnectivityWarning=null,ee.onBuildingHover=null,ee.onBuildingSelect=null,Te.onPropsChange=null,Te.onPlacementHover=null,Te.onPropHover=null,Te.onPropSelect=null,j.setTileGridOverlay(!1),(m=j.setZoneHintsOverlay)==null||m.call(j,!1),j.clearPlacementPreview(),j.clearBuildingHighlight(),j.clearPropPlacementPreview(),j.clearPropHighlight(),un&&(un.style.display="none");const x=(P==null?void 0:P.buildings)??[];if(x.length>0){ee.setHeightMap(P.heightMap);const y=P.config,b=(y==null?void 0:y.tileSize)??(y==null?void 0:y.chunkSize)??8,T=(y==null?void 0:y.tilesX)??Math.floor((((p=P.heightMap)==null?void 0:p.length)-1)/b),L=(y==null?void 0:y.tilesY)??T;ee.setTileConfig(b,T,L),ee.setSeaLevel((y==null?void 0:y.seaLevel)??.12),ee.setBuildings(x,{shared:!0}),ee.onBuildingHover=S=>{const E=P==null?void 0:P.heightMap,C=P==null?void 0:P.config,U=(C==null?void 0:C.tileSize)??(C==null?void 0:C.chunkSize)??8,z=(C==null?void 0:C.tilesX)??Math.floor(((E==null?void 0:E.length)-1)/U),D=(C==null?void 0:C.tilesY)??z;S&&E?j.setBuildingHighlight(S,E,U,z,D):j.clearBuildingHighlight()},ee.onBuildingSelect=S=>{Ge=S,Xt()},ee.onPlacementHover=()=>j.clearPlacementPreview(),ee.enable(Fn,{selectionOnly:!0})}else Ge=null;const M=(P==null?void 0:P.props)??[];if(M.length>0){Te.setHeightMap(P.heightMap);const y=P.config,b=(y==null?void 0:y.tileSize)??(y==null?void 0:y.chunkSize)??8,T=(y==null?void 0:y.tilesX)??Math.floor((((_=P.heightMap)==null?void 0:_.length)-1)/b),L=(y==null?void 0:y.tilesY)??T;Te.setTileConfig(b,T,L),Te.setSeaLevel((y==null?void 0:y.seaLevel)??.12),Te.setProps(M),Te.setBuildings(x),Te.onPropHover=S=>{const E=P==null?void 0:P.heightMap,C=P==null?void 0:P.config,U=(C==null?void 0:C.tileSize)??(C==null?void 0:C.chunkSize)??8,z=(C==null?void 0:C.tilesX)??Math.floor(((E==null?void 0:E.length)-1)/U),D=(C==null?void 0:C.tilesY)??z;S&&E?j.setPropHighlight(S,E,U,z,D):j.clearPropHighlight()},Te.onPropSelect=S=>{Ye=S,Ge=null,Yt(),Xt(),Qt()},Te.onPlacementHover=()=>j.clearPropPlacementPreview(),Te.enable(Fn,{selectionOnly:!0})}else Ye=null,Qt();Xt(),Yt()}li()}function Js(){var o,a,l,c,h,u;if(!mt||Li!=="buildings"||!(P!=null&&P.heightMap)){(o=j.setZoneHintsOverlay)==null||o.call(j,!1);return}if(!(((a=document.getElementById("zone-hints"))==null?void 0:a.checked)??!1)){(l=j.setZoneHintsOverlay)==null||l.call(j,!1);return}const e=P.config,t=(e==null?void 0:e.tileSize)??(e==null?void 0:e.chunkSize)??8,n=(e==null?void 0:e.tilesX)??Math.floor((((c=P.heightMap)==null?void 0:c.length)-1)/t),i=(e==null?void 0:e.tilesY)??n,r=((h=ee.getViableTiles)==null?void 0:h.call(ee))??new Set;(u=j.setZoneHintsOverlay)==null||u.call(j,!0,r,P.heightMap,t,n,i)}function li(){if(un&&mt){if(Li==="props"){const s=En(Te.selectedType),e=(s==null?void 0:s.name)??Te.selectedType??"—",t=Te.getProps().length;un.textContent=`Prop: ${e} · ${t} placed`}else{const s=an(ee.selectedType),e=(s==null?void 0:s.name)??ee.selectedType??"—",t=ee.getBuildings().length;let n=`Building: ${e} · ${t} placed`;Oa||(n+=" · ⚠ Isolated"),un.textContent=n}un.style.display="block"}}function Lh(){li()}function Ih(){const s=document.getElementById("buildings-list"),e=document.getElementById("buildings-list-items");if(!s||!e)return;const t=(ee==null?void 0:ee.getBuildings())??(P==null?void 0:P.buildings)??[];if(t.length===0){s.style.display="none";return}s.style.display="block";const n=s.querySelector(".control-section-title");n&&(n.textContent=`Placed (${t.length})`),e.innerHTML=t.map((i,r)=>{const o=an(i.type),a=(o==null?void 0:o.name)??i.type;return`${r+1}. ${a} @ (${i.chunkX},${i.chunkY})`}).join("<br>")}function sl(){if(!P)return;const s=(t,n)=>{const i=document.getElementById(t);i&&(i.value=String(n??""))};s("island-prop-name",P.name??""),s("island-prop-description",P.description??""),s("island-prop-theme",P.theme??"normal");const e=document.getElementById("island-prop-trait");e&&(e.value=P.dangerous?"dangerous":P.appealing?"appealing":"normal"),s("island-prop-treasure",P.treasureLevel??0),s("island-prop-port",P.portType??"none"),s("island-prop-hazard",P.hazard??"none"),s("island-prop-faction",P.faction??"neutral"),s("island-prop-rumors",P.rumors??"")}function yd(){if(!P)return;const s=t=>{const n=document.getElementById(t);return n?n.value:""};P.name=s("island-prop-name")||"",P.description=s("island-prop-description")||"",P.theme=s("island-prop-theme")||"normal";const e=s("island-prop-trait");if(P.dangerous=e==="dangerous",P.appealing=e==="appealing",P.treasureLevel=parseInt(s("island-prop-treasure"),10)||0,P.portType=s("island-prop-port")||"none",P.hazard=s("island-prop-hazard")||"none",P.faction=s("island-prop-faction")||"neutral",P.rumors=s("island-prop-rumors")||"",P.heightMap&&j.getMesh()){j.setConfig({theme:P.theme});const t=P.config,n=(t==null?void 0:t.tileSize)??(t==null?void 0:t.chunkSize)??8,i=P.pathTiles?new Set(P.pathTiles):new Set;j.updateFromHeightMap(Ue.getHeightMap()??P.heightMap,i,n)}}function Sd(s){const e=(s>>16&255).toString(16).padStart(2,"0"),t=(s>>8&255).toString(16).padStart(2,"0"),n=(s&255).toString(16).padStart(2,"0");return`#${e}${t}${n}`}function Xt(){const s=document.getElementById("building-properties-empty"),e=document.getElementById("building-properties-content"),t=document.getElementById("building-prop-type"),n=document.getElementById("building-prop-id"),i=document.getElementById("building-prop-swatch"),r=document.getElementById("building-prop-position"),o=document.getElementById("building-prop-width"),a=document.getElementById("building-prop-height"),l=document.getElementById("building-prop-rotation"),c=document.getElementById("building-prop-cargo"),h=document.getElementById("building-prop-cargo-formula");if(!s||!e)return;if(!Ge){s.style.display="block",e&&(e.style.display="none");return}s.style.display="none",e&&(e.style.display="block");const u=an(Ge.type),d=Pn(Ge),f=Ge.cargoSize??d.width*d.height*10,g=Ge.rotation??0;t&&(t.textContent=(u==null?void 0:u.name)??Ge.type??"—"),n&&(n.textContent=Ge.id??"—"),i&&u&&(i.style.backgroundColor=Sd(u.color)),r&&(r.textContent=`Tile (${Ge.chunkX}, ${Ge.chunkY})`),o&&(o.value=d.width),a&&(a.value=d.height),l&&(l.textContent=`${g}°`),c&&(c.value=f),h&&(h.textContent=`${d.width}×${d.height} × 10 = ${d.width*d.height*10} units`)}function Qt(){var i;if(!Ye||!(P!=null&&P.heightMap)){j.detachPropGizmo();return}const s=P.config,e=(s==null?void 0:s.tileSize)??(s==null?void 0:s.chunkSize)??8,t=(s==null?void 0:s.tilesX)??Math.floor((((i=P.heightMap)==null?void 0:i.length)-1)/e),n=(s==null?void 0:s.tilesY)??t;j.setPropGizmoAttached(Ye,{tileSize:e,tilesX:t,tilesY:n},P.heightMap)}function Yt(){var v;const s=document.getElementById("prop-properties-empty"),e=document.getElementById("prop-properties-content"),t=document.getElementById("prop-prop-type"),n=document.getElementById("prop-prop-id"),i=document.getElementById("prop-prop-swatch"),r=document.getElementById("prop-prop-chunkX"),o=document.getElementById("prop-prop-chunkY"),a=document.getElementById("prop-prop-rotation-input"),l=document.getElementById("prop-prop-offsetX"),c=document.getElementById("prop-prop-offsetY"),h=document.getElementById("prop-prop-offsetZ"),u=document.getElementById("prop-prop-scale");if(!s||!e)return;if(!Ye){s.style.display="block",e.style.display="none";return}s.style.display="none",e.style.display="block";const d=En(Ye.type),f=Ye.rotation??0;t&&(t.textContent=(d==null?void 0:d.name)??Ye.type??"—"),n&&(n.textContent=Ye.id??"—"),i&&d&&(i.style.backgroundColor=Sd(d.color)),r&&(r.value=Ye.chunkX??0),o&&(o.value=Ye.chunkY??0),a&&(a.value=f),l&&(l.value=Ye.offsetX??0),c&&(c.value=Ye.offsetY??0),h&&(h.value=Ye.offsetZ??0),u&&(u.value=Ye.scale??1);const g=((v=j.isGizmoSnapEnabled)==null?void 0:v.call(j))??!1;document.querySelectorAll(".gizmo-snap-btn").forEach(m=>{m.dataset.snap=g?"on":"off",m.classList.toggle("active",g)})}function Ed(s){document.querySelectorAll("#prop-palette .prop-palette-btn").forEach(e=>{e.classList.toggle("selected",e.dataset.type===s)})}function bd(s){return Array.isArray(s)?s.map(e=>{const t=Pn(e),n={};return(e.width==null||e.height==null)&&(n.width=t.width,n.height=t.height),e.cargoSize==null&&(n.cargoSize=t.width*t.height*10),Object.keys(n).length?{...e,...n}:e}):s}function ki(){var t;const s=(t=document.getElementById("contour-overlay"))==null?void 0:t.checked,e=Ue.getHeightMap()??(P==null?void 0:P.heightMap);e&&j.setContourOverlay(!!s,e,.1)}function xM(){const s=Ue.getHeightMap();s&&(Ii.push(s.map(e=>[...e])),Ii.length>vM&&Ii.shift(),Qs=[])}function Td(){if(Ii.length===0)return;Qs.push(Ue.getHeightMap().map(i=>[...i]));const s=Ii.pop();Ue.setHeightMap(s);const e=P==null?void 0:P.config,t=(e==null?void 0:e.tileSize)??(e==null?void 0:e.chunkSize)??8,n=P!=null&&P.pathTiles?new Set(P.pathTiles):new Set;j.updateFromHeightMap(s,n,t),ki()}function wd(){if(Qs.length===0)return;Ii.push(Ue.getHeightMap().map(i=>[...i]));const s=Qs.pop();Ue.setHeightMap(s);const e=P==null?void 0:P.config,t=(e==null?void 0:e.tileSize)??(e==null?void 0:e.chunkSize)??8,n=P!=null&&P.pathTiles?new Set(P.pathTiles):new Set;j.updateFromHeightMap(s,n,t),ki()}function MM(s){return Array.isArray(s)?s.map(e=>{const t=Pn(e),n=e.cargoSize??t.width*t.height*10;return{id:e.id??"b"+Date.now(),type:e.type??"tavern",chunkX:e.chunkX??0,chunkY:e.chunkY??0,rotation:e.rotation??0,width:t.width,height:t.height,cargoSize:n}}):s}function oo(s){return Array.isArray(s)?s.map((e,t)=>{const n=En(e.type),i=(n==null?void 0:n.defaultScale)??1;return{id:e.id??"p"+(Date.now()+t),type:e.type??"rock_01",chunkX:e.chunkX??0,chunkY:e.chunkY??0,offsetX:e.offsetX??0,offsetY:e.offsetY??0,offsetZ:e.offsetZ??0,rotation:e.rotation??0,scale:e.scale??i}}):[]}function yM(){var c,h;if(!P)return;yd();const s=((c=document.getElementById("save-mode"))==null?void 0:c.value)||"full",e=mt?ee.getBuildings():P.buildings??[],t=MM(e),n=mt?Te.getProps():P.props??[],i={...P,heightMap:s==="full"?Ue.getHeightMap()??P.heightMap:void 0,display:{heightScale:(parseInt(document.getElementById("height-scale").value,10)||100)/100,wireframe:document.getElementById("wireframe").checked,shadows:((h=document.getElementById("shadows"))==null?void 0:h.checked)!==!1},buildings:s==="full"?t:[],props:s==="full"?n:[]},r=pM(i),o=new Blob([r],{type:"application/json"}),a=URL.createObjectURL(o),l=document.createElement("a");l.href=a,l.download=s==="config"?`yohoh-config-${Date.now()}.json`:`yohoh-island-${Date.now()}.json`,l.click(),URL.revokeObjectURL(a)}function Ad(s,e={},t=null){if(!s)return;const n=(a,l)=>{const c=document.getElementById(a);c&&(c.value=String(l))};n("grid-size",s.gridSize??1080),n("elevation-scale",Math.round((s.elevationScale??.96)/1.2*100)),n("terrain-roughness",Math.round((s.terrainRoughness??.7)*100)),n("island-radius",Math.round(((s.islandRadius??.62)-.2)/.6*100)),n("coast-falloff",Math.round((s.coastFalloff??3.5)*10)),n("coast-irregularity",Math.round((s.coastIrregularity??.25)*100)),n("elongation",Math.round((s.elongation??.8)*100)),n("sea-level",Math.round((s.seaLevel??.12)*100)),n("tile-size",s.tileSize??s.chunkSize??16),n("tile-variation",Math.round((s.tileVariation??0)*100)),n("noise-octaves",s.noiseOctaves??3),n("noise-frequency",Math.round((s.frequency??1)*10)),n("noise-persistence",Math.round((s.persistence??.75)*100)),n("noise-lacunarity",Math.round((s.lacunarity??2.6)*10)),n("path-width",Math.max(1,Math.min(5,s.pathWidth??1))),n("height-scale",Math.round((e.heightScale??.5)*100));const i=document.getElementById("wireframe");i&&(i.checked=!!e.wireframe);const r=document.getElementById("shadows");r&&(r.checked=e.shadows!==!1);const o=document.getElementById("seed");o&&(o.value=t!=null?String(t):""),Pd()}function Pd(){const s=(e,t,n=i=>i)=>{const i=document.getElementById(e),r=document.getElementById(t);i&&r&&(r.textContent=n(i.value))};s("grid-size","val-grid"),s("elevation-scale","val-elevation",e=>`${e}%`),s("terrain-roughness","val-roughness",e=>`${e}%`),s("island-radius","val-radius",e=>`${e}%`),s("coast-falloff","val-coast",e=>(parseInt(e,10)/10).toFixed(1)),s("coast-irregularity","val-coast-irreg",e=>`${e}%`),s("elongation","val-elongation",e=>`${e}%`),s("sea-level","val-sea",e=>(parseInt(e,10)/100).toFixed(2)),s("tile-size","val-tile"),s("tile-variation","val-tile-var",e=>`${e}%`),s("noise-octaves","val-octaves"),s("noise-frequency","val-freq",e=>(parseInt(e,10)/10).toFixed(1)),s("noise-persistence","val-persist",e=>(parseInt(e,10)/100).toFixed(2)),s("noise-lacunarity","val-lac",e=>(parseInt(e,10)/10).toFixed(1)),s("height-scale","val-height-scale",e=>`${e}%`),s("path-width","val-path-width"),s("brush-target","val-brush-target"),s("brush-strength","val-brush-strength",e=>`${((parseInt(e,10)||16)/40*20).toFixed(0)}%`)}function SM(){const s=document.createElement("input");s.type="file",s.accept=".json,application/json",s.onchange=e=>{var i;const t=(i=e.target.files)==null?void 0:i[0];if(!t)return;const n=new FileReader;n.onload=()=>{var r,o,a,l,c,h,u,d,f,g,v,m,p,_,x,M,y,b,T,L,S,E,C,U,z,D;try{const N=Md(n.result);Ad(N.config,N.display,N.seed);const H={...N.config,pathWidth:((r=N.config)==null?void 0:r.pathWidth)??1},Z=bd(N.buildings??[]);let B;if(N.heightMap){const Q=oo(N.props??[]);B={heightMap:N.heightMap,config:H,buildings:Z,props:Q,seed:N.seed,name:N.name??"",description:N.description??"",dangerous:N.dangerous??!1,appealing:N.appealing??!1,treasureLevel:N.treasureLevel??0,portType:N.portType??"none",hazard:N.hazard??"none",faction:N.faction??"neutral",rumors:N.rumors??"",theme:N.theme??"normal"}}else B=Ba(tl()),B.buildings=Z,B.props=oo(N.props??[]),B.config={...B.config,pathWidth:H.pathWidth},B.name=N.name??B.name??"",B.description=N.description??B.description??"",B.dangerous=N.dangerous??B.dangerous??!1,B.appealing=N.appealing??B.appealing??!1,B.treasureLevel=N.treasureLevel??B.treasureLevel??0,B.portType=N.portType??B.portType??"none",B.hazard=N.hazard??B.hazard??"none",B.faction=N.faction??B.faction??"neutral",B.rumors=N.rumors??B.rumors??"",B.theme=N.theme??B.theme??"normal";if(P=B,((o=B.buildings)==null?void 0:o.length)>=2){const{pathTiles:Q,heightMap:V}=Hi(B.buildings,B.heightMap,B.config);B.heightMap=V,B.pathTiles=[...Q]}else B.pathTiles=[];if(Ue.setHeightMap(B.heightMap),j.setConfig({heightScale:((a=N.display)==null?void 0:a.heightScale)??.5,wireframe:!!((l=N.display)!=null&&l.wireframe),shadows:((c=N.display)==null?void 0:c.shadows)!==!1}),j.render(B),(h=B.buildings)!=null&&h.length){const Q=((u=B.config)==null?void 0:u.tileSize)??((d=B.config)==null?void 0:d.chunkSize)??8,V=((f=B.config)==null?void 0:f.tilesX)??Math.floor((((g=B.heightMap)==null?void 0:g.length)-1)/Q),J=((v=B.config)==null?void 0:v.tilesY)??V;j.renderBuildings(B.buildings,B.heightMap,Q,V,J)}if((m=B.props)!=null&&m.length){const Q=((p=B.config)==null?void 0:p.tileSize)??((_=B.config)==null?void 0:_.chunkSize)??8,V=((x=B.config)==null?void 0:x.tilesX)??Math.floor((((M=B.heightMap)==null?void 0:M.length)-1)/Q),J=((y=B.config)==null?void 0:y.tilesY)??V;j.renderProps(B.props,B.heightMap,Q,V,J)}nl(B),sl(),Ge=null,Ye=null,Xt(),Yt(),Qt(),document.getElementById("seed").value=B.seed??"",Ps(!0),ki();const X=((b=B.config)==null?void 0:b.tileSize)??((T=B.config)==null?void 0:T.chunkSize)??8,$=((L=B.config)==null?void 0:L.tilesX)??Math.floor((((S=B.heightMap)==null?void 0:S.length)-1)/X),te=((E=B.config)==null?void 0:E.tilesY)??$;((C=B.buildings)==null?void 0:C.length)>0&&(ee.setHeightMap(B.heightMap),ee.setTileConfig(X,$,te),ee.setSeaLevel(((U=B.config)==null?void 0:U.seaLevel)??.12),ee.setBuildings(B.buildings,{shared:!0}),ee.onBuildingHover=Q=>{Q&&B.heightMap?j.setBuildingHighlight(Q,B.heightMap,X,$,te):j.clearBuildingHighlight()},ee.onBuildingSelect=Q=>{Ge=Q,Xt()},ee.onPlacementHover=()=>j.clearPlacementPreview(),ee.enable(Fn,{selectionOnly:!0})),((z=B.props)==null?void 0:z.length)>0&&(Te.setHeightMap(B.heightMap),Te.setTileConfig(X,$,te),Te.setSeaLevel(((D=B.config)==null?void 0:D.seaLevel)??.12),Te.setProps(B.props),Te.setBuildings(B.buildings??[]),Te.onPropHover=Q=>{Q&&B.heightMap?j.setPropHighlight(Q,B.heightMap,X,$,te):j.clearPropHighlight()},Te.onPropSelect=Q=>{Ye=Q,Ge=null,Yt(),Xt(),Qt()},Te.onPlacementHover=()=>j.clearPropPlacementPreview(),Te.enable(Fn,{selectionOnly:!0}))}catch(N){alert("Invalid island file: "+N.message)}},n.readAsText(t),s.value=""},s.click()}function gt(s,e,t=n=>n){const n=document.getElementById(s),i=document.getElementById(e);if(!n||!i)return;const r=()=>{i.textContent=t(n.value)};n.addEventListener("input",r),n.addEventListener("change",r),r()}const bn=document.getElementById("settings-modal"),pa=document.getElementById("settings-btn"),ma=document.getElementById("settings-close-btn");function EM(){bn&&bn.classList.add("open")}function rl(){bn&&bn.classList.remove("open")}pa==null||pa.addEventListener("click",EM);ma==null||ma.addEventListener("click",rl);bn==null||bn.addEventListener("click",s=>{s.target===bn&&rl()});const Tn=document.getElementById("settings-graphics-modal"),ga=document.getElementById("settings-graphics-btn"),va=document.getElementById("settings-graphics-close-btn");function bM(){Tn&&Tn.classList.add("open")}function ol(){Tn&&Tn.classList.remove("open")}ga==null||ga.addEventListener("click",bM);va==null||va.addEventListener("click",ol);Tn==null||Tn.addEventListener("click",s=>{s.target===Tn&&ol()});document.addEventListener("keydown",s=>{s.key==="Escape"&&(Tn!=null&&Tn.classList.contains("open")?ol():bn!=null&&bn.classList.contains("open")&&rl())});mM.addEventListener("click",il);document.getElementById("randomize").addEventListener("click",()=>{document.getElementById("seed").value="",Ps(!1),il()});document.getElementById("save-btn").addEventListener("click",yM);document.getElementById("load-btn").addEventListener("click",SM);async function TM(){var t,n,i,r,o,a,l,c,h,u,d,f,g,v,m;const s=document.getElementById("preset-select"),e=s==null?void 0:s.value;if(e)try{const p=await fetch(e);if(!p.ok)throw new Error(p.statusText);const _=Md(await p.text());Ad(_.config,_.display,_.seed);const x={..._.config,pathWidth:((t=_.config)==null?void 0:t.pathWidth)??1},M=bd(_.buildings??[]);let y;if(_.heightMap){const b=oo(_.props??[]);y={heightMap:_.heightMap,config:x,buildings:M,props:b,seed:_.seed,name:_.name??"",description:_.description??"",dangerous:_.dangerous??!1,appealing:_.appealing??!1,treasureLevel:_.treasureLevel??0,portType:_.portType??"none",hazard:_.hazard??"none",faction:_.faction??"neutral",rumors:_.rumors??"",theme:_.theme??"normal"}}else y=Ba(tl()),y.buildings=M,y.props=oo(_.props??[]),y.config={...y.config,pathWidth:x.pathWidth},y.name=_.name??y.name??"",y.description=_.description??y.description??"",y.dangerous=_.dangerous??y.dangerous??!1,y.appealing=_.appealing??y.appealing??!1,y.treasureLevel=_.treasureLevel??y.treasureLevel??0,y.portType=_.portType??y.portType??"none",y.hazard=_.hazard??y.hazard??"none",y.faction=_.faction??y.faction??"neutral",y.rumors=_.rumors??y.rumors??"",y.theme=_.theme??y.theme??"normal";if(P=y,((n=y.buildings)==null?void 0:n.length)>=2){const{pathTiles:b,heightMap:T}=Hi(y.buildings,y.heightMap,y.config);y.heightMap=T,y.pathTiles=[...b]}else y.pathTiles=[];if(Ue.setHeightMap(y.heightMap),j.setConfig({heightScale:((i=_.display)==null?void 0:i.heightScale)??.5,wireframe:!!((r=_.display)!=null&&r.wireframe),shadows:((o=_.display)==null?void 0:o.shadows)!==!1}),j.render(y),(a=y.buildings)!=null&&a.length){const b=((l=y.config)==null?void 0:l.tileSize)??((c=y.config)==null?void 0:c.chunkSize)??8,T=Math.floor((((h=y.heightMap)==null?void 0:h.length)-1)/b);j.renderBuildings(y.buildings,y.heightMap,b,T,T)}if((u=y.props)!=null&&u.length){const b=((d=y.config)==null?void 0:d.tileSize)??((f=y.config)==null?void 0:f.chunkSize)??8,T=((g=y.config)==null?void 0:g.tilesX)??Math.floor((((v=y.heightMap)==null?void 0:v.length)-1)/b),L=((m=y.config)==null?void 0:m.tilesY)??T;j.renderProps(y.props,y.heightMap,b,T,L)}nl(y),sl(),Ge=null,Ye=null,Xt(),Yt(),Qt(),Ps(!0),ki(),s.value=""}catch(p){alert("Failed to load preset: "+p.message)}}document.getElementById("load-preset-btn").addEventListener("click",TM);["island-prop-name","island-prop-description","island-prop-theme","island-prop-trait","island-prop-treasure","island-prop-port","island-prop-hazard","island-prop-faction","island-prop-rumors"].forEach(s=>{var e;(e=document.getElementById(s))==null||e.addEventListener("change",yd)});function al(){var g,v;if(!Ge||!P)return;const s=document.getElementById("building-prop-width"),e=document.getElementById("building-prop-height"),t=document.getElementById("building-prop-cargo");if(!s||!e||!t)return;const n=Math.max(1,Math.min(5,parseInt(s.value,10)||1)),i=Math.max(1,Math.min(5,parseInt(e.value,10)||1)),r=Math.max(10,parseInt(t.value,10)||10),o=mt?ee.getBuildings():P.buildings??[];if(!ee.canPlaceAtFootprint(Ge.chunkX,Ge.chunkY,n,i,Ge.type,{chunkX:Ge.chunkX,chunkY:Ge.chunkY})){Xt();return}const l=Ge.width??Pn(Ge).width,c=Ge.height??Pn(Ge).height;if(Ge.width=n,Ge.height=i,Ge.cargoSize=r,n>l||i>c){ee.flattenRegion(Ge.chunkX,Ge.chunkY,n,i,Ge.type);const m=ee.heightMap;m&&(P.heightMap=m.map(p=>[...p]),Ue.setHeightMap(P.heightMap),ee.onHeightMapChange&&ee.onHeightMapChange(P.heightMap))}const h=P.config,u=(h==null?void 0:h.tileSize)??(h==null?void 0:h.chunkSize)??8,d=(h==null?void 0:h.tilesX)??Math.floor((((g=P.heightMap)==null?void 0:g.length)-1)/u),f=(h==null?void 0:h.tilesY)??d;if(o.length>=2&&P.heightMap){const{pathTiles:m,heightMap:p}=Hi(o,P.heightMap,{...h,tilesX:d,tilesY:f});P.heightMap=p,P.pathTiles=[...m],Ue.setHeightMap(p),(v=ee.setHeightMap)==null||v.call(ee,p),j.updateFromHeightMap(p,m,u)}else j.updateFromHeightMap(P.heightMap,P.pathTiles?new Set(P.pathTiles):new Set,u);j.renderBuildings(o,P.heightMap,u,d,f),mt&&ee.onBuildingsChange&&ee.onBuildingsChange(o)}var Dh;(Dh=document.getElementById("building-prop-width"))==null||Dh.addEventListener("change",al);var Uh;(Uh=document.getElementById("building-prop-height"))==null||Uh.addEventListener("change",al);var Fh;(Fh=document.getElementById("building-prop-cargo"))==null||Fh.addEventListener("change",al);var Nh;(Nh=document.getElementById("building-rotate-btn"))==null||Nh.addEventListener("click",()=>{var l;if(!Ge||!P||!an(Ge.type))return;const e=[0,90,180,270],t=e.indexOf(Ge.rotation??0);Ge.rotation=e[(t+1)%4];const n=mt?ee.getBuildings():P.buildings??[],i=P.config,r=(i==null?void 0:i.tileSize)??(i==null?void 0:i.chunkSize)??8,o=(i==null?void 0:i.tilesX)??Math.floor((((l=P.heightMap)==null?void 0:l.length)-1)/r),a=(i==null?void 0:i.tilesY)??o;j.renderBuildings(n,P.heightMap,r,o,a),mt&&ee.onBuildingsChange&&ee.onBuildingsChange(n)});var Oh;(Oh=document.getElementById("building-remove-btn"))==null||Oh.addEventListener("click",()=>{var r;if(!Ge||!P)return;const s=(P.buildings??[]).filter(o=>o!==Ge);P.buildings=s,mt?ee.setBuildings(s):ee.setBuildings(s,{shared:!0}),Ge=null,Xt(),Yt();const e=P.config,t=(e==null?void 0:e.tileSize)??(e==null?void 0:e.chunkSize)??8,n=(e==null?void 0:e.tilesX)??Math.floor((((r=P.heightMap)==null?void 0:r.length)-1)/t),i=(e==null?void 0:e.tilesY)??n;if(s.length>=2&&P.heightMap){const{pathTiles:o,heightMap:a}=Hi(s,P.heightMap,{...e,tilesX:n,tilesY:i});P.heightMap=a,P.pathTiles=[...o],Ue.setHeightMap(a),j.updateFromHeightMap(a,o,t)}else P.pathTiles=[],j.updateFromHeightMap(P.heightMap,new Set,t);j.renderBuildings(s,P.heightMap,t,n,i),mt&&ee.onBuildingsChange&&ee.onBuildingsChange(s)});document.getElementById("edit-mode-btn").addEventListener("click",()=>{Ps(!Ci)});var Bh;(Bh=document.getElementById("build-mode-btn"))==null||Bh.addEventListener("click",()=>{vo(!mt)});document.querySelectorAll('input[name="place-mode"]').forEach(s=>{s.addEventListener("change",e=>{Li=e.target.value,mt&&vo(!0);const t=document.getElementById("place-buildings-panel"),n=document.getElementById("place-props-panel");Li==="buildings"?(t&&(t.style.display="block"),n&&(n.style.display="none")):(t&&(t.style.display="none"),n&&(n.style.display="block"))})});document.querySelectorAll("#prop-palette .prop-palette-btn").forEach(s=>{s.addEventListener("click",()=>{const e=s.dataset.type;e&&(Te.setSelectedType(e),Ed(e),li())})});var zh;(zh=document.getElementById("prop-rotate-btn"))==null||zh.addEventListener("click",()=>{var a;if(!Ye||!P)return;const s=[0,90,180,270],e=s.indexOf(Ye.rotation??0);Ye.rotation=s[(e+1)%4];const t=mt?Te.getProps():P.props??[],n=P.config,i=(n==null?void 0:n.tileSize)??(n==null?void 0:n.chunkSize)??8,r=(n==null?void 0:n.tilesX)??Math.floor((((a=P.heightMap)==null?void 0:a.length)-1)/i),o=(n==null?void 0:n.tilesY)??r;j.renderProps(t,P.heightMap,i,r,o),mt&&Te.onPropsChange&&Te.onPropsChange(t),P={...P,props:t},Yt()});var Hh;(Hh=document.getElementById("prop-remove-btn"))==null||Hh.addEventListener("click",()=>{var r;if(!Ye||!P)return;const s=(P.props??[]).filter(o=>o!==Ye);P={...P,props:s},mt&&Te.setProps(s),Ye=null,Qt(),Yt();const e=P.config,t=(e==null?void 0:e.tileSize)??(e==null?void 0:e.chunkSize)??8,n=(e==null?void 0:e.tilesX)??Math.floor((((r=P.heightMap)==null?void 0:r.length)-1)/t),i=(e==null?void 0:e.tilesY)??n;j.renderProps(s,P.heightMap,t,n,i)});function wM(){var p,_,x,M,y,b,T,L,S,E,C;if(!Ye||!P)return;const s=P.config,e=(s==null?void 0:s.tileSize)??(s==null?void 0:s.chunkSize)??8,t=(s==null?void 0:s.tilesX)??Math.floor((((p=P.heightMap)==null?void 0:p.length)-1)/e),n=(s==null?void 0:s.tilesY)??t,i=((_=P.heightMap)==null?void 0:_.length)-1;s==null||s.seaLevel;const r=Math.max(0,Math.min(t-1,parseInt((x=document.getElementById("prop-prop-chunkX"))==null?void 0:x.value,10)??Ye.chunkX)),o=Math.max(0,Math.min(n-1,parseInt((M=document.getElementById("prop-prop-chunkY"))==null?void 0:M.value,10)??Ye.chunkY)),a=Math.max(0,Math.min(360,parseInt((y=document.getElementById("prop-prop-rotation-input"))==null?void 0:y.value,10)??Ye.rotation??0)),l=parseFloat((b=document.getElementById("prop-prop-offsetX"))==null?void 0:b.value)||0,c=parseFloat((T=document.getElementById("prop-prop-offsetY"))==null?void 0:T.value)||0,h=Math.max(-.5,Math.min(.5,parseFloat((L=document.getElementById("prop-prop-offsetZ"))==null?void 0:L.value)||0)),u=Math.max(.25,Math.min(100,parseFloat((S=document.getElementById("prop-prop-scale"))==null?void 0:S.value)||1)),d=Math.min(i,Math.floor((r+.5)*e)),f=Math.min(i,Math.floor((o+.5)*e));(C=(E=P.heightMap)==null?void 0:E[f])==null||C[d],(P.buildings??[]).some(U=>{const z=U.width??1,D=U.height??1;return r>=U.chunkX&&r<U.chunkX+z&&o>=U.chunkY&&o<U.chunkY+D});const v=P.props??[];v.find(U=>U!==Ye&&U.chunkX===r&&U.chunkY===o),Ye.chunkX=r,Ye.chunkY=o,Ye.rotation=a,Ye.offsetX=l,Ye.offsetY=c,Ye.offsetZ=h,Ye.scale=u;const m=mt?Te.getProps():v;mt&&Te.setProps(m),P={...P,props:m},j.renderProps(P.props,P.heightMap,e,t,n),Qt(),Yt()}["prop-prop-chunkX","prop-prop-chunkY","prop-prop-rotation-input","prop-prop-offsetX","prop-prop-offsetY","prop-prop-offsetZ","prop-prop-scale"].forEach(s=>{var e;(e=document.getElementById(s))==null||e.addEventListener("change",wM)});document.querySelectorAll(".gizmo-mode-btn").forEach(s=>{s.addEventListener("click",()=>{const e=s.dataset.mode;e&&(j.setGizmoMode(e),document.querySelectorAll(".gizmo-mode-btn").forEach(t=>t.classList.toggle("active",t.dataset.mode===e)))})});document.querySelectorAll(".gizmo-space-btn").forEach(s=>{s.addEventListener("click",()=>{const e=s.dataset.space==="world"?"local":"world";j.setGizmoSpace(e),s.dataset.space=e,s.textContent=e.charAt(0).toUpperCase()+e.slice(1)})});document.querySelectorAll(".gizmo-snap-btn").forEach(s=>{s.addEventListener("click",()=>{const e=s.dataset.snap!=="on";j.setGizmoSnap(e),s.dataset.snap=e?"on":"off",s.classList.toggle("active",e)})});var kh;(kh=document.getElementById("building-type"))==null||kh.addEventListener("change",s=>{ee.setSelectedType(s.target.value),cl(s.target.value),ll(s.target.value),Js(),li()});document.querySelectorAll("#building-palette .building-palette-btn").forEach(s=>{s.addEventListener("click",()=>{const e=s.dataset.type;if(!e)return;ee.setSelectedType(e);const t=document.getElementById("building-type");t&&(t.value=e),cl(e),ll(e),Js(),li()})});function ll(s){const e=oi(s),t=document.getElementById("building-width"),n=document.getElementById("building-height");t&&(t.value=e.width),n&&(n.value=e.height)}var Vh;(Vh=document.getElementById("building-width"))==null||Vh.addEventListener("change",s=>{var n;const e=ee==null?void 0:ee.selectedType;if(!e)return;const t=Math.max(1,Math.min(5,parseInt(s.target.value,10)||1));if(od(e,t,void 0),P&&mt){const i=P.config,r=(i==null?void 0:i.tileSize)??(i==null?void 0:i.chunkSize)??8,o=(i==null?void 0:i.tilesX)??Math.floor((((n=P.heightMap)==null?void 0:n.length)-1)/r),a=(i==null?void 0:i.tilesY)??o;j.renderBuildings(ee.getBuildings(),P.heightMap,r,o,a)}});var Gh;(Gh=document.getElementById("building-height"))==null||Gh.addEventListener("change",s=>{var n;const e=ee==null?void 0:ee.selectedType;if(!e)return;const t=Math.max(1,Math.min(5,parseInt(s.target.value,10)||1));if(od(e,void 0,t),P&&mt){const i=P.config,r=(i==null?void 0:i.tileSize)??(i==null?void 0:i.chunkSize)??8,o=(i==null?void 0:i.tilesX)??Math.floor((((n=P.heightMap)==null?void 0:n.length)-1)/r),a=(i==null?void 0:i.tilesY)??o;j.renderBuildings(ee.getBuildings(),P.heightMap,r,o,a)}});function cl(s){document.querySelectorAll("#building-palette .building-palette-btn").forEach(e=>{e.classList.toggle("selected",e.dataset.type===s)})}var Wh;(Wh=document.getElementById("show-grid-overlay"))==null||Wh.addEventListener("change",s=>{var r,o;if(!P)return;const e=P.config,t=(e==null?void 0:e.tileSize)??(e==null?void 0:e.chunkSize)??8,n=(e==null?void 0:e.tilesX)??Math.floor((((r=P.heightMap)==null?void 0:r.length)-1)/t),i=(e==null?void 0:e.tilesY)??n;j.setTileGridOverlay(s.target.checked,n,i,((o=P.heightMap)==null?void 0:o.length)-1)});document.querySelectorAll(".brush-tool-btn").forEach(s=>{s.addEventListener("click",()=>{const e=s.dataset.mode;e&&(document.getElementById("brush-mode").value=e,Ue.setBrushMode(e),document.querySelectorAll(".brush-tool-btn").forEach(t=>t.setAttribute("aria-pressed",t.dataset.mode===e?"true":"false")))})});document.getElementById("brush-mode").addEventListener("change",s=>{const e=s.target.value;Ue.setBrushMode(e),document.querySelectorAll(".brush-tool-btn").forEach(t=>t.setAttribute("aria-pressed",t.dataset.mode===e?"true":"false"))});document.getElementById("brush-target").addEventListener("input",s=>{const e=parseFloat(s.target.value);isNaN(e)||Ue.setBrushTargetHeight(e)});document.getElementById("brush-target").addEventListener("change",s=>{const e=parseFloat(s.target.value);isNaN(e)||Ue.setBrushTargetHeight(e)});var Xh;(Xh=document.getElementById("brush-size-tiles"))==null||Xh.addEventListener("change",s=>{Ue.setBrushSizeInTiles(parseInt(s.target.value,10)||1)});var Yh;(Yh=document.getElementById("brush-apply-mode"))==null||Yh.addEventListener("change",s=>{Ue.setApplyOnClickOnly(s.target.value==="click")});document.getElementById("brush-strength").addEventListener("input",s=>{const e=parseInt(s.target.value,10)||16;Ue.setBrushStrength(e/40*.2)});document.querySelectorAll(".level-preset-btn").forEach(s=>{s.addEventListener("click",()=>{const e=s.dataset.level,t=hM[e];if(t!=null){const n=document.getElementById("brush-target");n&&(n.value=t.toFixed(2),Ue.setBrushTargetHeight(t),Pd())}})});document.getElementById("undo-btn").addEventListener("click",Td);document.getElementById("redo-btn").addEventListener("click",wd);var jh;(jh=document.getElementById("contour-overlay"))==null||jh.addEventListener("change",()=>{ki()});var qh;(qh=document.getElementById("elev-min"))==null||qh.addEventListener("change",()=>{const s=parseFloat(document.getElementById("elev-min").value)||0,e=parseFloat(document.getElementById("elev-max").value)??1;Ue.setElevationClamp(s,e)});var Zh;(Zh=document.getElementById("elev-max"))==null||Zh.addEventListener("change",()=>{const s=parseFloat(document.getElementById("elev-min").value)||0,e=parseFloat(document.getElementById("elev-max").value)??1;Ue.setElevationClamp(s,e)});document.addEventListener("keydown",s=>{var t,n,i,r,o,a;if((n=(t=document.activeElement)==null?void 0:t.closest)!=null&&n.call(t,"input, textarea, select"))return;const e=s.key.toLowerCase();if(Ye&&!s.ctrlKey&&!s.metaKey&&!s.altKey){if(e==="w"){s.preventDefault(),j.setGizmoMode("translate"),document.querySelectorAll(".gizmo-mode-btn").forEach(l=>l.classList.toggle("active",l.dataset.mode==="translate"));return}if(e==="e"){s.preventDefault(),j.setGizmoMode("rotate"),document.querySelectorAll(".gizmo-mode-btn").forEach(l=>l.classList.toggle("active",l.dataset.mode==="rotate"));return}if(e==="r"){s.preventDefault(),j.setGizmoMode("scale"),document.querySelectorAll(".gizmo-mode-btn").forEach(l=>l.classList.toggle("active",l.dataset.mode==="scale"));return}if(e==="q"){s.preventDefault();const l=document.querySelector(".gizmo-space-btn");if(l){const c=l.dataset.space==="world"?"local":"world";j.setGizmoSpace(c),l.dataset.space=c,l.textContent=c.charAt(0).toUpperCase()+c.slice(1)}return}if(e==="x"){s.preventDefault();const l=!((i=j.isGizmoSnapEnabled)!=null&&i.call(j));(r=j.setGizmoSnap)==null||r.call(j,l),document.querySelectorAll(".gizmo-snap-btn").forEach(c=>{c.dataset.snap=l?"on":"off",c.classList.toggle("active",l)});return}if(e==="escape"){s.preventDefault(),Ye=null,(o=j.clearPropHighlight)==null||o.call(j),Qt(),Yt(),Xt();return}}if(e==="e"&&!s.ctrlKey&&!s.metaKey&&!s.altKey){s.preventDefault(),Ps(!Ci);return}if(Ci){if(e==="z"&&!s.shiftKey&&(s.ctrlKey||s.metaKey)){s.preventDefault(),Td();return}if((e==="y"||e==="z"&&s.shiftKey)&&(s.ctrlKey||s.metaKey)){s.preventDefault(),wd();return}if(e==="b"&&!s.ctrlKey&&!s.metaKey){s.preventDefault();const l=document.getElementById("brush-size-tiles");if(l){const c=["1","2","3","4","5"],h=c.indexOf(l.value);l.value=c[(h+1)%c.length],Ue.setBrushSizeInTiles(parseInt(l.value,10)||1)}return}if(e==="Escape"){Ue.rampPointA&&(s.preventDefault(),Ue.rampPointA=null,Ue.setBrushMode(Ue.brushMode),(a=j._clearRampPreview)==null||a.call(j));return}if(e>="1"&&e<="8"){s.preventDefault();const c=["raise","lower","flatten","absolute","set","plateau","smooth","ramp"][parseInt(e,10)-1];document.getElementById("brush-mode").value=c,Ue.setBrushMode(c),document.querySelectorAll(".brush-tool-btn").forEach(h=>h.setAttribute("aria-pressed",h.dataset.mode===c?"true":"false"))}}});document.getElementById("height-scale").addEventListener("input",()=>{const s=(parseInt(document.getElementById("height-scale").value,10)||100)/100;if(j.setConfig({heightScale:s}),P){const e=P==null?void 0:P.config,t=(e==null?void 0:e.tileSize)??(e==null?void 0:e.chunkSize)??8,n=P!=null&&P.pathTiles?new Set(P.pathTiles):new Set;j.updateFromHeightMap(Ue.getHeightMap()??P.heightMap,n,t)}});var Kh;(Kh=document.getElementById("path-width"))==null||Kh.addEventListener("change",()=>{var t,n,i;if(!P)return;const s=Math.max(1,Math.min(5,parseInt((t=document.getElementById("path-width"))==null?void 0:t.value,10)||1)),e={...P.config,pathWidth:s};if(P.config=e,((n=P.buildings)==null?void 0:n.length)>=2){const r=P.heightMap.map(c=>[...c]),{pathTiles:o,heightMap:a}=Hi(P.buildings,r,e);P.heightMap=a,P.pathTiles=[...o],Ue.setHeightMap(a),(i=ee.setHeightMap)==null||i.call(ee,a);const l=(e==null?void 0:e.tileSize)??(e==null?void 0:e.chunkSize)??8;j.updateFromHeightMap(a,o,l)}});var $h;($h=document.getElementById("connectivity-check"))==null||$h.addEventListener("change",s=>{var e;ee.connectivityCheckEnabled=!!((e=s.target)!=null&&e.checked)});var Qh;(Qh=document.getElementById("zone-hints"))==null||Qh.addEventListener("change",()=>{Js()});document.getElementById("wireframe").addEventListener("change",s=>{if(j.setConfig({wireframe:s.target.checked}),P){const e=j.getMesh();e&&(e.material.wireframe=s.target.checked)}});var Jh;(Jh=document.getElementById("shadows"))==null||Jh.addEventListener("change",s=>{j.setConfig({shadows:s.target.checked})});var eu;(eu=document.getElementById("pixel-ratio"))==null||eu.addEventListener("input",()=>{var t;const s=(parseInt((t=document.getElementById("pixel-ratio"))==null?void 0:t.value,10)??100)/100,e=document.getElementById("val-pixel-ratio");e&&(e.textContent=s.toFixed(s>=1?0:2)),j.setPixelRatio(s)});function Rs(){var m,p,_,x,M,y,b,T,L,S,E,C;const s=j.getPostProcessing();if(!s)return;const e=((m=document.getElementById("post-processing"))==null?void 0:m.checked)??!1;s.setEnabled(e);const t=document.getElementById("post-processing-detail"),n=document.getElementById("post-processing-detail2"),i=document.getElementById("post-processing-detail3"),r=document.getElementById("post-processing-detail-ssao"),o=document.getElementById("post-bloom-strength-row"),a=document.getElementById("post-bloom-radius-row"),l=document.getElementById("post-bloom-threshold-row"),c=document.getElementById("post-ssao-radius-row"),h=document.getElementById("post-film-intensity-row"),u=document.getElementById("post-film-grayscale-row"),d=document.getElementById("post-tone-exposure-row");[t,n,i,r].forEach(U=>{U&&(U.style.opacity=e?"1":"0.6")});const f=e&&(((p=document.getElementById("post-bloom"))==null?void 0:p.checked)??!1);o&&(o.style.display=f?"":"none"),a&&(a.style.display=f?"":"none"),l&&(l.style.display=f?"":"none");const g=e&&(((_=document.getElementById("post-ssao"))==null?void 0:_.checked)??!1);c&&(c.style.display=g?"":"none");const v=e&&(((x=document.getElementById("post-film"))==null?void 0:x.checked)??!1);h&&(h.style.display=v?"":"none"),u&&(u.style.display=v?"":"none"),d&&(d.style.display=e?"":"none"),s.setBloom(f),s.setFXAA(e&&(((M=document.getElementById("post-fxaa"))==null?void 0:M.checked)??!1)),s.setFilm(v),s.setSSAO(g),s.setBloomStrength(parseFloat((y=document.getElementById("post-bloom-strength"))==null?void 0:y.value)??1),s.setBloomRadius(parseFloat((b=document.getElementById("post-bloom-radius"))==null?void 0:b.value)??.4),s.setBloomThreshold(parseFloat((T=document.getElementById("post-bloom-threshold"))==null?void 0:T.value)??.85),s.setSSAOKernelRadius(parseFloat((L=document.getElementById("post-ssao-radius"))==null?void 0:L.value)??8),s.setFilmIntensity(parseFloat((S=document.getElementById("post-film-intensity"))==null?void 0:S.value)??.5),s.setFilmGrayscale(((E=document.getElementById("post-film-grayscale"))==null?void 0:E.checked)??!1),s.setToneMappingExposure(parseFloat((C=document.getElementById("post-tone-exposure"))==null?void 0:C.value)??1)}var tu;(tu=document.getElementById("post-processing"))==null||tu.addEventListener("change",Rs);var nu;(nu=document.getElementById("post-bloom"))==null||nu.addEventListener("change",Rs);var iu;(iu=document.getElementById("post-ssao"))==null||iu.addEventListener("change",Rs);var su;(su=document.getElementById("post-fxaa"))==null||su.addEventListener("change",Rs);var ru;(ru=document.getElementById("post-film"))==null||ru.addEventListener("change",Rs);var ou;(ou=document.getElementById("post-film-grayscale"))==null||ou.addEventListener("change",Rs);var au;(au=document.getElementById("post-bloom-strength"))==null||au.addEventListener("input",()=>{var t,n;const s=parseFloat((t=document.getElementById("post-bloom-strength"))==null?void 0:t.value)??1,e=document.getElementById("val-bloom-strength");e&&(e.textContent=s.toFixed(1)),(n=j.getPostProcessing())==null||n.setBloomStrength(s)});var lu;(lu=document.getElementById("post-bloom-radius"))==null||lu.addEventListener("input",()=>{var t,n;const s=parseFloat((t=document.getElementById("post-bloom-radius"))==null?void 0:t.value)??.4,e=document.getElementById("val-bloom-radius");e&&(e.textContent=s.toFixed(2)),(n=j.getPostProcessing())==null||n.setBloomRadius(s)});var cu;(cu=document.getElementById("post-bloom-threshold"))==null||cu.addEventListener("input",()=>{var t,n;const s=parseFloat((t=document.getElementById("post-bloom-threshold"))==null?void 0:t.value)??.85,e=document.getElementById("val-bloom-threshold");e&&(e.textContent=s.toFixed(2)),(n=j.getPostProcessing())==null||n.setBloomThreshold(s)});var hu;(hu=document.getElementById("post-ssao-radius"))==null||hu.addEventListener("input",()=>{var t,n;const s=parseFloat((t=document.getElementById("post-ssao-radius"))==null?void 0:t.value)??8,e=document.getElementById("val-ssao-radius");e&&(e.textContent=s),(n=j.getPostProcessing())==null||n.setSSAOKernelRadius(s)});var uu;(uu=document.getElementById("post-film-intensity"))==null||uu.addEventListener("input",()=>{var t,n;const s=parseFloat((t=document.getElementById("post-film-intensity"))==null?void 0:t.value)??.5,e=document.getElementById("val-film-intensity");e&&(e.textContent=s.toFixed(2)),(n=j.getPostProcessing())==null||n.setFilmIntensity(s)});var du;(du=document.getElementById("post-tone-exposure"))==null||du.addEventListener("input",()=>{var t,n;const s=parseFloat((t=document.getElementById("post-tone-exposure"))==null?void 0:t.value)??1,e=document.getElementById("val-tone-exposure");e&&(e.textContent=s.toFixed(2)),(n=j.getPostProcessing())==null||n.setToneMappingExposure(s)});["collapsible-display","collapsible-graphics","collapsible-postprocessing"].forEach(s=>{const e=document.getElementById(s),t=e==null?void 0:e.querySelector(".collapsible-header");t&&t.addEventListener("click",()=>{e==null||e.classList.toggle("collapsed")})});gt("grid-size","val-grid");gt("elevation-scale","val-elevation",s=>`${s}%`);gt("terrain-roughness","val-roughness",s=>`${s}%`);gt("island-radius","val-radius",s=>`${s}%`);gt("coast-falloff","val-coast",s=>(parseInt(s,10)/10).toFixed(1));gt("coast-irregularity","val-coast-irreg",s=>`${s}%`);gt("elongation","val-elongation",s=>`${s}%`);gt("sea-level","val-sea",s=>(parseInt(s,10)/100).toFixed(2));gt("tile-size","val-tile");gt("tile-variation","val-tile-var",s=>`${s}%`);gt("noise-octaves","val-octaves");gt("noise-frequency","val-freq",s=>(parseInt(s,10)/10).toFixed(1));gt("noise-persistence","val-persist",s=>(parseInt(s,10)/100).toFixed(2));gt("noise-lacunarity","val-lac",s=>(parseInt(s,10)/10).toFixed(1));gt("height-scale","val-height-scale",s=>`${s}%`);gt("pixel-ratio","val-pixel-ratio",s=>{const e=(parseInt(s,10)??100)/100;return e>=1?e.toFixed(0):e.toFixed(2)});gt("post-bloom-strength","val-bloom-strength",s=>parseFloat(s).toFixed(1));gt("post-bloom-radius","val-bloom-radius",s=>parseFloat(s).toFixed(2));gt("post-bloom-threshold","val-bloom-threshold",s=>parseFloat(s).toFixed(2));gt("post-ssao-radius","val-ssao-radius",s=>s);gt("post-film-intensity","val-film-intensity",s=>parseFloat(s).toFixed(2));gt("post-tone-exposure","val-tone-exposure",s=>parseFloat(s).toFixed(2));gt("path-width","val-path-width");gt("brush-target","val-brush-target");gt("brush-strength","val-brush-strength",s=>`${((parseInt(s,10)||16)/40*20).toFixed(0)}%`);il();
