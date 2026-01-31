(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const gl=Math.sqrt(3),pc=.5*(gl-1),Ii=(3-gl)/6,ho=i=>Math.floor(i)|0,uo=new Float64Array([1,1,-1,1,1,-1,-1,-1,1,0,-1,0,1,0,-1,0,0,1,0,-1,0,1,0,-1]);function mc(i=Math.random){const e=gc(i),t=new Float64Array(e).map(s=>uo[s%12*2]),n=new Float64Array(e).map(s=>uo[s%12*2+1]);return function(r,a){let o=0,l=0,u=0;const d=(r+a)*pc,f=ho(r+d),h=ho(a+d),m=(f+h)*Ii,g=f-m,_=h-m,p=r-g,c=a-_;let x,v;p>c?(x=1,v=0):(x=0,v=1);const M=p-x+Ii,E=c-v+Ii,T=p-1+2*Ii,b=c-1+2*Ii,N=f&255,y=h&255;let w=.5-p*p-c*c;if(w>=0){const Y=N+e[y],D=t[Y],B=n[Y];w*=w,o=w*w*(D*p+B*c)}let O=.5-M*M-E*E;if(O>=0){const Y=N+x+e[y+v],D=t[Y],B=n[Y];O*=O,l=O*O*(D*M+B*E)}let F=.5-T*T-b*b;if(F>=0){const Y=N+1+e[y+1],D=t[Y],B=n[Y];F*=F,u=F*F*(D*T+B*b)}return 70*(o+l+u)}}function gc(i){const t=new Uint8Array(512);for(let n=0;n<512/2;n++)t[n]=n;for(let n=0;n<512/2-1;n++){const s=n+~~(i()*(256-n)),r=t[n];t[n]=t[s],t[s]=r}for(let n=256;n<512;n++)t[n]=t[n-256];return t}class _c{constructor(e=null){this.seed=e??Math.floor(Math.random()*4294967295),this.state=this.seed}next(){let e=this.state+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}nextInt(e,t){return Math.floor(this.next()*(t-e+1))+e}nextFloat(e,t){return e+this.next()*(t-e)}reset(){this.state=this.seed}getSeed(){return this.seed}}const Ki={prefix:["Dead Man's","Skull","Devil's","Black","Blood","Rum","Treasure","Ghost","Cursed","Hidden"],body:["Cay","Island","Key","Reef","Harbor","Cove","Port","Bay","Sands","Rock"]};function Hr(i={}){const{gridSize:e=128,tileSize:t=8,elevationScale:n=1.2,islandRadius:s=.42,noiseOctaves:r=5,frequency:a=2.2,persistence:o=.45,lacunarity:l=2.1,seed:u=null,seaLevel:d=.12,coastFalloff:f=2.2,coastIrregularity:h=.35,elongation:m=.5,terrainRoughness:g=.7,tileVariation:_=0,chunkSize:p}=i,c=Math.max(2,Math.min(Math.floor(e/2),t??p??8)),x=Math.floor(e/c),v=Math.floor(e/c),M=x*c,E=new _c(u),T=E.getSeed(),b=mc(()=>E.next()),N=m<=.5?1+(.5-m)*1.5:1,y=m>=.5?1+(m-.5)*1.5:1,w=[];for(let V=0;V<v;V++){const Z=[];for(let ce=0;ce<x;ce++){const Me=(ce+.5)/x-.5,ve=(V+.5)/v-.5,Ce=Me/N,Le=ve/y,be=Math.sqrt(Ce*Ce+Le*Le),Ve=h>0?b(Me*8+T*.01,ve*8+T*.02)*h:0,H=s*.5*(1+Ve),dt=be/H,Ee=Math.max(0,1-Math.pow(dt,f));let Pe=0,_e=1,et=a,Fe=0;for(let S=0;S<r;S++){const z=Me*et*x*.02+T*.001+S*50,te=ve*et*v*.02+T*.002+S*70;Pe+=b(z,te)*_e,Fe+=_e,_e*=o,et*=l}Pe=(Pe/Fe+1)*.5;const R=Math.max(0,Pe*Ee*n*g+d);Z.push(R)}w.push(Z)}const O=[];for(let V=0;V<=M;V++){const Z=[];for(let ce=0;ce<=M;ce++){const Me=Math.min(x-1,Math.floor(ce/c)),ve=Math.min(v-1,Math.floor(V/c));let Ce=w[ve][Me];if(_>0){const Le=ce/M-.5,be=V/M-.5,Ve=b(Le*20+T*.01,be*20+T*.02)*_;Ce=Math.max(0,Ce+Ve)}Z.push(Ce)}O.push(Z)}const F=E.next()<.15,Y=!F&&E.next()<.25,D=`${Ki.prefix[Math.floor(E.next()*Ki.prefix.length)]} ${Ki.body[Math.floor(E.next()*Ki.body.length)]}`,B=F?"A treacherous place. Sailors speak of it in hushed tones.":Y?"A welcoming port with fair winds and friendly faces.":"An unremarkable stop along the trade routes.",X=F?Math.min(3,1+Math.floor(E.next()*2)):Math.floor(E.next()*2),j=E.next(),q=Y&&j<.6?j<.3?"harbor":"outpost":j<.2?"outpost":"none",K=["none","reefs","storms","treacherous"],$=F&&E.next()<.6?K[1+Math.floor(E.next()*3)]:"none",se=["neutral","british","spanish","french","pirate"],oe=se[Math.floor(E.next()*se.length)];return{heightMap:O,config:{gridSize:M,tileSize:c,tilesX:x,tilesY:v,elevationScale:n,islandRadius:s,noiseOctaves:r,frequency:a,persistence:o,lacunarity:l,seaLevel:d,coastFalloff:f,coastIrregularity:h,elongation:m,terrainRoughness:g,tileVariation:_,chunkSize:c},seed:T,name:D,description:B,dangerous:F,appealing:Y,treasureLevel:X,portType:q,hazard:$,faction:oe,rumors:""}}/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Gr="160",Ot={ROTATE:0,DOLLY:1,PAN:2},$n={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},vc=0,fo=1,Mc=2,_l=1,vl=2,hn=3,An=0,Lt=1,Kt=2,yn=0,xi=1,po=2,mo=3,go=4,xc=5,Un=100,Sc=101,yc=102,_o=103,vo=104,Ec=200,Tc=201,bc=202,Ac=203,Cr=204,Pr=205,wc=206,Rc=207,Cc=208,Pc=209,Lc=210,Dc=211,Ic=212,Uc=213,Nc=214,Oc=0,Fc=1,Bc=2,ws=3,zc=4,Hc=5,Gc=6,kc=7,kr=0,Vc=1,Wc=2,En=0,Xc=1,Yc=2,qc=3,jc=4,Kc=5,$c=6,Ml=300,Ti=301,bi=302,Lr=303,Dr=304,Us=306,Ir=1e3,$t=1001,Ur=1002,Rt=1003,Mo=1004,Ys=1005,Gt=1006,Zc=1007,ki=1008,Tn=1009,Jc=1010,Qc=1011,Vr=1012,xl=1013,xn=1014,Sn=1015,Vi=1016,Sl=1017,yl=1018,Bn=1020,eh=1021,Zt=1023,th=1024,nh=1025,zn=1026,Ai=1027,ih=1028,El=1029,sh=1030,Tl=1031,bl=1033,qs=33776,js=33777,Ks=33778,$s=33779,xo=35840,So=35841,yo=35842,Eo=35843,Al=36196,To=37492,bo=37496,Ao=37808,wo=37809,Ro=37810,Co=37811,Po=37812,Lo=37813,Do=37814,Io=37815,Uo=37816,No=37817,Oo=37818,Fo=37819,Bo=37820,zo=37821,Zs=36492,Ho=36494,Go=36495,rh=36283,ko=36284,Vo=36285,Wo=36286,wl=3e3,Hn=3001,oh=3200,ah=3201,Rl=0,lh=1,Wt="",xt="srgb",fn="srgb-linear",Wr="display-p3",Ns="display-p3-linear",Rs="linear",nt="srgb",Cs="rec709",Ps="p3",Zn=7680,Xo=519,ch=512,hh=513,uh=514,Cl=515,dh=516,fh=517,ph=518,mh=519,Yo=35044,qo="300 es",Nr=1035,un=2e3,Ls=2001;class qn{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const s=this._listeners[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const Tt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Hi=Math.PI/180,Or=180/Math.PI;function Xi(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Tt[i&255]+Tt[i>>8&255]+Tt[i>>16&255]+Tt[i>>24&255]+"-"+Tt[e&255]+Tt[e>>8&255]+"-"+Tt[e>>16&15|64]+Tt[e>>24&255]+"-"+Tt[t&63|128]+Tt[t>>8&255]+"-"+Tt[t>>16&255]+Tt[t>>24&255]+Tt[n&255]+Tt[n>>8&255]+Tt[n>>16&255]+Tt[n>>24&255]).toLowerCase()}function Ct(i,e,t){return Math.max(e,Math.min(t,i))}function gh(i,e){return(i%e+e)%e}function Js(i,e,t){return(1-t)*i+t*e}function jo(i){return(i&i-1)===0&&i!==0}function Fr(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Ui(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Pt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const _h={DEG2RAD:Hi};class Ue{constructor(e=0,t=0){Ue.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ct(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class je{constructor(e,t,n,s,r,a,o,l,u){je.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,u)}set(e,t,n,s,r,a,o,l,u){const d=this.elements;return d[0]=e,d[1]=s,d[2]=o,d[3]=t,d[4]=r,d[5]=l,d[6]=n,d[7]=a,d[8]=u,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],u=n[1],d=n[4],f=n[7],h=n[2],m=n[5],g=n[8],_=s[0],p=s[3],c=s[6],x=s[1],v=s[4],M=s[7],E=s[2],T=s[5],b=s[8];return r[0]=a*_+o*x+l*E,r[3]=a*p+o*v+l*T,r[6]=a*c+o*M+l*b,r[1]=u*_+d*x+f*E,r[4]=u*p+d*v+f*T,r[7]=u*c+d*M+f*b,r[2]=h*_+m*x+g*E,r[5]=h*p+m*v+g*T,r[8]=h*c+m*M+g*b,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],u=e[7],d=e[8];return t*a*d-t*o*u-n*r*d+n*o*l+s*r*u-s*a*l}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],u=e[7],d=e[8],f=d*a-o*u,h=o*l-d*r,m=u*r-a*l,g=t*f+n*h+s*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=f*_,e[1]=(s*u-d*n)*_,e[2]=(o*n-s*a)*_,e[3]=h*_,e[4]=(d*t-s*l)*_,e[5]=(s*r-o*t)*_,e[6]=m*_,e[7]=(n*l-u*t)*_,e[8]=(a*t-n*r)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){const l=Math.cos(r),u=Math.sin(r);return this.set(n*l,n*u,-n*(l*a+u*o)+a+e,-s*u,s*l,-s*(-u*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Qs.makeScale(e,t)),this}rotate(e){return this.premultiply(Qs.makeRotation(-e)),this}translate(e,t){return this.premultiply(Qs.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Qs=new je;function Pl(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Ds(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function vh(){const i=Ds("canvas");return i.style.display="block",i}const Ko={};function Gi(i){i in Ko||(Ko[i]=!0,console.warn(i))}const $o=new je().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Zo=new je().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),$i={[fn]:{transfer:Rs,primaries:Cs,toReference:i=>i,fromReference:i=>i},[xt]:{transfer:nt,primaries:Cs,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[Ns]:{transfer:Rs,primaries:Ps,toReference:i=>i.applyMatrix3(Zo),fromReference:i=>i.applyMatrix3($o)},[Wr]:{transfer:nt,primaries:Ps,toReference:i=>i.convertSRGBToLinear().applyMatrix3(Zo),fromReference:i=>i.applyMatrix3($o).convertLinearToSRGB()}},Mh=new Set([fn,Ns]),tt={enabled:!0,_workingColorSpace:fn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!Mh.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,e,t){if(this.enabled===!1||e===t||!e||!t)return i;const n=$i[e].toReference,s=$i[t].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,e){return this.convert(i,this._workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this._workingColorSpace)},getPrimaries:function(i){return $i[i].primaries},getTransfer:function(i){return i===Wt?Rs:$i[i].transfer}};function Si(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function er(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Jn;class Ll{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Jn===void 0&&(Jn=Ds("canvas")),Jn.width=e.width,Jn.height=e.height;const n=Jn.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=Jn}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Ds("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Si(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Si(t[n]/255)*255):t[n]=Si(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let xh=0;class Dl{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:xh++}),this.uuid=Xi(),this.data=e,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(tr(s[a].image)):r.push(tr(s[a]))}else r=tr(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function tr(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Ll.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Sh=0;class Bt extends qn{constructor(e=Bt.DEFAULT_IMAGE,t=Bt.DEFAULT_MAPPING,n=$t,s=$t,r=Gt,a=ki,o=Zt,l=Tn,u=Bt.DEFAULT_ANISOTROPY,d=Wt){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Sh++}),this.uuid=Xi(),this.name="",this.source=new Dl(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=u,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Ue(0,0),this.repeat=new Ue(1,1),this.center=new Ue(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new je,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof d=="string"?this.colorSpace=d:(Gi("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=d===Hn?xt:Wt),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Ml)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ir:e.x=e.x-Math.floor(e.x);break;case $t:e.x=e.x<0?0:1;break;case Ur:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ir:e.y=e.y-Math.floor(e.y);break;case $t:e.y=e.y<0?0:1;break;case Ur:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return Gi("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===xt?Hn:wl}set encoding(e){Gi("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=e===Hn?xt:Wt}}Bt.DEFAULT_IMAGE=null;Bt.DEFAULT_MAPPING=Ml;Bt.DEFAULT_ANISOTROPY=1;class _t{constructor(e=0,t=0,n=0,s=1){_t.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const l=e.elements,u=l[0],d=l[4],f=l[8],h=l[1],m=l[5],g=l[9],_=l[2],p=l[6],c=l[10];if(Math.abs(d-h)<.01&&Math.abs(f-_)<.01&&Math.abs(g-p)<.01){if(Math.abs(d+h)<.1&&Math.abs(f+_)<.1&&Math.abs(g+p)<.1&&Math.abs(u+m+c-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const v=(u+1)/2,M=(m+1)/2,E=(c+1)/2,T=(d+h)/4,b=(f+_)/4,N=(g+p)/4;return v>M&&v>E?v<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(v),s=T/n,r=b/n):M>E?M<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(M),n=T/s,r=N/s):E<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(E),n=b/r,s=N/r),this.set(n,s,r,t),this}let x=Math.sqrt((p-g)*(p-g)+(f-_)*(f-_)+(h-d)*(h-d));return Math.abs(x)<.001&&(x=1),this.x=(p-g)/x,this.y=(f-_)/x,this.z=(h-d)/x,this.w=Math.acos((u+m+c-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class yh extends qn{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new _t(0,0,e,t),this.scissorTest=!1,this.viewport=new _t(0,0,e,t);const s={width:e,height:t,depth:1};n.encoding!==void 0&&(Gi("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===Hn?xt:Wt),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Gt,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new Bt(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(e,t,n=1){(this.width!==e||this.height!==t||this.depth!==n)&&(this.width=e,this.height=t,this.depth=n,this.texture.image.width=e,this.texture.image.height=t,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.texture.isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Dl(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Wn extends yh{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Il extends Bt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Rt,this.minFilter=Rt,this.wrapR=$t,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Eh extends Bt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Rt,this.minFilter=Rt,this.wrapR=$t,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Xn{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let l=n[s+0],u=n[s+1],d=n[s+2],f=n[s+3];const h=r[a+0],m=r[a+1],g=r[a+2],_=r[a+3];if(o===0){e[t+0]=l,e[t+1]=u,e[t+2]=d,e[t+3]=f;return}if(o===1){e[t+0]=h,e[t+1]=m,e[t+2]=g,e[t+3]=_;return}if(f!==_||l!==h||u!==m||d!==g){let p=1-o;const c=l*h+u*m+d*g+f*_,x=c>=0?1:-1,v=1-c*c;if(v>Number.EPSILON){const E=Math.sqrt(v),T=Math.atan2(E,c*x);p=Math.sin(p*T)/E,o=Math.sin(o*T)/E}const M=o*x;if(l=l*p+h*M,u=u*p+m*M,d=d*p+g*M,f=f*p+_*M,p===1-o){const E=1/Math.sqrt(l*l+u*u+d*d+f*f);l*=E,u*=E,d*=E,f*=E}}e[t]=l,e[t+1]=u,e[t+2]=d,e[t+3]=f}static multiplyQuaternionsFlat(e,t,n,s,r,a){const o=n[s],l=n[s+1],u=n[s+2],d=n[s+3],f=r[a],h=r[a+1],m=r[a+2],g=r[a+3];return e[t]=o*g+d*f+l*m-u*h,e[t+1]=l*g+d*h+u*f-o*m,e[t+2]=u*g+d*m+o*h-l*f,e[t+3]=d*g-o*f-l*h-u*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,u=o(n/2),d=o(s/2),f=o(r/2),h=l(n/2),m=l(s/2),g=l(r/2);switch(a){case"XYZ":this._x=h*d*f+u*m*g,this._y=u*m*f-h*d*g,this._z=u*d*g+h*m*f,this._w=u*d*f-h*m*g;break;case"YXZ":this._x=h*d*f+u*m*g,this._y=u*m*f-h*d*g,this._z=u*d*g-h*m*f,this._w=u*d*f+h*m*g;break;case"ZXY":this._x=h*d*f-u*m*g,this._y=u*m*f+h*d*g,this._z=u*d*g+h*m*f,this._w=u*d*f-h*m*g;break;case"ZYX":this._x=h*d*f-u*m*g,this._y=u*m*f+h*d*g,this._z=u*d*g-h*m*f,this._w=u*d*f+h*m*g;break;case"YZX":this._x=h*d*f+u*m*g,this._y=u*m*f+h*d*g,this._z=u*d*g-h*m*f,this._w=u*d*f-h*m*g;break;case"XZY":this._x=h*d*f-u*m*g,this._y=u*m*f-h*d*g,this._z=u*d*g+h*m*f,this._w=u*d*f+h*m*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],u=t[2],d=t[6],f=t[10],h=n+o+f;if(h>0){const m=.5/Math.sqrt(h+1);this._w=.25/m,this._x=(d-l)*m,this._y=(r-u)*m,this._z=(a-s)*m}else if(n>o&&n>f){const m=2*Math.sqrt(1+n-o-f);this._w=(d-l)/m,this._x=.25*m,this._y=(s+a)/m,this._z=(r+u)/m}else if(o>f){const m=2*Math.sqrt(1+o-n-f);this._w=(r-u)/m,this._x=(s+a)/m,this._y=.25*m,this._z=(l+d)/m}else{const m=2*Math.sqrt(1+f-n-o);this._w=(a-s)/m,this._x=(r+u)/m,this._y=(l+d)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ct(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,u=t._z,d=t._w;return this._x=n*d+a*o+s*u-r*l,this._y=s*d+a*l+r*o-n*u,this._z=r*d+a*u+n*l-s*o,this._w=a*d-n*o-s*l-r*u,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,s=this._y,r=this._z,a=this._w;let o=a*e._w+n*e._x+s*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const m=1-t;return this._w=m*a+t*this._w,this._x=m*n+t*this._x,this._y=m*s+t*this._y,this._z=m*r+t*this._z,this.normalize(),this}const u=Math.sqrt(l),d=Math.atan2(u,o),f=Math.sin((1-t)*d)/u,h=Math.sin(t*d)/u;return this._w=a*f+this._w*h,this._x=n*f+this._x*h,this._y=s*f+this._y*h,this._z=r*f+this._z*h,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=Math.random(),t=Math.sqrt(1-e),n=Math.sqrt(e),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(t*Math.cos(s),n*Math.sin(r),n*Math.cos(r),t*Math.sin(s))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class I{constructor(e=0,t=0,n=0){I.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Jo.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Jo.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,u=2*(a*s-o*n),d=2*(o*t-r*s),f=2*(r*n-a*t);return this.x=t+l*u+a*f-o*d,this.y=n+l*d+o*u-r*f,this.z=s+l*f+r*d-a*u,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return nr.copy(this).projectOnVector(e),this.sub(nr)}reflect(e){return this.sub(nr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ct(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=(Math.random()-.5)*2,t=Math.random()*Math.PI*2,n=Math.sqrt(1-e**2);return this.x=n*Math.cos(t),this.y=n*Math.sin(t),this.z=e,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const nr=new I,Jo=new Xn;class Yi{constructor(e=new I(1/0,1/0,1/0),t=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Yt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Yt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Yt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Yt):Yt.fromBufferAttribute(r,a),Yt.applyMatrix4(e.matrixWorld),this.expandByPoint(Yt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Zi.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Zi.copy(n.boundingBox)),Zi.applyMatrix4(e.matrixWorld),this.union(Zi)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,Yt),Yt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ni),Ji.subVectors(this.max,Ni),Qn.subVectors(e.a,Ni),ei.subVectors(e.b,Ni),ti.subVectors(e.c,Ni),pn.subVectors(ei,Qn),mn.subVectors(ti,ei),Cn.subVectors(Qn,ti);let t=[0,-pn.z,pn.y,0,-mn.z,mn.y,0,-Cn.z,Cn.y,pn.z,0,-pn.x,mn.z,0,-mn.x,Cn.z,0,-Cn.x,-pn.y,pn.x,0,-mn.y,mn.x,0,-Cn.y,Cn.x,0];return!ir(t,Qn,ei,ti,Ji)||(t=[1,0,0,0,1,0,0,0,1],!ir(t,Qn,ei,ti,Ji))?!1:(Qi.crossVectors(pn,mn),t=[Qi.x,Qi.y,Qi.z],ir(t,Qn,ei,ti,Ji))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Yt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Yt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(rn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),rn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),rn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),rn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),rn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),rn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),rn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),rn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(rn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const rn=[new I,new I,new I,new I,new I,new I,new I,new I],Yt=new I,Zi=new Yi,Qn=new I,ei=new I,ti=new I,pn=new I,mn=new I,Cn=new I,Ni=new I,Ji=new I,Qi=new I,Pn=new I;function ir(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Pn.fromArray(i,r);const o=s.x*Math.abs(Pn.x)+s.y*Math.abs(Pn.y)+s.z*Math.abs(Pn.z),l=e.dot(Pn),u=t.dot(Pn),d=n.dot(Pn);if(Math.max(-Math.max(l,u,d),Math.min(l,u,d))>o)return!1}return!0}const Th=new Yi,Oi=new I,sr=new I;class Os{constructor(e=new I,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Th.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Oi.subVectors(e,this.center);const t=Oi.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Oi,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(sr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Oi.copy(e.center).add(sr)),this.expandByPoint(Oi.copy(e.center).sub(sr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const on=new I,rr=new I,es=new I,gn=new I,or=new I,ts=new I,ar=new I;class Fs{constructor(e=new I,t=new I(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,on)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=on.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(on.copy(this.origin).addScaledVector(this.direction,t),on.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){rr.copy(e).add(t).multiplyScalar(.5),es.copy(t).sub(e).normalize(),gn.copy(this.origin).sub(rr);const r=e.distanceTo(t)*.5,a=-this.direction.dot(es),o=gn.dot(this.direction),l=-gn.dot(es),u=gn.lengthSq(),d=Math.abs(1-a*a);let f,h,m,g;if(d>0)if(f=a*l-o,h=a*o-l,g=r*d,f>=0)if(h>=-g)if(h<=g){const _=1/d;f*=_,h*=_,m=f*(f+a*h+2*o)+h*(a*f+h+2*l)+u}else h=r,f=Math.max(0,-(a*h+o)),m=-f*f+h*(h+2*l)+u;else h=-r,f=Math.max(0,-(a*h+o)),m=-f*f+h*(h+2*l)+u;else h<=-g?(f=Math.max(0,-(-a*r+o)),h=f>0?-r:Math.min(Math.max(-r,-l),r),m=-f*f+h*(h+2*l)+u):h<=g?(f=0,h=Math.min(Math.max(-r,-l),r),m=h*(h+2*l)+u):(f=Math.max(0,-(a*r+o)),h=f>0?r:Math.min(Math.max(-r,-l),r),m=-f*f+h*(h+2*l)+u);else h=a>0?-r:r,f=Math.max(0,-(a*h+o)),m=-f*f+h*(h+2*l)+u;return n&&n.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(rr).addScaledVector(es,h),m}intersectSphere(e,t){on.subVectors(e.center,this.origin);const n=on.dot(this.direction),s=on.dot(on)-n*n,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,l;const u=1/this.direction.x,d=1/this.direction.y,f=1/this.direction.z,h=this.origin;return u>=0?(n=(e.min.x-h.x)*u,s=(e.max.x-h.x)*u):(n=(e.max.x-h.x)*u,s=(e.min.x-h.x)*u),d>=0?(r=(e.min.y-h.y)*d,a=(e.max.y-h.y)*d):(r=(e.max.y-h.y)*d,a=(e.min.y-h.y)*d),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),f>=0?(o=(e.min.z-h.z)*f,l=(e.max.z-h.z)*f):(o=(e.max.z-h.z)*f,l=(e.min.z-h.z)*f),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,on)!==null}intersectTriangle(e,t,n,s,r){or.subVectors(t,e),ts.subVectors(n,e),ar.crossVectors(or,ts);let a=this.direction.dot(ar),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;gn.subVectors(this.origin,e);const l=o*this.direction.dot(ts.crossVectors(gn,ts));if(l<0)return null;const u=o*this.direction.dot(or.cross(gn));if(u<0||l+u>a)return null;const d=-o*gn.dot(ar);return d<0?null:this.at(d/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ut{constructor(e,t,n,s,r,a,o,l,u,d,f,h,m,g,_,p){ut.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,u,d,f,h,m,g,_,p)}set(e,t,n,s,r,a,o,l,u,d,f,h,m,g,_,p){const c=this.elements;return c[0]=e,c[4]=t,c[8]=n,c[12]=s,c[1]=r,c[5]=a,c[9]=o,c[13]=l,c[2]=u,c[6]=d,c[10]=f,c[14]=h,c[3]=m,c[7]=g,c[11]=_,c[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ut().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,s=1/ni.setFromMatrixColumn(e,0).length(),r=1/ni.setFromMatrixColumn(e,1).length(),a=1/ni.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),u=Math.sin(s),d=Math.cos(r),f=Math.sin(r);if(e.order==="XYZ"){const h=a*d,m=a*f,g=o*d,_=o*f;t[0]=l*d,t[4]=-l*f,t[8]=u,t[1]=m+g*u,t[5]=h-_*u,t[9]=-o*l,t[2]=_-h*u,t[6]=g+m*u,t[10]=a*l}else if(e.order==="YXZ"){const h=l*d,m=l*f,g=u*d,_=u*f;t[0]=h+_*o,t[4]=g*o-m,t[8]=a*u,t[1]=a*f,t[5]=a*d,t[9]=-o,t[2]=m*o-g,t[6]=_+h*o,t[10]=a*l}else if(e.order==="ZXY"){const h=l*d,m=l*f,g=u*d,_=u*f;t[0]=h-_*o,t[4]=-a*f,t[8]=g+m*o,t[1]=m+g*o,t[5]=a*d,t[9]=_-h*o,t[2]=-a*u,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const h=a*d,m=a*f,g=o*d,_=o*f;t[0]=l*d,t[4]=g*u-m,t[8]=h*u+_,t[1]=l*f,t[5]=_*u+h,t[9]=m*u-g,t[2]=-u,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const h=a*l,m=a*u,g=o*l,_=o*u;t[0]=l*d,t[4]=_-h*f,t[8]=g*f+m,t[1]=f,t[5]=a*d,t[9]=-o*d,t[2]=-u*d,t[6]=m*f+g,t[10]=h-_*f}else if(e.order==="XZY"){const h=a*l,m=a*u,g=o*l,_=o*u;t[0]=l*d,t[4]=-f,t[8]=u*d,t[1]=h*f+_,t[5]=a*d,t[9]=m*f-g,t[2]=g*f-m,t[6]=o*d,t[10]=_*f+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(bh,e,Ah)}lookAt(e,t,n){const s=this.elements;return Ut.subVectors(e,t),Ut.lengthSq()===0&&(Ut.z=1),Ut.normalize(),_n.crossVectors(n,Ut),_n.lengthSq()===0&&(Math.abs(n.z)===1?Ut.x+=1e-4:Ut.z+=1e-4,Ut.normalize(),_n.crossVectors(n,Ut)),_n.normalize(),ns.crossVectors(Ut,_n),s[0]=_n.x,s[4]=ns.x,s[8]=Ut.x,s[1]=_n.y,s[5]=ns.y,s[9]=Ut.y,s[2]=_n.z,s[6]=ns.z,s[10]=Ut.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],u=n[12],d=n[1],f=n[5],h=n[9],m=n[13],g=n[2],_=n[6],p=n[10],c=n[14],x=n[3],v=n[7],M=n[11],E=n[15],T=s[0],b=s[4],N=s[8],y=s[12],w=s[1],O=s[5],F=s[9],Y=s[13],D=s[2],B=s[6],X=s[10],j=s[14],q=s[3],K=s[7],$=s[11],se=s[15];return r[0]=a*T+o*w+l*D+u*q,r[4]=a*b+o*O+l*B+u*K,r[8]=a*N+o*F+l*X+u*$,r[12]=a*y+o*Y+l*j+u*se,r[1]=d*T+f*w+h*D+m*q,r[5]=d*b+f*O+h*B+m*K,r[9]=d*N+f*F+h*X+m*$,r[13]=d*y+f*Y+h*j+m*se,r[2]=g*T+_*w+p*D+c*q,r[6]=g*b+_*O+p*B+c*K,r[10]=g*N+_*F+p*X+c*$,r[14]=g*y+_*Y+p*j+c*se,r[3]=x*T+v*w+M*D+E*q,r[7]=x*b+v*O+M*B+E*K,r[11]=x*N+v*F+M*X+E*$,r[15]=x*y+v*Y+M*j+E*se,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],u=e[13],d=e[2],f=e[6],h=e[10],m=e[14],g=e[3],_=e[7],p=e[11],c=e[15];return g*(+r*l*f-s*u*f-r*o*h+n*u*h+s*o*m-n*l*m)+_*(+t*l*m-t*u*h+r*a*h-s*a*m+s*u*d-r*l*d)+p*(+t*u*f-t*o*m-r*a*f+n*a*m+r*o*d-n*u*d)+c*(-s*o*d-t*l*f+t*o*h+s*a*f-n*a*h+n*l*d)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],u=e[7],d=e[8],f=e[9],h=e[10],m=e[11],g=e[12],_=e[13],p=e[14],c=e[15],x=f*p*u-_*h*u+_*l*m-o*p*m-f*l*c+o*h*c,v=g*h*u-d*p*u-g*l*m+a*p*m+d*l*c-a*h*c,M=d*_*u-g*f*u+g*o*m-a*_*m-d*o*c+a*f*c,E=g*f*l-d*_*l-g*o*h+a*_*h+d*o*p-a*f*p,T=t*x+n*v+s*M+r*E;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const b=1/T;return e[0]=x*b,e[1]=(_*h*r-f*p*r-_*s*m+n*p*m+f*s*c-n*h*c)*b,e[2]=(o*p*r-_*l*r+_*s*u-n*p*u-o*s*c+n*l*c)*b,e[3]=(f*l*r-o*h*r-f*s*u+n*h*u+o*s*m-n*l*m)*b,e[4]=v*b,e[5]=(d*p*r-g*h*r+g*s*m-t*p*m-d*s*c+t*h*c)*b,e[6]=(g*l*r-a*p*r-g*s*u+t*p*u+a*s*c-t*l*c)*b,e[7]=(a*h*r-d*l*r+d*s*u-t*h*u-a*s*m+t*l*m)*b,e[8]=M*b,e[9]=(g*f*r-d*_*r-g*n*m+t*_*m+d*n*c-t*f*c)*b,e[10]=(a*_*r-g*o*r+g*n*u-t*_*u-a*n*c+t*o*c)*b,e[11]=(d*o*r-a*f*r-d*n*u+t*f*u+a*n*m-t*o*m)*b,e[12]=E*b,e[13]=(d*_*s-g*f*s+g*n*h-t*_*h-d*n*p+t*f*p)*b,e[14]=(g*o*s-a*_*s-g*n*l+t*_*l+a*n*p-t*o*p)*b,e[15]=(a*f*s-d*o*s+d*n*l-t*f*l-a*n*h+t*o*h)*b,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,u=r*a,d=r*o;return this.set(u*a+n,u*o-s*l,u*l+s*o,0,u*o+s*l,d*o+n,d*l-s*a,0,u*l-s*o,d*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,u=r+r,d=a+a,f=o+o,h=r*u,m=r*d,g=r*f,_=a*d,p=a*f,c=o*f,x=l*u,v=l*d,M=l*f,E=n.x,T=n.y,b=n.z;return s[0]=(1-(_+c))*E,s[1]=(m+M)*E,s[2]=(g-v)*E,s[3]=0,s[4]=(m-M)*T,s[5]=(1-(h+c))*T,s[6]=(p+x)*T,s[7]=0,s[8]=(g+v)*b,s[9]=(p-x)*b,s[10]=(1-(h+_))*b,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;let r=ni.set(s[0],s[1],s[2]).length();const a=ni.set(s[4],s[5],s[6]).length(),o=ni.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],qt.copy(this);const u=1/r,d=1/a,f=1/o;return qt.elements[0]*=u,qt.elements[1]*=u,qt.elements[2]*=u,qt.elements[4]*=d,qt.elements[5]*=d,qt.elements[6]*=d,qt.elements[8]*=f,qt.elements[9]*=f,qt.elements[10]*=f,t.setFromRotationMatrix(qt),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,s,r,a,o=un){const l=this.elements,u=2*r/(t-e),d=2*r/(n-s),f=(t+e)/(t-e),h=(n+s)/(n-s);let m,g;if(o===un)m=-(a+r)/(a-r),g=-2*a*r/(a-r);else if(o===Ls)m=-a/(a-r),g=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=u,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=d,l[9]=h,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=un){const l=this.elements,u=1/(t-e),d=1/(n-s),f=1/(a-r),h=(t+e)*u,m=(n+s)*d;let g,_;if(o===un)g=(a+r)*f,_=-2*f;else if(o===Ls)g=r*f,_=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*u,l[4]=0,l[8]=0,l[12]=-h,l[1]=0,l[5]=2*d,l[9]=0,l[13]=-m,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const ni=new I,qt=new ut,bh=new I(0,0,0),Ah=new I(1,1,1),_n=new I,ns=new I,Ut=new I,Qo=new ut,ea=new Xn;class Bs{constructor(e=0,t=0,n=0,s=Bs.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],u=s[5],d=s[9],f=s[2],h=s[6],m=s[10];switch(t){case"XYZ":this._y=Math.asin(Ct(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,m),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(h,u),this._z=0);break;case"YXZ":this._x=Math.asin(-Ct(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,u)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ct(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-f,m),this._z=Math.atan2(-a,u)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Ct(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(h,m),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,u));break;case"YZX":this._z=Math.asin(Ct(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,u),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-Ct(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,u),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-d,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Qo.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Qo,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ea.setFromEuler(this),this.setFromQuaternion(ea,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Bs.DEFAULT_ORDER="XYZ";class Xr{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let wh=0;const ta=new I,ii=new Xn,an=new ut,is=new I,Fi=new I,Rh=new I,Ch=new Xn,na=new I(1,0,0),ia=new I(0,1,0),sa=new I(0,0,1),Ph={type:"added"},Lh={type:"removed"};class yt extends qn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:wh++}),this.uuid=Xi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=yt.DEFAULT_UP.clone();const e=new I,t=new Bs,n=new Xn,s=new I(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ut},normalMatrix:{value:new je}}),this.matrix=new ut,this.matrixWorld=new ut,this.matrixAutoUpdate=yt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=yt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Xr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ii.setFromAxisAngle(e,t),this.quaternion.multiply(ii),this}rotateOnWorldAxis(e,t){return ii.setFromAxisAngle(e,t),this.quaternion.premultiply(ii),this}rotateX(e){return this.rotateOnAxis(na,e)}rotateY(e){return this.rotateOnAxis(ia,e)}rotateZ(e){return this.rotateOnAxis(sa,e)}translateOnAxis(e,t){return ta.copy(e).applyQuaternion(this.quaternion),this.position.add(ta.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(na,e)}translateY(e){return this.translateOnAxis(ia,e)}translateZ(e){return this.translateOnAxis(sa,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(an.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?is.copy(e):is.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Fi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?an.lookAt(Fi,is,this.up):an.lookAt(is,Fi,this.up),this.quaternion.setFromRotationMatrix(an),s&&(an.extractRotation(s.matrixWorld),ii.setFromRotationMatrix(an),this.quaternion.premultiply(ii.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(Ph)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Lh)),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),an.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),an.multiply(e.parent.matrixWorld)),e.applyMatrix4(an),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Fi,e,Rh),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Fi,Ch,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++){const r=t[n];(r.matrixWorldAutoUpdate===!0||e===!0)&&r.updateMatrixWorld(e)}}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++){const o=s[r];o.matrixWorldAutoUpdate===!0&&o.updateWorldMatrix(!1,!0)}}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let u=0,d=l.length;u<d;u++){const f=l[u];r(e.shapes,f)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,u=this.material.length;l<u;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),u=a(e.textures),d=a(e.images),f=a(e.shapes),h=a(e.skeletons),m=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),u.length>0&&(n.textures=u),d.length>0&&(n.images=d),f.length>0&&(n.shapes=f),h.length>0&&(n.skeletons=h),m.length>0&&(n.animations=m),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){const l=[];for(const u in o){const d=o[u];delete d.metadata,l.push(d)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}yt.DEFAULT_UP=new I(0,1,0);yt.DEFAULT_MATRIX_AUTO_UPDATE=!0;yt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const jt=new I,ln=new I,lr=new I,cn=new I,si=new I,ri=new I,ra=new I,cr=new I,hr=new I,ur=new I;let ss=!1;class kt{constructor(e=new I,t=new I,n=new I){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),jt.subVectors(e,t),s.cross(jt);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){jt.subVectors(s,t),ln.subVectors(n,t),lr.subVectors(e,t);const a=jt.dot(jt),o=jt.dot(ln),l=jt.dot(lr),u=ln.dot(ln),d=ln.dot(lr),f=a*u-o*o;if(f===0)return r.set(0,0,0),null;const h=1/f,m=(u*l-o*d)*h,g=(a*d-o*l)*h;return r.set(1-m-g,g,m)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,cn)===null?!1:cn.x>=0&&cn.y>=0&&cn.x+cn.y<=1}static getUV(e,t,n,s,r,a,o,l){return ss===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),ss=!0),this.getInterpolation(e,t,n,s,r,a,o,l)}static getInterpolation(e,t,n,s,r,a,o,l){return this.getBarycoord(e,t,n,s,cn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,cn.x),l.addScaledVector(a,cn.y),l.addScaledVector(o,cn.z),l)}static isFrontFacing(e,t,n,s){return jt.subVectors(n,t),ln.subVectors(e,t),jt.cross(ln).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return jt.subVectors(this.c,this.b),ln.subVectors(this.a,this.b),jt.cross(ln).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return kt.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return kt.getBarycoord(e,this.a,this.b,this.c,t)}getUV(e,t,n,s,r){return ss===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),ss=!0),kt.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}getInterpolation(e,t,n,s,r){return kt.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return kt.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return kt.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let a,o;si.subVectors(s,n),ri.subVectors(r,n),cr.subVectors(e,n);const l=si.dot(cr),u=ri.dot(cr);if(l<=0&&u<=0)return t.copy(n);hr.subVectors(e,s);const d=si.dot(hr),f=ri.dot(hr);if(d>=0&&f<=d)return t.copy(s);const h=l*f-d*u;if(h<=0&&l>=0&&d<=0)return a=l/(l-d),t.copy(n).addScaledVector(si,a);ur.subVectors(e,r);const m=si.dot(ur),g=ri.dot(ur);if(g>=0&&m<=g)return t.copy(r);const _=m*u-l*g;if(_<=0&&u>=0&&g<=0)return o=u/(u-g),t.copy(n).addScaledVector(ri,o);const p=d*g-m*f;if(p<=0&&f-d>=0&&m-g>=0)return ra.subVectors(r,s),o=(f-d)/(f-d+(m-g)),t.copy(s).addScaledVector(ra,o);const c=1/(p+_+h);return a=_*c,o=h*c,t.copy(n).addScaledVector(si,a).addScaledVector(ri,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Ul={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},vn={h:0,s:0,l:0},rs={h:0,s:0,l:0};function dr(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class Ze{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=xt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,tt.toWorkingColorSpace(this,t),this}setRGB(e,t,n,s=tt.workingColorSpace){return this.r=e,this.g=t,this.b=n,tt.toWorkingColorSpace(this,s),this}setHSL(e,t,n,s=tt.workingColorSpace){if(e=gh(e,1),t=Ct(t,0,1),n=Ct(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=dr(a,r,e+1/3),this.g=dr(a,r,e),this.b=dr(a,r,e-1/3)}return tt.toWorkingColorSpace(this,s),this}setStyle(e,t=xt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=xt){const n=Ul[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Si(e.r),this.g=Si(e.g),this.b=Si(e.b),this}copyLinearToSRGB(e){return this.r=er(e.r),this.g=er(e.g),this.b=er(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=xt){return tt.fromWorkingColorSpace(bt.copy(this),e),Math.round(Ct(bt.r*255,0,255))*65536+Math.round(Ct(bt.g*255,0,255))*256+Math.round(Ct(bt.b*255,0,255))}getHexString(e=xt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=tt.workingColorSpace){tt.fromWorkingColorSpace(bt.copy(this),t);const n=bt.r,s=bt.g,r=bt.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let l,u;const d=(o+a)/2;if(o===a)l=0,u=0;else{const f=a-o;switch(u=d<=.5?f/(a+o):f/(2-a-o),a){case n:l=(s-r)/f+(s<r?6:0);break;case s:l=(r-n)/f+2;break;case r:l=(n-s)/f+4;break}l/=6}return e.h=l,e.s=u,e.l=d,e}getRGB(e,t=tt.workingColorSpace){return tt.fromWorkingColorSpace(bt.copy(this),t),e.r=bt.r,e.g=bt.g,e.b=bt.b,e}getStyle(e=xt){tt.fromWorkingColorSpace(bt.copy(this),e);const t=bt.r,n=bt.g,s=bt.b;return e!==xt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(vn),this.setHSL(vn.h+e,vn.s+t,vn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(vn),e.getHSL(rs);const n=Js(vn.h,rs.h,t),s=Js(vn.s,rs.s,t),r=Js(vn.l,rs.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const bt=new Ze;Ze.NAMES=Ul;let Dh=0;class Ci extends qn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Dh++}),this.uuid=Xi(),this.name="",this.type="Material",this.blending=xi,this.side=An,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Cr,this.blendDst=Pr,this.blendEquation=Un,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ze(0,0,0),this.blendAlpha=0,this.depthFunc=ws,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Xo,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Zn,this.stencilZFail=Zn,this.stencilZPass=Zn,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==xi&&(n.blending=this.blending),this.side!==An&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Cr&&(n.blendSrc=this.blendSrc),this.blendDst!==Pr&&(n.blendDst=this.blendDst),this.blendEquation!==Un&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ws&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Xo&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Zn&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Zn&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Zn&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class gi extends Ci{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ze(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=kr,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const ht=new I,os=new Ue;class Qt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Yo,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=Sn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)os.fromBufferAttribute(this,t),os.applyMatrix3(e),this.setXY(t,os.x,os.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)ht.fromBufferAttribute(this,t),ht.applyMatrix3(e),this.setXYZ(t,ht.x,ht.y,ht.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)ht.fromBufferAttribute(this,t),ht.applyMatrix4(e),this.setXYZ(t,ht.x,ht.y,ht.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)ht.fromBufferAttribute(this,t),ht.applyNormalMatrix(e),this.setXYZ(t,ht.x,ht.y,ht.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)ht.fromBufferAttribute(this,t),ht.transformDirection(e),this.setXYZ(t,ht.x,ht.y,ht.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Ui(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Pt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Ui(t,this.array)),t}setX(e,t){return this.normalized&&(t=Pt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Ui(t,this.array)),t}setY(e,t){return this.normalized&&(t=Pt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Ui(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Pt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Ui(t,this.array)),t}setW(e,t){return this.normalized&&(t=Pt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Pt(t,this.array),n=Pt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=Pt(t,this.array),n=Pt(n,this.array),s=Pt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=Pt(t,this.array),n=Pt(n,this.array),s=Pt(s,this.array),r=Pt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Yo&&(e.usage=this.usage),e}}class Nl extends Qt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Ol extends Qt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class vt extends Qt{constructor(e,t,n){super(new Float32Array(e),t,n)}}let Ih=0;const Ht=new ut,fr=new yt,oi=new I,Nt=new Yi,Bi=new Yi,gt=new I;class Dt extends qn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ih++}),this.uuid=Xi(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Pl(e)?Ol:Nl)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new je().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Ht.makeRotationFromQuaternion(e),this.applyMatrix4(Ht),this}rotateX(e){return Ht.makeRotationX(e),this.applyMatrix4(Ht),this}rotateY(e){return Ht.makeRotationY(e),this.applyMatrix4(Ht),this}rotateZ(e){return Ht.makeRotationZ(e),this.applyMatrix4(Ht),this}translate(e,t,n){return Ht.makeTranslation(e,t,n),this.applyMatrix4(Ht),this}scale(e,t,n){return Ht.makeScale(e,t,n),this.applyMatrix4(Ht),this}lookAt(e){return fr.lookAt(e),fr.updateMatrix(),this.applyMatrix4(fr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(oi).negate(),this.translate(oi.x,oi.y,oi.z),this}setFromPoints(e){const t=[];for(let n=0,s=e.length;n<s;n++){const r=e[n];t.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new vt(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Yi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];Nt.setFromBufferAttribute(r),this.morphTargetsRelative?(gt.addVectors(this.boundingBox.min,Nt.min),this.boundingBox.expandByPoint(gt),gt.addVectors(this.boundingBox.max,Nt.max),this.boundingBox.expandByPoint(gt)):(this.boundingBox.expandByPoint(Nt.min),this.boundingBox.expandByPoint(Nt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Os);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new I,1/0);return}if(e){const n=this.boundingSphere.center;if(Nt.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];Bi.setFromBufferAttribute(o),this.morphTargetsRelative?(gt.addVectors(Nt.min,Bi.min),Nt.expandByPoint(gt),gt.addVectors(Nt.max,Bi.max),Nt.expandByPoint(gt)):(Nt.expandByPoint(Bi.min),Nt.expandByPoint(Bi.max))}Nt.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)gt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(gt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let u=0,d=o.count;u<d;u++)gt.fromBufferAttribute(o,u),l&&(oi.fromBufferAttribute(e,u),gt.add(oi)),s=Math.max(s,n.distanceToSquared(gt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.array,s=t.position.array,r=t.normal.array,a=t.uv.array,o=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Qt(new Float32Array(4*o),4));const l=this.getAttribute("tangent").array,u=[],d=[];for(let w=0;w<o;w++)u[w]=new I,d[w]=new I;const f=new I,h=new I,m=new I,g=new Ue,_=new Ue,p=new Ue,c=new I,x=new I;function v(w,O,F){f.fromArray(s,w*3),h.fromArray(s,O*3),m.fromArray(s,F*3),g.fromArray(a,w*2),_.fromArray(a,O*2),p.fromArray(a,F*2),h.sub(f),m.sub(f),_.sub(g),p.sub(g);const Y=1/(_.x*p.y-p.x*_.y);isFinite(Y)&&(c.copy(h).multiplyScalar(p.y).addScaledVector(m,-_.y).multiplyScalar(Y),x.copy(m).multiplyScalar(_.x).addScaledVector(h,-p.x).multiplyScalar(Y),u[w].add(c),u[O].add(c),u[F].add(c),d[w].add(x),d[O].add(x),d[F].add(x))}let M=this.groups;M.length===0&&(M=[{start:0,count:n.length}]);for(let w=0,O=M.length;w<O;++w){const F=M[w],Y=F.start,D=F.count;for(let B=Y,X=Y+D;B<X;B+=3)v(n[B+0],n[B+1],n[B+2])}const E=new I,T=new I,b=new I,N=new I;function y(w){b.fromArray(r,w*3),N.copy(b);const O=u[w];E.copy(O),E.sub(b.multiplyScalar(b.dot(O))).normalize(),T.crossVectors(N,O);const Y=T.dot(d[w])<0?-1:1;l[w*4]=E.x,l[w*4+1]=E.y,l[w*4+2]=E.z,l[w*4+3]=Y}for(let w=0,O=M.length;w<O;++w){const F=M[w],Y=F.start,D=F.count;for(let B=Y,X=Y+D;B<X;B+=3)y(n[B+0]),y(n[B+1]),y(n[B+2])}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Qt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let h=0,m=n.count;h<m;h++)n.setXYZ(h,0,0,0);const s=new I,r=new I,a=new I,o=new I,l=new I,u=new I,d=new I,f=new I;if(e)for(let h=0,m=e.count;h<m;h+=3){const g=e.getX(h+0),_=e.getX(h+1),p=e.getX(h+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,_),a.fromBufferAttribute(t,p),d.subVectors(a,r),f.subVectors(s,r),d.cross(f),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),u.fromBufferAttribute(n,p),o.add(d),l.add(d),u.add(d),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(p,u.x,u.y,u.z)}else for(let h=0,m=t.count;h<m;h+=3)s.fromBufferAttribute(t,h+0),r.fromBufferAttribute(t,h+1),a.fromBufferAttribute(t,h+2),d.subVectors(a,r),f.subVectors(s,r),d.cross(f),n.setXYZ(h+0,d.x,d.y,d.z),n.setXYZ(h+1,d.x,d.y,d.z),n.setXYZ(h+2,d.x,d.y,d.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)gt.fromBufferAttribute(e,t),gt.normalize(),e.setXYZ(t,gt.x,gt.y,gt.z)}toNonIndexed(){function e(o,l){const u=o.array,d=o.itemSize,f=o.normalized,h=new u.constructor(l.length*d);let m=0,g=0;for(let _=0,p=l.length;_<p;_++){o.isInterleavedBufferAttribute?m=l[_]*o.data.stride+o.offset:m=l[_]*d;for(let c=0;c<d;c++)h[g++]=u[m++]}return new Qt(h,d,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Dt,n=this.index.array,s=this.attributes;for(const o in s){const l=s[o],u=e(l,n);t.setAttribute(o,u)}const r=this.morphAttributes;for(const o in r){const l=[],u=r[o];for(let d=0,f=u.length;d<f;d++){const h=u[d],m=e(h,n);l.push(m)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const u=a[o];t.addGroup(u.start,u.count,u.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const u in l)l[u]!==void 0&&(e[u]=l[u]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const u=n[l];e.data.attributes[l]=u.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const u=this.morphAttributes[l],d=[];for(let f=0,h=u.length;f<h;f++){const m=u[f];d.push(m.toJSON(e.data))}d.length>0&&(s[l]=d,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const s=e.attributes;for(const u in s){const d=s[u];this.setAttribute(u,d.clone(t))}const r=e.morphAttributes;for(const u in r){const d=[],f=r[u];for(let h=0,m=f.length;h<m;h++)d.push(f[h].clone(t));this.morphAttributes[u]=d}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let u=0,d=a.length;u<d;u++){const f=a[u];this.addGroup(f.start,f.count,f.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const oa=new ut,Ln=new Fs,as=new Os,aa=new I,ai=new I,li=new I,ci=new I,pr=new I,ls=new I,cs=new Ue,hs=new Ue,us=new Ue,la=new I,ca=new I,ha=new I,ds=new I,fs=new I;class At extends yt{constructor(e=new Dt,t=new gi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){ls.set(0,0,0);for(let l=0,u=r.length;l<u;l++){const d=o[l],f=r[l];d!==0&&(pr.fromBufferAttribute(f,e),a?ls.addScaledVector(pr,d):ls.addScaledVector(pr.sub(t),d))}t.add(ls)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),as.copy(n.boundingSphere),as.applyMatrix4(r),Ln.copy(e.ray).recast(e.near),!(as.containsPoint(Ln.origin)===!1&&(Ln.intersectSphere(as,aa)===null||Ln.origin.distanceToSquared(aa)>(e.far-e.near)**2))&&(oa.copy(r).invert(),Ln.copy(e.ray).applyMatrix4(oa),!(n.boundingBox!==null&&Ln.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Ln)))}_computeIntersections(e,t,n){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,u=r.attributes.uv,d=r.attributes.uv1,f=r.attributes.normal,h=r.groups,m=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=h.length;g<_;g++){const p=h[g],c=a[p.materialIndex],x=Math.max(p.start,m.start),v=Math.min(o.count,Math.min(p.start+p.count,m.start+m.count));for(let M=x,E=v;M<E;M+=3){const T=o.getX(M),b=o.getX(M+1),N=o.getX(M+2);s=ps(this,c,e,n,u,d,f,T,b,N),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const g=Math.max(0,m.start),_=Math.min(o.count,m.start+m.count);for(let p=g,c=_;p<c;p+=3){const x=o.getX(p),v=o.getX(p+1),M=o.getX(p+2);s=ps(this,a,e,n,u,d,f,x,v,M),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,_=h.length;g<_;g++){const p=h[g],c=a[p.materialIndex],x=Math.max(p.start,m.start),v=Math.min(l.count,Math.min(p.start+p.count,m.start+m.count));for(let M=x,E=v;M<E;M+=3){const T=M,b=M+1,N=M+2;s=ps(this,c,e,n,u,d,f,T,b,N),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const g=Math.max(0,m.start),_=Math.min(l.count,m.start+m.count);for(let p=g,c=_;p<c;p+=3){const x=p,v=p+1,M=p+2;s=ps(this,a,e,n,u,d,f,x,v,M),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}}}function Uh(i,e,t,n,s,r,a,o){let l;if(e.side===Lt?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,e.side===An,o),l===null)return null;fs.copy(o),fs.applyMatrix4(i.matrixWorld);const u=t.ray.origin.distanceTo(fs);return u<t.near||u>t.far?null:{distance:u,point:fs.clone(),object:i}}function ps(i,e,t,n,s,r,a,o,l,u){i.getVertexPosition(o,ai),i.getVertexPosition(l,li),i.getVertexPosition(u,ci);const d=Uh(i,e,t,n,ai,li,ci,ds);if(d){s&&(cs.fromBufferAttribute(s,o),hs.fromBufferAttribute(s,l),us.fromBufferAttribute(s,u),d.uv=kt.getInterpolation(ds,ai,li,ci,cs,hs,us,new Ue)),r&&(cs.fromBufferAttribute(r,o),hs.fromBufferAttribute(r,l),us.fromBufferAttribute(r,u),d.uv1=kt.getInterpolation(ds,ai,li,ci,cs,hs,us,new Ue),d.uv2=d.uv1),a&&(la.fromBufferAttribute(a,o),ca.fromBufferAttribute(a,l),ha.fromBufferAttribute(a,u),d.normal=kt.getInterpolation(ds,ai,li,ci,la,ca,ha,new I),d.normal.dot(n.direction)>0&&d.normal.multiplyScalar(-1));const f={a:o,b:l,c:u,normal:new I,materialIndex:0};kt.getNormal(ai,li,ci,f.normal),d.face=f}return d}class dn extends Dt{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],u=[],d=[],f=[];let h=0,m=0;g("z","y","x",-1,-1,n,t,e,a,r,0),g("z","y","x",1,-1,n,t,-e,a,r,1),g("x","z","y",1,1,e,n,t,s,a,2),g("x","z","y",1,-1,e,n,-t,s,a,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new vt(u,3)),this.setAttribute("normal",new vt(d,3)),this.setAttribute("uv",new vt(f,2));function g(_,p,c,x,v,M,E,T,b,N,y){const w=M/b,O=E/N,F=M/2,Y=E/2,D=T/2,B=b+1,X=N+1;let j=0,q=0;const K=new I;for(let $=0;$<X;$++){const se=$*O-Y;for(let oe=0;oe<B;oe++){const V=oe*w-F;K[_]=V*x,K[p]=se*v,K[c]=D,u.push(K.x,K.y,K.z),K[_]=0,K[p]=0,K[c]=T>0?1:-1,d.push(K.x,K.y,K.z),f.push(oe/b),f.push(1-$/N),j+=1}}for(let $=0;$<N;$++)for(let se=0;se<b;se++){const oe=h+se+B*$,V=h+se+B*($+1),Z=h+(se+1)+B*($+1),ce=h+(se+1)+B*$;l.push(oe,V,ce),l.push(V,Z,ce),q+=6}o.addGroup(m,q,y),m+=q,h+=j}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new dn(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function wi(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function wt(i){const e={};for(let t=0;t<i.length;t++){const n=wi(i[t]);for(const s in n)e[s]=n[s]}return e}function Nh(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Fl(i){return i.getRenderTarget()===null?i.outputColorSpace:tt.workingColorSpace}const Oh={clone:wi,merge:wt};var Fh=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Bh=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Yn extends Ci{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Fh,this.fragmentShader=Bh,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=wi(e.uniforms),this.uniformsGroups=Nh(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class Bl extends yt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ut,this.projectionMatrix=new ut,this.projectionMatrixInverse=new ut,this.coordinateSystem=un}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class Vt extends Bl{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Or*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Hi*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Or*2*Math.atan(Math.tan(Hi*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Hi*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,u=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*n/u,s*=a.width/l,n*=a.height/u}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const hi=-90,ui=1;class zh extends yt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Vt(hi,ui,e,t);s.layers=this.layers,this.add(s);const r=new Vt(hi,ui,e,t);r.layers=this.layers,this.add(r);const a=new Vt(hi,ui,e,t);a.layers=this.layers,this.add(a);const o=new Vt(hi,ui,e,t);o.layers=this.layers,this.add(o);const l=new Vt(hi,ui,e,t);l.layers=this.layers,this.add(l);const u=new Vt(hi,ui,e,t);u.layers=this.layers,this.add(u)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,l]=t;for(const u of t)this.remove(u);if(e===un)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Ls)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const u of t)this.add(u),u.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,u,d]=this.children,f=e.getRenderTarget(),h=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,a),e.setRenderTarget(n,2,s),e.render(t,o),e.setRenderTarget(n,3,s),e.render(t,l),e.setRenderTarget(n,4,s),e.render(t,u),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,s),e.render(t,d),e.setRenderTarget(f,h,m),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class zl extends Bt{constructor(e,t,n,s,r,a,o,l,u,d){e=e!==void 0?e:[],t=t!==void 0?t:Ti,super(e,t,n,s,r,a,o,l,u,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Hh extends Wn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];t.encoding!==void 0&&(Gi("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),t.colorSpace=t.encoding===Hn?xt:Wt),this.texture=new zl(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Gt}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new dn(5,5,5),r=new Yn({name:"CubemapFromEquirect",uniforms:wi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Lt,blending:yn});r.uniforms.tEquirect.value=t;const a=new At(s,r),o=t.minFilter;return t.minFilter===ki&&(t.minFilter=Gt),new zh(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,n,s){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}}const mr=new I,Gh=new I,kh=new je;class Mn{constructor(e=new I(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=mr.subVectors(n,t).cross(Gh.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(mr),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||kh.getNormalMatrix(e),s=this.coplanarPoint(mr).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Dn=new Os,ms=new I;class Yr{constructor(e=new Mn,t=new Mn,n=new Mn,s=new Mn,r=new Mn,a=new Mn){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=un){const n=this.planes,s=e.elements,r=s[0],a=s[1],o=s[2],l=s[3],u=s[4],d=s[5],f=s[6],h=s[7],m=s[8],g=s[9],_=s[10],p=s[11],c=s[12],x=s[13],v=s[14],M=s[15];if(n[0].setComponents(l-r,h-u,p-m,M-c).normalize(),n[1].setComponents(l+r,h+u,p+m,M+c).normalize(),n[2].setComponents(l+a,h+d,p+g,M+x).normalize(),n[3].setComponents(l-a,h-d,p-g,M-x).normalize(),n[4].setComponents(l-o,h-f,p-_,M-v).normalize(),t===un)n[5].setComponents(l+o,h+f,p+_,M+v).normalize();else if(t===Ls)n[5].setComponents(o,f,_,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Dn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Dn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Dn)}intersectsSprite(e){return Dn.center.set(0,0,0),Dn.radius=.7071067811865476,Dn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Dn)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(ms.x=s.normal.x>0?e.max.x:e.min.x,ms.y=s.normal.y>0?e.max.y:e.min.y,ms.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(ms)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Hl(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Vh(i,e){const t=e.isWebGL2,n=new WeakMap;function s(u,d){const f=u.array,h=u.usage,m=f.byteLength,g=i.createBuffer();i.bindBuffer(d,g),i.bufferData(d,f,h),u.onUploadCallback();let _;if(f instanceof Float32Array)_=i.FLOAT;else if(f instanceof Uint16Array)if(u.isFloat16BufferAttribute)if(t)_=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else _=i.UNSIGNED_SHORT;else if(f instanceof Int16Array)_=i.SHORT;else if(f instanceof Uint32Array)_=i.UNSIGNED_INT;else if(f instanceof Int32Array)_=i.INT;else if(f instanceof Int8Array)_=i.BYTE;else if(f instanceof Uint8Array)_=i.UNSIGNED_BYTE;else if(f instanceof Uint8ClampedArray)_=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+f);return{buffer:g,type:_,bytesPerElement:f.BYTES_PER_ELEMENT,version:u.version,size:m}}function r(u,d,f){const h=d.array,m=d._updateRange,g=d.updateRanges;if(i.bindBuffer(f,u),m.count===-1&&g.length===0&&i.bufferSubData(f,0,h),g.length!==0){for(let _=0,p=g.length;_<p;_++){const c=g[_];t?i.bufferSubData(f,c.start*h.BYTES_PER_ELEMENT,h,c.start,c.count):i.bufferSubData(f,c.start*h.BYTES_PER_ELEMENT,h.subarray(c.start,c.start+c.count))}d.clearUpdateRanges()}m.count!==-1&&(t?i.bufferSubData(f,m.offset*h.BYTES_PER_ELEMENT,h,m.offset,m.count):i.bufferSubData(f,m.offset*h.BYTES_PER_ELEMENT,h.subarray(m.offset,m.offset+m.count)),m.count=-1),d.onUploadCallback()}function a(u){return u.isInterleavedBufferAttribute&&(u=u.data),n.get(u)}function o(u){u.isInterleavedBufferAttribute&&(u=u.data);const d=n.get(u);d&&(i.deleteBuffer(d.buffer),n.delete(u))}function l(u,d){if(u.isGLBufferAttribute){const h=n.get(u);(!h||h.version<u.version)&&n.set(u,{buffer:u.buffer,type:u.type,bytesPerElement:u.elementSize,version:u.version});return}u.isInterleavedBufferAttribute&&(u=u.data);const f=n.get(u);if(f===void 0)n.set(u,s(u,d));else if(f.version<u.version){if(f.size!==u.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(f.buffer,u,d),f.version=u.version}}return{get:a,remove:o,update:l}}class On extends Dt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(s),u=o+1,d=l+1,f=e/o,h=t/l,m=[],g=[],_=[],p=[];for(let c=0;c<d;c++){const x=c*h-a;for(let v=0;v<u;v++){const M=v*f-r;g.push(M,-x,0),_.push(0,0,1),p.push(v/o),p.push(1-c/l)}}for(let c=0;c<l;c++)for(let x=0;x<o;x++){const v=x+u*c,M=x+u*(c+1),E=x+1+u*(c+1),T=x+1+u*c;m.push(v,M,T),m.push(M,E,T)}this.setIndex(m),this.setAttribute("position",new vt(g,3)),this.setAttribute("normal",new vt(_,3)),this.setAttribute("uv",new vt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new On(e.width,e.height,e.widthSegments,e.heightSegments)}}var Wh=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Xh=`#ifdef USE_ALPHAHASH
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
#endif`,Yh=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,qh=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,jh=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,Kh=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,$h=`#ifdef USE_AOMAP
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
#endif`,Zh=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Jh=`#ifdef USE_BATCHING
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
#endif`,Qh=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,eu=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,tu=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,nu=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,iu=`#ifdef USE_IRIDESCENCE
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
#endif`,su=`#ifdef USE_BUMPMAP
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
#endif`,ru=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,ou=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,au=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,lu=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,cu=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,hu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,uu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,du=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,fu=`#define PI 3.141592653589793
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
} // validated`,pu=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,mu=`vec3 transformedNormal = objectNormal;
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
#endif`,gu=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,_u=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,vu=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Mu=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,xu="gl_FragColor = linearToOutputTexel( gl_FragColor );",Su=`
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
}`,yu=`#ifdef USE_ENVMAP
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
#endif`,Eu=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Tu=`#ifdef USE_ENVMAP
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
#endif`,bu=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Au=`#ifdef USE_ENVMAP
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
#endif`,wu=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Ru=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Cu=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Pu=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Lu=`#ifdef USE_GRADIENTMAP
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
}`,Du=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,Iu=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Uu=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Nu=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Ou=`uniform bool receiveShadow;
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
#endif`,Fu=`#ifdef USE_ENVMAP
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
#endif`,Bu=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,zu=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Hu=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Gu=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,ku=`PhysicalMaterial material;
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
#endif`,Vu=`struct PhysicalMaterial {
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
}`,Wu=`
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
#endif`,Xu=`#if defined( RE_IndirectDiffuse )
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
#endif`,Yu=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,qu=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,ju=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ku=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,$u=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,Zu=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Ju=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Qu=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,ed=`#if defined( USE_POINTS_UV )
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
#endif`,td=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,nd=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,id=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,sd=`#ifdef USE_MORPHNORMALS
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
#endif`,rd=`#ifdef USE_MORPHTARGETS
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
#endif`,od=`#ifdef USE_MORPHTARGETS
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
#endif`,ad=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,ld=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,cd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,hd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ud=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,dd=`#ifdef USE_NORMALMAP
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
#endif`,fd=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,pd=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,md=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,gd=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,_d=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,vd=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Md=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,xd=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Sd=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,yd=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Ed=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Td=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,bd=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Ad=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,wd=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Rd=`float getShadowMask() {
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
}`,Cd=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Pd=`#ifdef USE_SKINNING
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
#endif`,Ld=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Dd=`#ifdef USE_SKINNING
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
#endif`,Id=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Ud=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Nd=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Od=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Fd=`#ifdef USE_TRANSMISSION
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
#endif`,Bd=`#ifdef USE_TRANSMISSION
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
#endif`,zd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Hd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Gd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,kd=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Vd=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Wd=`uniform sampler2D t2D;
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
}`,Xd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Yd=`#ifdef ENVMAP_TYPE_CUBE
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
}`,qd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,jd=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Kd=`#include <common>
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
}`,$d=`#if DEPTH_PACKING == 3200
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
}`,Zd=`#define DISTANCE
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
}`,Jd=`#define DISTANCE
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
}`,Qd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,ef=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,tf=`uniform float scale;
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
}`,nf=`uniform vec3 diffuse;
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
}`,sf=`#include <common>
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
}`,rf=`uniform vec3 diffuse;
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
}`,of=`#define LAMBERT
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
}`,af=`#define LAMBERT
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
}`,lf=`#define MATCAP
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
}`,cf=`#define MATCAP
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
}`,hf=`#define NORMAL
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
}`,uf=`#define NORMAL
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
}`,df=`#define PHONG
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
}`,ff=`#define PHONG
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
}`,pf=`#define STANDARD
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
}`,mf=`#define STANDARD
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
}`,gf=`#define TOON
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
}`,_f=`#define TOON
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
}`,vf=`uniform float size;
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
}`,Mf=`uniform vec3 diffuse;
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
}`,xf=`#include <common>
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
}`,Sf=`uniform vec3 color;
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
}`,yf=`uniform float rotation;
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
}`,Ef=`uniform vec3 diffuse;
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
}`,We={alphahash_fragment:Wh,alphahash_pars_fragment:Xh,alphamap_fragment:Yh,alphamap_pars_fragment:qh,alphatest_fragment:jh,alphatest_pars_fragment:Kh,aomap_fragment:$h,aomap_pars_fragment:Zh,batching_pars_vertex:Jh,batching_vertex:Qh,begin_vertex:eu,beginnormal_vertex:tu,bsdfs:nu,iridescence_fragment:iu,bumpmap_pars_fragment:su,clipping_planes_fragment:ru,clipping_planes_pars_fragment:ou,clipping_planes_pars_vertex:au,clipping_planes_vertex:lu,color_fragment:cu,color_pars_fragment:hu,color_pars_vertex:uu,color_vertex:du,common:fu,cube_uv_reflection_fragment:pu,defaultnormal_vertex:mu,displacementmap_pars_vertex:gu,displacementmap_vertex:_u,emissivemap_fragment:vu,emissivemap_pars_fragment:Mu,colorspace_fragment:xu,colorspace_pars_fragment:Su,envmap_fragment:yu,envmap_common_pars_fragment:Eu,envmap_pars_fragment:Tu,envmap_pars_vertex:bu,envmap_physical_pars_fragment:Fu,envmap_vertex:Au,fog_vertex:wu,fog_pars_vertex:Ru,fog_fragment:Cu,fog_pars_fragment:Pu,gradientmap_pars_fragment:Lu,lightmap_fragment:Du,lightmap_pars_fragment:Iu,lights_lambert_fragment:Uu,lights_lambert_pars_fragment:Nu,lights_pars_begin:Ou,lights_toon_fragment:Bu,lights_toon_pars_fragment:zu,lights_phong_fragment:Hu,lights_phong_pars_fragment:Gu,lights_physical_fragment:ku,lights_physical_pars_fragment:Vu,lights_fragment_begin:Wu,lights_fragment_maps:Xu,lights_fragment_end:Yu,logdepthbuf_fragment:qu,logdepthbuf_pars_fragment:ju,logdepthbuf_pars_vertex:Ku,logdepthbuf_vertex:$u,map_fragment:Zu,map_pars_fragment:Ju,map_particle_fragment:Qu,map_particle_pars_fragment:ed,metalnessmap_fragment:td,metalnessmap_pars_fragment:nd,morphcolor_vertex:id,morphnormal_vertex:sd,morphtarget_pars_vertex:rd,morphtarget_vertex:od,normal_fragment_begin:ad,normal_fragment_maps:ld,normal_pars_fragment:cd,normal_pars_vertex:hd,normal_vertex:ud,normalmap_pars_fragment:dd,clearcoat_normal_fragment_begin:fd,clearcoat_normal_fragment_maps:pd,clearcoat_pars_fragment:md,iridescence_pars_fragment:gd,opaque_fragment:_d,packing:vd,premultiplied_alpha_fragment:Md,project_vertex:xd,dithering_fragment:Sd,dithering_pars_fragment:yd,roughnessmap_fragment:Ed,roughnessmap_pars_fragment:Td,shadowmap_pars_fragment:bd,shadowmap_pars_vertex:Ad,shadowmap_vertex:wd,shadowmask_pars_fragment:Rd,skinbase_vertex:Cd,skinning_pars_vertex:Pd,skinning_vertex:Ld,skinnormal_vertex:Dd,specularmap_fragment:Id,specularmap_pars_fragment:Ud,tonemapping_fragment:Nd,tonemapping_pars_fragment:Od,transmission_fragment:Fd,transmission_pars_fragment:Bd,uv_pars_fragment:zd,uv_pars_vertex:Hd,uv_vertex:Gd,worldpos_vertex:kd,background_vert:Vd,background_frag:Wd,backgroundCube_vert:Xd,backgroundCube_frag:Yd,cube_vert:qd,cube_frag:jd,depth_vert:Kd,depth_frag:$d,distanceRGBA_vert:Zd,distanceRGBA_frag:Jd,equirect_vert:Qd,equirect_frag:ef,linedashed_vert:tf,linedashed_frag:nf,meshbasic_vert:sf,meshbasic_frag:rf,meshlambert_vert:of,meshlambert_frag:af,meshmatcap_vert:lf,meshmatcap_frag:cf,meshnormal_vert:hf,meshnormal_frag:uf,meshphong_vert:df,meshphong_frag:ff,meshphysical_vert:pf,meshphysical_frag:mf,meshtoon_vert:gf,meshtoon_frag:_f,points_vert:vf,points_frag:Mf,shadow_vert:xf,shadow_frag:Sf,sprite_vert:yf,sprite_frag:Ef},he={common:{diffuse:{value:new Ze(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new je},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new je}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new je}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new je}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new je},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new je},normalScale:{value:new Ue(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new je},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new je}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new je}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new je}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ze(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ze(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0},uvTransform:{value:new je}},sprite:{diffuse:{value:new Ze(16777215)},opacity:{value:1},center:{value:new Ue(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new je},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0}}},nn={basic:{uniforms:wt([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.fog]),vertexShader:We.meshbasic_vert,fragmentShader:We.meshbasic_frag},lambert:{uniforms:wt([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.fog,he.lights,{emissive:{value:new Ze(0)}}]),vertexShader:We.meshlambert_vert,fragmentShader:We.meshlambert_frag},phong:{uniforms:wt([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.fog,he.lights,{emissive:{value:new Ze(0)},specular:{value:new Ze(1118481)},shininess:{value:30}}]),vertexShader:We.meshphong_vert,fragmentShader:We.meshphong_frag},standard:{uniforms:wt([he.common,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.roughnessmap,he.metalnessmap,he.fog,he.lights,{emissive:{value:new Ze(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:We.meshphysical_vert,fragmentShader:We.meshphysical_frag},toon:{uniforms:wt([he.common,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.gradientmap,he.fog,he.lights,{emissive:{value:new Ze(0)}}]),vertexShader:We.meshtoon_vert,fragmentShader:We.meshtoon_frag},matcap:{uniforms:wt([he.common,he.bumpmap,he.normalmap,he.displacementmap,he.fog,{matcap:{value:null}}]),vertexShader:We.meshmatcap_vert,fragmentShader:We.meshmatcap_frag},points:{uniforms:wt([he.points,he.fog]),vertexShader:We.points_vert,fragmentShader:We.points_frag},dashed:{uniforms:wt([he.common,he.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:We.linedashed_vert,fragmentShader:We.linedashed_frag},depth:{uniforms:wt([he.common,he.displacementmap]),vertexShader:We.depth_vert,fragmentShader:We.depth_frag},normal:{uniforms:wt([he.common,he.bumpmap,he.normalmap,he.displacementmap,{opacity:{value:1}}]),vertexShader:We.meshnormal_vert,fragmentShader:We.meshnormal_frag},sprite:{uniforms:wt([he.sprite,he.fog]),vertexShader:We.sprite_vert,fragmentShader:We.sprite_frag},background:{uniforms:{uvTransform:{value:new je},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:We.background_vert,fragmentShader:We.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:We.backgroundCube_vert,fragmentShader:We.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:We.cube_vert,fragmentShader:We.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:We.equirect_vert,fragmentShader:We.equirect_frag},distanceRGBA:{uniforms:wt([he.common,he.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:We.distanceRGBA_vert,fragmentShader:We.distanceRGBA_frag},shadow:{uniforms:wt([he.lights,he.fog,{color:{value:new Ze(0)},opacity:{value:1}}]),vertexShader:We.shadow_vert,fragmentShader:We.shadow_frag}};nn.physical={uniforms:wt([nn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new je},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new je},clearcoatNormalScale:{value:new Ue(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new je},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new je},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new je},sheen:{value:0},sheenColor:{value:new Ze(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new je},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new je},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new je},transmissionSamplerSize:{value:new Ue},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new je},attenuationDistance:{value:0},attenuationColor:{value:new Ze(0)},specularColor:{value:new Ze(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new je},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new je},anisotropyVector:{value:new Ue},anisotropyMap:{value:null},anisotropyMapTransform:{value:new je}}]),vertexShader:We.meshphysical_vert,fragmentShader:We.meshphysical_frag};const gs={r:0,b:0,g:0};function Tf(i,e,t,n,s,r,a){const o=new Ze(0);let l=r===!0?0:1,u,d,f=null,h=0,m=null;function g(p,c){let x=!1,v=c.isScene===!0?c.background:null;v&&v.isTexture&&(v=(c.backgroundBlurriness>0?t:e).get(v)),v===null?_(o,l):v&&v.isColor&&(_(v,1),x=!0);const M=i.xr.getEnvironmentBlendMode();M==="additive"?n.buffers.color.setClear(0,0,0,1,a):M==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||x)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),v&&(v.isCubeTexture||v.mapping===Us)?(d===void 0&&(d=new At(new dn(1,1,1),new Yn({name:"BackgroundCubeMaterial",uniforms:wi(nn.backgroundCube.uniforms),vertexShader:nn.backgroundCube.vertexShader,fragmentShader:nn.backgroundCube.fragmentShader,side:Lt,depthTest:!1,depthWrite:!1,fog:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(E,T,b){this.matrixWorld.copyPosition(b.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(d)),d.material.uniforms.envMap.value=v,d.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=c.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=c.backgroundIntensity,d.material.toneMapped=tt.getTransfer(v.colorSpace)!==nt,(f!==v||h!==v.version||m!==i.toneMapping)&&(d.material.needsUpdate=!0,f=v,h=v.version,m=i.toneMapping),d.layers.enableAll(),p.unshift(d,d.geometry,d.material,0,0,null)):v&&v.isTexture&&(u===void 0&&(u=new At(new On(2,2),new Yn({name:"BackgroundMaterial",uniforms:wi(nn.background.uniforms),vertexShader:nn.background.vertexShader,fragmentShader:nn.background.fragmentShader,side:An,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),Object.defineProperty(u.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(u)),u.material.uniforms.t2D.value=v,u.material.uniforms.backgroundIntensity.value=c.backgroundIntensity,u.material.toneMapped=tt.getTransfer(v.colorSpace)!==nt,v.matrixAutoUpdate===!0&&v.updateMatrix(),u.material.uniforms.uvTransform.value.copy(v.matrix),(f!==v||h!==v.version||m!==i.toneMapping)&&(u.material.needsUpdate=!0,f=v,h=v.version,m=i.toneMapping),u.layers.enableAll(),p.unshift(u,u.geometry,u.material,0,0,null))}function _(p,c){p.getRGB(gs,Fl(i)),n.buffers.color.setClear(gs.r,gs.g,gs.b,c,a)}return{getClearColor:function(){return o},setClearColor:function(p,c=1){o.set(p),l=c,_(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(p){l=p,_(o,l)},render:g}}function bf(i,e,t,n){const s=i.getParameter(i.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:e.get("OES_vertex_array_object"),a=n.isWebGL2||r!==null,o={},l=p(null);let u=l,d=!1;function f(D,B,X,j,q){let K=!1;if(a){const $=_(j,X,B);u!==$&&(u=$,m(u.object)),K=c(D,j,X,q),K&&x(D,j,X,q)}else{const $=B.wireframe===!0;(u.geometry!==j.id||u.program!==X.id||u.wireframe!==$)&&(u.geometry=j.id,u.program=X.id,u.wireframe=$,K=!0)}q!==null&&t.update(q,i.ELEMENT_ARRAY_BUFFER),(K||d)&&(d=!1,N(D,B,X,j),q!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(q).buffer))}function h(){return n.isWebGL2?i.createVertexArray():r.createVertexArrayOES()}function m(D){return n.isWebGL2?i.bindVertexArray(D):r.bindVertexArrayOES(D)}function g(D){return n.isWebGL2?i.deleteVertexArray(D):r.deleteVertexArrayOES(D)}function _(D,B,X){const j=X.wireframe===!0;let q=o[D.id];q===void 0&&(q={},o[D.id]=q);let K=q[B.id];K===void 0&&(K={},q[B.id]=K);let $=K[j];return $===void 0&&($=p(h()),K[j]=$),$}function p(D){const B=[],X=[],j=[];for(let q=0;q<s;q++)B[q]=0,X[q]=0,j[q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:B,enabledAttributes:X,attributeDivisors:j,object:D,attributes:{},index:null}}function c(D,B,X,j){const q=u.attributes,K=B.attributes;let $=0;const se=X.getAttributes();for(const oe in se)if(se[oe].location>=0){const Z=q[oe];let ce=K[oe];if(ce===void 0&&(oe==="instanceMatrix"&&D.instanceMatrix&&(ce=D.instanceMatrix),oe==="instanceColor"&&D.instanceColor&&(ce=D.instanceColor)),Z===void 0||Z.attribute!==ce||ce&&Z.data!==ce.data)return!0;$++}return u.attributesNum!==$||u.index!==j}function x(D,B,X,j){const q={},K=B.attributes;let $=0;const se=X.getAttributes();for(const oe in se)if(se[oe].location>=0){let Z=K[oe];Z===void 0&&(oe==="instanceMatrix"&&D.instanceMatrix&&(Z=D.instanceMatrix),oe==="instanceColor"&&D.instanceColor&&(Z=D.instanceColor));const ce={};ce.attribute=Z,Z&&Z.data&&(ce.data=Z.data),q[oe]=ce,$++}u.attributes=q,u.attributesNum=$,u.index=j}function v(){const D=u.newAttributes;for(let B=0,X=D.length;B<X;B++)D[B]=0}function M(D){E(D,0)}function E(D,B){const X=u.newAttributes,j=u.enabledAttributes,q=u.attributeDivisors;X[D]=1,j[D]===0&&(i.enableVertexAttribArray(D),j[D]=1),q[D]!==B&&((n.isWebGL2?i:e.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](D,B),q[D]=B)}function T(){const D=u.newAttributes,B=u.enabledAttributes;for(let X=0,j=B.length;X<j;X++)B[X]!==D[X]&&(i.disableVertexAttribArray(X),B[X]=0)}function b(D,B,X,j,q,K,$){$===!0?i.vertexAttribIPointer(D,B,X,q,K):i.vertexAttribPointer(D,B,X,j,q,K)}function N(D,B,X,j){if(n.isWebGL2===!1&&(D.isInstancedMesh||j.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;v();const q=j.attributes,K=X.getAttributes(),$=B.defaultAttributeValues;for(const se in K){const oe=K[se];if(oe.location>=0){let V=q[se];if(V===void 0&&(se==="instanceMatrix"&&D.instanceMatrix&&(V=D.instanceMatrix),se==="instanceColor"&&D.instanceColor&&(V=D.instanceColor)),V!==void 0){const Z=V.normalized,ce=V.itemSize,Me=t.get(V);if(Me===void 0)continue;const ve=Me.buffer,Ce=Me.type,Le=Me.bytesPerElement,be=n.isWebGL2===!0&&(Ce===i.INT||Ce===i.UNSIGNED_INT||V.gpuType===xl);if(V.isInterleavedBufferAttribute){const Ve=V.data,H=Ve.stride,dt=V.offset;if(Ve.isInstancedInterleavedBuffer){for(let Ee=0;Ee<oe.locationSize;Ee++)E(oe.location+Ee,Ve.meshPerAttribute);D.isInstancedMesh!==!0&&j._maxInstanceCount===void 0&&(j._maxInstanceCount=Ve.meshPerAttribute*Ve.count)}else for(let Ee=0;Ee<oe.locationSize;Ee++)M(oe.location+Ee);i.bindBuffer(i.ARRAY_BUFFER,ve);for(let Ee=0;Ee<oe.locationSize;Ee++)b(oe.location+Ee,ce/oe.locationSize,Ce,Z,H*Le,(dt+ce/oe.locationSize*Ee)*Le,be)}else{if(V.isInstancedBufferAttribute){for(let Ve=0;Ve<oe.locationSize;Ve++)E(oe.location+Ve,V.meshPerAttribute);D.isInstancedMesh!==!0&&j._maxInstanceCount===void 0&&(j._maxInstanceCount=V.meshPerAttribute*V.count)}else for(let Ve=0;Ve<oe.locationSize;Ve++)M(oe.location+Ve);i.bindBuffer(i.ARRAY_BUFFER,ve);for(let Ve=0;Ve<oe.locationSize;Ve++)b(oe.location+Ve,ce/oe.locationSize,Ce,Z,ce*Le,ce/oe.locationSize*Ve*Le,be)}}else if($!==void 0){const Z=$[se];if(Z!==void 0)switch(Z.length){case 2:i.vertexAttrib2fv(oe.location,Z);break;case 3:i.vertexAttrib3fv(oe.location,Z);break;case 4:i.vertexAttrib4fv(oe.location,Z);break;default:i.vertexAttrib1fv(oe.location,Z)}}}}T()}function y(){F();for(const D in o){const B=o[D];for(const X in B){const j=B[X];for(const q in j)g(j[q].object),delete j[q];delete B[X]}delete o[D]}}function w(D){if(o[D.id]===void 0)return;const B=o[D.id];for(const X in B){const j=B[X];for(const q in j)g(j[q].object),delete j[q];delete B[X]}delete o[D.id]}function O(D){for(const B in o){const X=o[B];if(X[D.id]===void 0)continue;const j=X[D.id];for(const q in j)g(j[q].object),delete j[q];delete X[D.id]}}function F(){Y(),d=!0,u!==l&&(u=l,m(u.object))}function Y(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:f,reset:F,resetDefaultState:Y,dispose:y,releaseStatesOfGeometry:w,releaseStatesOfProgram:O,initAttributes:v,enableAttribute:M,disableUnusedAttributes:T}}function Af(i,e,t,n){const s=n.isWebGL2;let r;function a(d){r=d}function o(d,f){i.drawArrays(r,d,f),t.update(f,r,1)}function l(d,f,h){if(h===0)return;let m,g;if(s)m=i,g="drawArraysInstanced";else if(m=e.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",m===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[g](r,d,f,h),t.update(f,r,h)}function u(d,f,h){if(h===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<h;g++)this.render(d[g],f[g]);else{m.multiDrawArraysWEBGL(r,d,0,f,0,h);let g=0;for(let _=0;_<h;_++)g+=f[_];t.update(g,r,1)}}this.setMode=a,this.render=o,this.renderInstances=l,this.renderMultiDraw=u}function wf(i,e,t){let n;function s(){if(n!==void 0)return n;if(e.has("EXT_texture_filter_anisotropic")===!0){const b=e.get("EXT_texture_filter_anisotropic");n=i.getParameter(b.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(b){if(b==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";b="mediump"}return b==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const a=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext";let o=t.precision!==void 0?t.precision:"highp";const l=r(o);l!==o&&(console.warn("THREE.WebGLRenderer:",o,"not supported, using",l,"instead."),o=l);const u=a||e.has("WEBGL_draw_buffers"),d=t.logarithmicDepthBuffer===!0,f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),h=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),_=i.getParameter(i.MAX_VERTEX_ATTRIBS),p=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),c=i.getParameter(i.MAX_VARYING_VECTORS),x=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),v=h>0,M=a||e.has("OES_texture_float"),E=v&&M,T=a?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:a,drawBuffers:u,getMaxAnisotropy:s,getMaxPrecision:r,precision:o,logarithmicDepthBuffer:d,maxTextures:f,maxVertexTextures:h,maxTextureSize:m,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:p,maxVaryings:c,maxFragmentUniforms:x,vertexTextures:v,floatFragmentTextures:M,floatVertexTextures:E,maxSamples:T}}function Rf(i){const e=this;let t=null,n=0,s=!1,r=!1;const a=new Mn,o=new je,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,h){const m=f.length!==0||h||n!==0||s;return s=h,n=f.length,m},this.beginShadows=function(){r=!0,d(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,h){t=d(f,h,0)},this.setState=function(f,h,m){const g=f.clippingPlanes,_=f.clipIntersection,p=f.clipShadows,c=i.get(f);if(!s||g===null||g.length===0||r&&!p)r?d(null):u();else{const x=r?0:n,v=x*4;let M=c.clippingState||null;l.value=M,M=d(g,h,v,m);for(let E=0;E!==v;++E)M[E]=t[E];c.clippingState=M,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=x}};function u(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function d(f,h,m,g){const _=f!==null?f.length:0;let p=null;if(_!==0){if(p=l.value,g!==!0||p===null){const c=m+_*4,x=h.matrixWorldInverse;o.getNormalMatrix(x),(p===null||p.length<c)&&(p=new Float32Array(c));for(let v=0,M=m;v!==_;++v,M+=4)a.copy(f[v]).applyMatrix4(x,o),a.normal.toArray(p,M),p[M+3]=a.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,p}}function Cf(i){let e=new WeakMap;function t(a,o){return o===Lr?a.mapping=Ti:o===Dr&&(a.mapping=bi),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===Lr||o===Dr)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const u=new Hh(l.height/2);return u.fromEquirectangularTexture(i,a),e.set(a,u),a.addEventListener("dispose",s),t(u.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}class Gl extends Bl{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const u=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=u*this.view.offsetX,a=r+u*this.view.width,o-=d*this.view.offsetY,l=o-d*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const _i=4,ua=[.125,.215,.35,.446,.526,.582],Nn=20,gr=new Gl,da=new Ze;let _r=null,vr=0,Mr=0;const In=(1+Math.sqrt(5))/2,di=1/In,fa=[new I(1,1,1),new I(-1,1,1),new I(1,1,-1),new I(-1,1,-1),new I(0,In,di),new I(0,In,-di),new I(di,0,In),new I(-di,0,In),new I(In,di,0),new I(-In,di,0)];class pa{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100){_r=this._renderer.getRenderTarget(),vr=this._renderer.getActiveCubeFace(),Mr=this._renderer.getActiveMipmapLevel(),this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,s,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=_a(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ga(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(_r,vr,Mr),e.scissorTest=!1,_s(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ti||e.mapping===bi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),_r=this._renderer.getRenderTarget(),vr=this._renderer.getActiveCubeFace(),Mr=this._renderer.getActiveMipmapLevel();const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Gt,minFilter:Gt,generateMipmaps:!1,type:Vi,format:Zt,colorSpace:fn,depthBuffer:!1},s=ma(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ma(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Pf(r)),this._blurMaterial=Lf(r,e,t)}return s}_compileMaterial(e){const t=new At(this._lodPlanes[0],e);this._renderer.compile(t,gr)}_sceneToCubeUV(e,t,n,s){const o=new Vt(90,1,t,n),l=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],d=this._renderer,f=d.autoClear,h=d.toneMapping;d.getClearColor(da),d.toneMapping=En,d.autoClear=!1;const m=new gi({name:"PMREM.Background",side:Lt,depthWrite:!1,depthTest:!1}),g=new At(new dn,m);let _=!1;const p=e.background;p?p.isColor&&(m.color.copy(p),e.background=null,_=!0):(m.color.copy(da),_=!0);for(let c=0;c<6;c++){const x=c%3;x===0?(o.up.set(0,l[c],0),o.lookAt(u[c],0,0)):x===1?(o.up.set(0,0,l[c]),o.lookAt(0,u[c],0)):(o.up.set(0,l[c],0),o.lookAt(0,0,u[c]));const v=this._cubeSize;_s(s,x*v,c>2?v:0,v,v),d.setRenderTarget(s),_&&d.render(g,o),d.render(e,o)}g.geometry.dispose(),g.material.dispose(),d.toneMapping=h,d.autoClear=f,e.background=p}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===Ti||e.mapping===bi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=_a()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ga());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new At(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;_s(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,gr)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){const r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=fa[(s-1)%fa.length];this._blur(e,s-1,s,r,a)}t.autoClear=n}_blur(e,t,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){const l=this._renderer,u=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const d=3,f=new At(this._lodPlanes[s],u),h=u.uniforms,m=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*Nn-1),_=r/g,p=isFinite(r)?1+Math.floor(d*_):Nn;p>Nn&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Nn}`);const c=[];let x=0;for(let b=0;b<Nn;++b){const N=b/_,y=Math.exp(-N*N/2);c.push(y),b===0?x+=y:b<p&&(x+=2*y)}for(let b=0;b<c.length;b++)c[b]=c[b]/x;h.envMap.value=e.texture,h.samples.value=p,h.weights.value=c,h.latitudinal.value=a==="latitudinal",o&&(h.poleAxis.value=o);const{_lodMax:v}=this;h.dTheta.value=g,h.mipInt.value=v-n;const M=this._sizeLods[s],E=3*M*(s>v-_i?s-v+_i:0),T=4*(this._cubeSize-M);_s(t,E,T,3*M,2*M),l.setRenderTarget(t),l.render(f,gr)}}function Pf(i){const e=[],t=[],n=[];let s=i;const r=i-_i+1+ua.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);t.push(o);let l=1/o;a>i-_i?l=ua[a-i+_i-1]:a===0&&(l=0),n.push(l);const u=1/(o-2),d=-u,f=1+u,h=[d,d,f,d,f,f,d,d,f,f,d,f],m=6,g=6,_=3,p=2,c=1,x=new Float32Array(_*g*m),v=new Float32Array(p*g*m),M=new Float32Array(c*g*m);for(let T=0;T<m;T++){const b=T%3*2/3-1,N=T>2?0:-1,y=[b,N,0,b+2/3,N,0,b+2/3,N+1,0,b,N,0,b+2/3,N+1,0,b,N+1,0];x.set(y,_*g*T),v.set(h,p*g*T);const w=[T,T,T,T,T,T];M.set(w,c*g*T)}const E=new Dt;E.setAttribute("position",new Qt(x,_)),E.setAttribute("uv",new Qt(v,p)),E.setAttribute("faceIndex",new Qt(M,c)),e.push(E),s>_i&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function ma(i,e,t){const n=new Wn(i,e,t);return n.texture.mapping=Us,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function _s(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function Lf(i,e,t){const n=new Float32Array(Nn),s=new I(0,1,0);return new Yn({name:"SphericalGaussianBlur",defines:{n:Nn,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:qr(),fragmentShader:`

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
		`,blending:yn,depthTest:!1,depthWrite:!1})}function ga(){return new Yn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:qr(),fragmentShader:`

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
		`,blending:yn,depthTest:!1,depthWrite:!1})}function _a(){return new Yn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:qr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:yn,depthTest:!1,depthWrite:!1})}function qr(){return`

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
	`}function Df(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const l=o.mapping,u=l===Lr||l===Dr,d=l===Ti||l===bi;if(u||d)if(o.isRenderTargetTexture&&o.needsPMREMUpdate===!0){o.needsPMREMUpdate=!1;let f=e.get(o);return t===null&&(t=new pa(i)),f=u?t.fromEquirectangular(o,f):t.fromCubemap(o,f),e.set(o,f),f.texture}else{if(e.has(o))return e.get(o).texture;{const f=o.image;if(u&&f&&f.height>0||d&&f&&s(f)){t===null&&(t=new pa(i));const h=u?t.fromEquirectangular(o):t.fromCubemap(o);return e.set(o,h),o.addEventListener("dispose",r),h.texture}else return null}}}return o}function s(o){let l=0;const u=6;for(let d=0;d<u;d++)o[d]!==void 0&&l++;return l===u}function r(o){const l=o.target;l.removeEventListener("dispose",r);const u=e.get(l);u!==void 0&&(e.delete(l),u.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function If(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(n){n.isWebGL2?(t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance")):(t("WEBGL_depth_texture"),t("OES_texture_float"),t("OES_texture_half_float"),t("OES_texture_half_float_linear"),t("OES_standard_derivatives"),t("OES_element_index_uint"),t("OES_vertex_array_object"),t("ANGLE_instanced_arrays")),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture")},get:function(n){const s=t(n);return s===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Uf(i,e,t,n){const s={},r=new WeakMap;function a(f){const h=f.target;h.index!==null&&e.remove(h.index);for(const g in h.attributes)e.remove(h.attributes[g]);for(const g in h.morphAttributes){const _=h.morphAttributes[g];for(let p=0,c=_.length;p<c;p++)e.remove(_[p])}h.removeEventListener("dispose",a),delete s[h.id];const m=r.get(h);m&&(e.remove(m),r.delete(h)),n.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function o(f,h){return s[h.id]===!0||(h.addEventListener("dispose",a),s[h.id]=!0,t.memory.geometries++),h}function l(f){const h=f.attributes;for(const g in h)e.update(h[g],i.ARRAY_BUFFER);const m=f.morphAttributes;for(const g in m){const _=m[g];for(let p=0,c=_.length;p<c;p++)e.update(_[p],i.ARRAY_BUFFER)}}function u(f){const h=[],m=f.index,g=f.attributes.position;let _=0;if(m!==null){const x=m.array;_=m.version;for(let v=0,M=x.length;v<M;v+=3){const E=x[v+0],T=x[v+1],b=x[v+2];h.push(E,T,T,b,b,E)}}else if(g!==void 0){const x=g.array;_=g.version;for(let v=0,M=x.length/3-1;v<M;v+=3){const E=v+0,T=v+1,b=v+2;h.push(E,T,T,b,b,E)}}else return;const p=new(Pl(h)?Ol:Nl)(h,1);p.version=_;const c=r.get(f);c&&e.remove(c),r.set(f,p)}function d(f){const h=r.get(f);if(h){const m=f.index;m!==null&&h.version<m.version&&u(f)}else u(f);return r.get(f)}return{get:o,update:l,getWireframeAttribute:d}}function Nf(i,e,t,n){const s=n.isWebGL2;let r;function a(m){r=m}let o,l;function u(m){o=m.type,l=m.bytesPerElement}function d(m,g){i.drawElements(r,g,o,m*l),t.update(g,r,1)}function f(m,g,_){if(_===0)return;let p,c;if(s)p=i,c="drawElementsInstanced";else if(p=e.get("ANGLE_instanced_arrays"),c="drawElementsInstancedANGLE",p===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[c](r,g,o,m*l,_),t.update(g,r,_)}function h(m,g,_){if(_===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let c=0;c<_;c++)this.render(m[c]/l,g[c]);else{p.multiDrawElementsWEBGL(r,g,0,o,m,0,_);let c=0;for(let x=0;x<_;x++)c+=g[x];t.update(c,r,1)}}this.setMode=a,this.setIndex=u,this.render=d,this.renderInstances=f,this.renderMultiDraw=h}function Of(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function Ff(i,e){return i[0]-e[0]}function Bf(i,e){return Math.abs(e[1])-Math.abs(i[1])}function zf(i,e,t){const n={},s=new Float32Array(8),r=new WeakMap,a=new _t,o=[];for(let u=0;u<8;u++)o[u]=[u,0];function l(u,d,f){const h=u.morphTargetInfluences;if(e.isWebGL2===!0){const g=d.morphAttributes.position||d.morphAttributes.normal||d.morphAttributes.color,_=g!==void 0?g.length:0;let p=r.get(d);if(p===void 0||p.count!==_){let B=function(){Y.dispose(),r.delete(d),d.removeEventListener("dispose",B)};var m=B;p!==void 0&&p.texture.dispose();const v=d.morphAttributes.position!==void 0,M=d.morphAttributes.normal!==void 0,E=d.morphAttributes.color!==void 0,T=d.morphAttributes.position||[],b=d.morphAttributes.normal||[],N=d.morphAttributes.color||[];let y=0;v===!0&&(y=1),M===!0&&(y=2),E===!0&&(y=3);let w=d.attributes.position.count*y,O=1;w>e.maxTextureSize&&(O=Math.ceil(w/e.maxTextureSize),w=e.maxTextureSize);const F=new Float32Array(w*O*4*_),Y=new Il(F,w,O,_);Y.type=Sn,Y.needsUpdate=!0;const D=y*4;for(let X=0;X<_;X++){const j=T[X],q=b[X],K=N[X],$=w*O*4*X;for(let se=0;se<j.count;se++){const oe=se*D;v===!0&&(a.fromBufferAttribute(j,se),F[$+oe+0]=a.x,F[$+oe+1]=a.y,F[$+oe+2]=a.z,F[$+oe+3]=0),M===!0&&(a.fromBufferAttribute(q,se),F[$+oe+4]=a.x,F[$+oe+5]=a.y,F[$+oe+6]=a.z,F[$+oe+7]=0),E===!0&&(a.fromBufferAttribute(K,se),F[$+oe+8]=a.x,F[$+oe+9]=a.y,F[$+oe+10]=a.z,F[$+oe+11]=K.itemSize===4?a.w:1)}}p={count:_,texture:Y,size:new Ue(w,O)},r.set(d,p),d.addEventListener("dispose",B)}let c=0;for(let v=0;v<h.length;v++)c+=h[v];const x=d.morphTargetsRelative?1:1-c;f.getUniforms().setValue(i,"morphTargetBaseInfluence",x),f.getUniforms().setValue(i,"morphTargetInfluences",h),f.getUniforms().setValue(i,"morphTargetsTexture",p.texture,t),f.getUniforms().setValue(i,"morphTargetsTextureSize",p.size)}else{const g=h===void 0?0:h.length;let _=n[d.id];if(_===void 0||_.length!==g){_=[];for(let M=0;M<g;M++)_[M]=[M,0];n[d.id]=_}for(let M=0;M<g;M++){const E=_[M];E[0]=M,E[1]=h[M]}_.sort(Bf);for(let M=0;M<8;M++)M<g&&_[M][1]?(o[M][0]=_[M][0],o[M][1]=_[M][1]):(o[M][0]=Number.MAX_SAFE_INTEGER,o[M][1]=0);o.sort(Ff);const p=d.morphAttributes.position,c=d.morphAttributes.normal;let x=0;for(let M=0;M<8;M++){const E=o[M],T=E[0],b=E[1];T!==Number.MAX_SAFE_INTEGER&&b?(p&&d.getAttribute("morphTarget"+M)!==p[T]&&d.setAttribute("morphTarget"+M,p[T]),c&&d.getAttribute("morphNormal"+M)!==c[T]&&d.setAttribute("morphNormal"+M,c[T]),s[M]=b,x+=b):(p&&d.hasAttribute("morphTarget"+M)===!0&&d.deleteAttribute("morphTarget"+M),c&&d.hasAttribute("morphNormal"+M)===!0&&d.deleteAttribute("morphNormal"+M),s[M]=0)}const v=d.morphTargetsRelative?1:1-x;f.getUniforms().setValue(i,"morphTargetBaseInfluence",v),f.getUniforms().setValue(i,"morphTargetInfluences",s)}}return{update:l}}function Hf(i,e,t,n){let s=new WeakMap;function r(l){const u=n.render.frame,d=l.geometry,f=e.get(l,d);if(s.get(f)!==u&&(e.update(f),s.set(f,u)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==u&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,u))),l.isSkinnedMesh){const h=l.skeleton;s.get(h)!==u&&(h.update(),s.set(h,u))}return f}function a(){s=new WeakMap}function o(l){const u=l.target;u.removeEventListener("dispose",o),t.remove(u.instanceMatrix),u.instanceColor!==null&&t.remove(u.instanceColor)}return{update:r,dispose:a}}class kl extends Bt{constructor(e,t,n,s,r,a,o,l,u,d){if(d=d!==void 0?d:zn,d!==zn&&d!==Ai)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&d===zn&&(n=xn),n===void 0&&d===Ai&&(n=Bn),super(null,s,r,a,o,l,d,n,u),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:Rt,this.minFilter=l!==void 0?l:Rt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const Vl=new Bt,Wl=new kl(1,1);Wl.compareFunction=Cl;const Xl=new Il,Yl=new Eh,ql=new zl,va=[],Ma=[],xa=new Float32Array(16),Sa=new Float32Array(9),ya=new Float32Array(4);function Pi(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=va[s];if(r===void 0&&(r=new Float32Array(s),va[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function ft(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function pt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function zs(i,e){let t=Ma[e];t===void 0&&(t=new Int32Array(e),Ma[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Gf(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function kf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ft(t,e))return;i.uniform2fv(this.addr,e),pt(t,e)}}function Vf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(ft(t,e))return;i.uniform3fv(this.addr,e),pt(t,e)}}function Wf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ft(t,e))return;i.uniform4fv(this.addr,e),pt(t,e)}}function Xf(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(ft(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),pt(t,e)}else{if(ft(t,n))return;ya.set(n),i.uniformMatrix2fv(this.addr,!1,ya),pt(t,n)}}function Yf(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(ft(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),pt(t,e)}else{if(ft(t,n))return;Sa.set(n),i.uniformMatrix3fv(this.addr,!1,Sa),pt(t,n)}}function qf(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(ft(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),pt(t,e)}else{if(ft(t,n))return;xa.set(n),i.uniformMatrix4fv(this.addr,!1,xa),pt(t,n)}}function jf(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Kf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ft(t,e))return;i.uniform2iv(this.addr,e),pt(t,e)}}function $f(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(ft(t,e))return;i.uniform3iv(this.addr,e),pt(t,e)}}function Zf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ft(t,e))return;i.uniform4iv(this.addr,e),pt(t,e)}}function Jf(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Qf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ft(t,e))return;i.uniform2uiv(this.addr,e),pt(t,e)}}function ep(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(ft(t,e))return;i.uniform3uiv(this.addr,e),pt(t,e)}}function tp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ft(t,e))return;i.uniform4uiv(this.addr,e),pt(t,e)}}function np(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);const r=this.type===i.SAMPLER_2D_SHADOW?Wl:Vl;t.setTexture2D(e||r,s)}function ip(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Yl,s)}function sp(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||ql,s)}function rp(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||Xl,s)}function op(i){switch(i){case 5126:return Gf;case 35664:return kf;case 35665:return Vf;case 35666:return Wf;case 35674:return Xf;case 35675:return Yf;case 35676:return qf;case 5124:case 35670:return jf;case 35667:case 35671:return Kf;case 35668:case 35672:return $f;case 35669:case 35673:return Zf;case 5125:return Jf;case 36294:return Qf;case 36295:return ep;case 36296:return tp;case 35678:case 36198:case 36298:case 36306:case 35682:return np;case 35679:case 36299:case 36307:return ip;case 35680:case 36300:case 36308:case 36293:return sp;case 36289:case 36303:case 36311:case 36292:return rp}}function ap(i,e){i.uniform1fv(this.addr,e)}function lp(i,e){const t=Pi(e,this.size,2);i.uniform2fv(this.addr,t)}function cp(i,e){const t=Pi(e,this.size,3);i.uniform3fv(this.addr,t)}function hp(i,e){const t=Pi(e,this.size,4);i.uniform4fv(this.addr,t)}function up(i,e){const t=Pi(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function dp(i,e){const t=Pi(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function fp(i,e){const t=Pi(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function pp(i,e){i.uniform1iv(this.addr,e)}function mp(i,e){i.uniform2iv(this.addr,e)}function gp(i,e){i.uniform3iv(this.addr,e)}function _p(i,e){i.uniform4iv(this.addr,e)}function vp(i,e){i.uniform1uiv(this.addr,e)}function Mp(i,e){i.uniform2uiv(this.addr,e)}function xp(i,e){i.uniform3uiv(this.addr,e)}function Sp(i,e){i.uniform4uiv(this.addr,e)}function yp(i,e,t){const n=this.cache,s=e.length,r=zs(t,s);ft(n,r)||(i.uniform1iv(this.addr,r),pt(n,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||Vl,r[a])}function Ep(i,e,t){const n=this.cache,s=e.length,r=zs(t,s);ft(n,r)||(i.uniform1iv(this.addr,r),pt(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Yl,r[a])}function Tp(i,e,t){const n=this.cache,s=e.length,r=zs(t,s);ft(n,r)||(i.uniform1iv(this.addr,r),pt(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||ql,r[a])}function bp(i,e,t){const n=this.cache,s=e.length,r=zs(t,s);ft(n,r)||(i.uniform1iv(this.addr,r),pt(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Xl,r[a])}function Ap(i){switch(i){case 5126:return ap;case 35664:return lp;case 35665:return cp;case 35666:return hp;case 35674:return up;case 35675:return dp;case 35676:return fp;case 5124:case 35670:return pp;case 35667:case 35671:return mp;case 35668:case 35672:return gp;case 35669:case 35673:return _p;case 5125:return vp;case 36294:return Mp;case 36295:return xp;case 36296:return Sp;case 35678:case 36198:case 36298:case 36306:case 35682:return yp;case 35679:case 36299:case 36307:return Ep;case 35680:case 36300:case 36308:case 36293:return Tp;case 36289:case 36303:case 36311:case 36292:return bp}}class wp{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=op(t.type)}}class Rp{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Ap(t.type)}}class Cp{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],n)}}}const xr=/(\w+)(\])?(\[|\.)?/g;function Ea(i,e){i.seq.push(e),i.map[e.id]=e}function Pp(i,e,t){const n=i.name,s=n.length;for(xr.lastIndex=0;;){const r=xr.exec(n),a=xr.lastIndex;let o=r[1];const l=r[2]==="]",u=r[3];if(l&&(o=o|0),u===void 0||u==="["&&a+2===s){Ea(t,u===void 0?new wp(o,i,e):new Rp(o,i,e));break}else{let f=t.map[o];f===void 0&&(f=new Cp(o),Ea(t,f)),t=f}}}class As{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);Pp(r,a,this)}}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&n.push(a)}return n}}function Ta(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const Lp=37297;let Dp=0;function Ip(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}function Up(i){const e=tt.getPrimaries(tt.workingColorSpace),t=tt.getPrimaries(i);let n;switch(e===t?n="":e===Ps&&t===Cs?n="LinearDisplayP3ToLinearSRGB":e===Cs&&t===Ps&&(n="LinearSRGBToLinearDisplayP3"),i){case fn:case Ns:return[n,"LinearTransferOETF"];case xt:case Wr:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function ba(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),s=i.getShaderInfoLog(e).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const a=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+Ip(i.getShaderSource(e),a)}else return s}function Np(i,e){const t=Up(e);return`vec4 ${i}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function Op(i,e){let t;switch(e){case Xc:t="Linear";break;case Yc:t="Reinhard";break;case qc:t="OptimizedCineon";break;case jc:t="ACESFilmic";break;case $c:t="AgX";break;case Kc:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function Fp(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(vi).join(`
`)}function Bp(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(vi).join(`
`)}function zp(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Hp(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function vi(i){return i!==""}function Aa(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function wa(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Gp=/^[ \t]*#include +<([\w\d./]+)>/gm;function Br(i){return i.replace(Gp,Vp)}const kp=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function Vp(i,e){let t=We[e];if(t===void 0){const n=kp.get(e);if(n!==void 0)t=We[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Br(t)}const Wp=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ra(i){return i.replace(Wp,Xp)}function Xp(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Ca(i){let e="precision "+i.precision+` float;
precision `+i.precision+" int;";return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Yp(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===_l?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===vl?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===hn&&(e="SHADOWMAP_TYPE_VSM"),e}function qp(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Ti:case bi:e="ENVMAP_TYPE_CUBE";break;case Us:e="ENVMAP_TYPE_CUBE_UV";break}return e}function jp(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case bi:e="ENVMAP_MODE_REFRACTION";break}return e}function Kp(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case kr:e="ENVMAP_BLENDING_MULTIPLY";break;case Vc:e="ENVMAP_BLENDING_MIX";break;case Wc:e="ENVMAP_BLENDING_ADD";break}return e}function $p(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function Zp(i,e,t,n){const s=i.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=Yp(t),u=qp(t),d=jp(t),f=Kp(t),h=$p(t),m=t.isWebGL2?"":Fp(t),g=Bp(t),_=zp(r),p=s.createProgram();let c,x,v=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(c=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(vi).join(`
`),c.length>0&&(c+=`
`),x=[m,"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(vi).join(`
`),x.length>0&&(x+=`
`)):(c=[Ca(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors&&t.isWebGL2?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(vi).join(`
`),x=[m,Ca(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.envMap?"#define "+d:"",t.envMap?"#define "+f:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==En?"#define TONE_MAPPING":"",t.toneMapping!==En?We.tonemapping_pars_fragment:"",t.toneMapping!==En?Op("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",We.colorspace_pars_fragment,Np("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(vi).join(`
`)),a=Br(a),a=Aa(a,t),a=wa(a,t),o=Br(o),o=Aa(o,t),o=wa(o,t),a=Ra(a),o=Ra(o),t.isWebGL2&&t.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,c=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+c,x=["precision mediump sampler2DArray;","#define varying in",t.glslVersion===qo?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===qo?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+x);const M=v+c+a,E=v+x+o,T=Ta(s,s.VERTEX_SHADER,M),b=Ta(s,s.FRAGMENT_SHADER,E);s.attachShader(p,T),s.attachShader(p,b),t.index0AttributeName!==void 0?s.bindAttribLocation(p,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(p,0,"position"),s.linkProgram(p);function N(F){if(i.debug.checkShaderErrors){const Y=s.getProgramInfoLog(p).trim(),D=s.getShaderInfoLog(T).trim(),B=s.getShaderInfoLog(b).trim();let X=!0,j=!0;if(s.getProgramParameter(p,s.LINK_STATUS)===!1)if(X=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,p,T,b);else{const q=ba(s,T,"vertex"),K=ba(s,b,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(p,s.VALIDATE_STATUS)+`

Program Info Log: `+Y+`
`+q+`
`+K)}else Y!==""?console.warn("THREE.WebGLProgram: Program Info Log:",Y):(D===""||B==="")&&(j=!1);j&&(F.diagnostics={runnable:X,programLog:Y,vertexShader:{log:D,prefix:c},fragmentShader:{log:B,prefix:x}})}s.deleteShader(T),s.deleteShader(b),y=new As(s,p),w=Hp(s,p)}let y;this.getUniforms=function(){return y===void 0&&N(this),y};let w;this.getAttributes=function(){return w===void 0&&N(this),w};let O=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return O===!1&&(O=s.getProgramParameter(p,Lp)),O},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(p),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Dp++,this.cacheKey=e,this.usedTimes=1,this.program=p,this.vertexShader=T,this.fragmentShader=b,this}let Jp=0;class Qp{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new em(e),t.set(e,n)),n}}class em{constructor(e){this.id=Jp++,this.code=e,this.usedTimes=0}}function tm(i,e,t,n,s,r,a){const o=new Xr,l=new Qp,u=[],d=s.isWebGL2,f=s.logarithmicDepthBuffer,h=s.vertexTextures;let m=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(y){return y===0?"uv":`uv${y}`}function p(y,w,O,F,Y){const D=F.fog,B=Y.geometry,X=y.isMeshStandardMaterial?F.environment:null,j=(y.isMeshStandardMaterial?t:e).get(y.envMap||X),q=j&&j.mapping===Us?j.image.height:null,K=g[y.type];y.precision!==null&&(m=s.getMaxPrecision(y.precision),m!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",m,"instead."));const $=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,se=$!==void 0?$.length:0;let oe=0;B.morphAttributes.position!==void 0&&(oe=1),B.morphAttributes.normal!==void 0&&(oe=2),B.morphAttributes.color!==void 0&&(oe=3);let V,Z,ce,Me;if(K){const at=nn[K];V=at.vertexShader,Z=at.fragmentShader}else V=y.vertexShader,Z=y.fragmentShader,l.update(y),ce=l.getVertexShaderID(y),Me=l.getFragmentShaderID(y);const ve=i.getRenderTarget(),Ce=Y.isInstancedMesh===!0,Le=Y.isBatchedMesh===!0,be=!!y.map,Ve=!!y.matcap,H=!!j,dt=!!y.aoMap,Ee=!!y.lightMap,Pe=!!y.bumpMap,_e=!!y.normalMap,et=!!y.displacementMap,Fe=!!y.emissiveMap,R=!!y.metalnessMap,S=!!y.roughnessMap,z=y.anisotropy>0,te=y.clearcoat>0,Q=y.iridescence>0,ne=y.sheen>0,xe=y.transmission>0,de=z&&!!y.anisotropyMap,ge=te&&!!y.clearcoatMap,Re=te&&!!y.clearcoatNormalMap,He=te&&!!y.clearcoatRoughnessMap,J=Q&&!!y.iridescenceMap,Qe=Q&&!!y.iridescenceThicknessMap,Xe=ne&&!!y.sheenColorMap,Ne=ne&&!!y.sheenRoughnessMap,Te=!!y.specularMap,fe=!!y.specularColorMap,C=!!y.specularIntensityMap,ie=xe&&!!y.transmissionMap,Se=xe&&!!y.thicknessMap,me=!!y.gradientMap,ee=!!y.alphaMap,L=y.alphaTest>0,re=!!y.alphaHash,ue=!!y.extensions,De=!!B.attributes.uv1,we=!!B.attributes.uv2,Ke=!!B.attributes.uv3;let $e=En;return y.toneMapped&&(ve===null||ve.isXRRenderTarget===!0)&&($e=i.toneMapping),{isWebGL2:d,shaderID:K,shaderType:y.type,shaderName:y.name,vertexShader:V,fragmentShader:Z,defines:y.defines,customVertexShaderID:ce,customFragmentShaderID:Me,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:m,batching:Le,instancing:Ce,instancingColor:Ce&&Y.instanceColor!==null,supportsVertexTextures:h,outputColorSpace:ve===null?i.outputColorSpace:ve.isXRRenderTarget===!0?ve.texture.colorSpace:fn,map:be,matcap:Ve,envMap:H,envMapMode:H&&j.mapping,envMapCubeUVHeight:q,aoMap:dt,lightMap:Ee,bumpMap:Pe,normalMap:_e,displacementMap:h&&et,emissiveMap:Fe,normalMapObjectSpace:_e&&y.normalMapType===lh,normalMapTangentSpace:_e&&y.normalMapType===Rl,metalnessMap:R,roughnessMap:S,anisotropy:z,anisotropyMap:de,clearcoat:te,clearcoatMap:ge,clearcoatNormalMap:Re,clearcoatRoughnessMap:He,iridescence:Q,iridescenceMap:J,iridescenceThicknessMap:Qe,sheen:ne,sheenColorMap:Xe,sheenRoughnessMap:Ne,specularMap:Te,specularColorMap:fe,specularIntensityMap:C,transmission:xe,transmissionMap:ie,thicknessMap:Se,gradientMap:me,opaque:y.transparent===!1&&y.blending===xi,alphaMap:ee,alphaTest:L,alphaHash:re,combine:y.combine,mapUv:be&&_(y.map.channel),aoMapUv:dt&&_(y.aoMap.channel),lightMapUv:Ee&&_(y.lightMap.channel),bumpMapUv:Pe&&_(y.bumpMap.channel),normalMapUv:_e&&_(y.normalMap.channel),displacementMapUv:et&&_(y.displacementMap.channel),emissiveMapUv:Fe&&_(y.emissiveMap.channel),metalnessMapUv:R&&_(y.metalnessMap.channel),roughnessMapUv:S&&_(y.roughnessMap.channel),anisotropyMapUv:de&&_(y.anisotropyMap.channel),clearcoatMapUv:ge&&_(y.clearcoatMap.channel),clearcoatNormalMapUv:Re&&_(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:He&&_(y.clearcoatRoughnessMap.channel),iridescenceMapUv:J&&_(y.iridescenceMap.channel),iridescenceThicknessMapUv:Qe&&_(y.iridescenceThicknessMap.channel),sheenColorMapUv:Xe&&_(y.sheenColorMap.channel),sheenRoughnessMapUv:Ne&&_(y.sheenRoughnessMap.channel),specularMapUv:Te&&_(y.specularMap.channel),specularColorMapUv:fe&&_(y.specularColorMap.channel),specularIntensityMapUv:C&&_(y.specularIntensityMap.channel),transmissionMapUv:ie&&_(y.transmissionMap.channel),thicknessMapUv:Se&&_(y.thicknessMap.channel),alphaMapUv:ee&&_(y.alphaMap.channel),vertexTangents:!!B.attributes.tangent&&(_e||z),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,vertexUv1s:De,vertexUv2s:we,vertexUv3s:Ke,pointsUvs:Y.isPoints===!0&&!!B.attributes.uv&&(be||ee),fog:!!D,useFog:y.fog===!0,fogExp2:D&&D.isFogExp2,flatShading:y.flatShading===!0,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:f,skinning:Y.isSkinnedMesh===!0,morphTargets:B.morphAttributes.position!==void 0,morphNormals:B.morphAttributes.normal!==void 0,morphColors:B.morphAttributes.color!==void 0,morphTargetsCount:se,morphTextureStride:oe,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:y.dithering,shadowMapEnabled:i.shadowMap.enabled&&O.length>0,shadowMapType:i.shadowMap.type,toneMapping:$e,useLegacyLights:i._useLegacyLights,decodeVideoTexture:be&&y.map.isVideoTexture===!0&&tt.getTransfer(y.map.colorSpace)===nt,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===Kt,flipSided:y.side===Lt,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionDerivatives:ue&&y.extensions.derivatives===!0,extensionFragDepth:ue&&y.extensions.fragDepth===!0,extensionDrawBuffers:ue&&y.extensions.drawBuffers===!0,extensionShaderTextureLOD:ue&&y.extensions.shaderTextureLOD===!0,extensionClipCullDistance:ue&&y.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:d||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:d||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:d||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()}}function c(y){const w=[];if(y.shaderID?w.push(y.shaderID):(w.push(y.customVertexShaderID),w.push(y.customFragmentShaderID)),y.defines!==void 0)for(const O in y.defines)w.push(O),w.push(y.defines[O]);return y.isRawShaderMaterial===!1&&(x(w,y),v(w,y),w.push(i.outputColorSpace)),w.push(y.customProgramCacheKey),w.join()}function x(y,w){y.push(w.precision),y.push(w.outputColorSpace),y.push(w.envMapMode),y.push(w.envMapCubeUVHeight),y.push(w.mapUv),y.push(w.alphaMapUv),y.push(w.lightMapUv),y.push(w.aoMapUv),y.push(w.bumpMapUv),y.push(w.normalMapUv),y.push(w.displacementMapUv),y.push(w.emissiveMapUv),y.push(w.metalnessMapUv),y.push(w.roughnessMapUv),y.push(w.anisotropyMapUv),y.push(w.clearcoatMapUv),y.push(w.clearcoatNormalMapUv),y.push(w.clearcoatRoughnessMapUv),y.push(w.iridescenceMapUv),y.push(w.iridescenceThicknessMapUv),y.push(w.sheenColorMapUv),y.push(w.sheenRoughnessMapUv),y.push(w.specularMapUv),y.push(w.specularColorMapUv),y.push(w.specularIntensityMapUv),y.push(w.transmissionMapUv),y.push(w.thicknessMapUv),y.push(w.combine),y.push(w.fogExp2),y.push(w.sizeAttenuation),y.push(w.morphTargetsCount),y.push(w.morphAttributeCount),y.push(w.numDirLights),y.push(w.numPointLights),y.push(w.numSpotLights),y.push(w.numSpotLightMaps),y.push(w.numHemiLights),y.push(w.numRectAreaLights),y.push(w.numDirLightShadows),y.push(w.numPointLightShadows),y.push(w.numSpotLightShadows),y.push(w.numSpotLightShadowsWithMaps),y.push(w.numLightProbes),y.push(w.shadowMapType),y.push(w.toneMapping),y.push(w.numClippingPlanes),y.push(w.numClipIntersection),y.push(w.depthPacking)}function v(y,w){o.disableAll(),w.isWebGL2&&o.enable(0),w.supportsVertexTextures&&o.enable(1),w.instancing&&o.enable(2),w.instancingColor&&o.enable(3),w.matcap&&o.enable(4),w.envMap&&o.enable(5),w.normalMapObjectSpace&&o.enable(6),w.normalMapTangentSpace&&o.enable(7),w.clearcoat&&o.enable(8),w.iridescence&&o.enable(9),w.alphaTest&&o.enable(10),w.vertexColors&&o.enable(11),w.vertexAlphas&&o.enable(12),w.vertexUv1s&&o.enable(13),w.vertexUv2s&&o.enable(14),w.vertexUv3s&&o.enable(15),w.vertexTangents&&o.enable(16),w.anisotropy&&o.enable(17),w.alphaHash&&o.enable(18),w.batching&&o.enable(19),y.push(o.mask),o.disableAll(),w.fog&&o.enable(0),w.useFog&&o.enable(1),w.flatShading&&o.enable(2),w.logarithmicDepthBuffer&&o.enable(3),w.skinning&&o.enable(4),w.morphTargets&&o.enable(5),w.morphNormals&&o.enable(6),w.morphColors&&o.enable(7),w.premultipliedAlpha&&o.enable(8),w.shadowMapEnabled&&o.enable(9),w.useLegacyLights&&o.enable(10),w.doubleSided&&o.enable(11),w.flipSided&&o.enable(12),w.useDepthPacking&&o.enable(13),w.dithering&&o.enable(14),w.transmission&&o.enable(15),w.sheen&&o.enable(16),w.opaque&&o.enable(17),w.pointsUvs&&o.enable(18),w.decodeVideoTexture&&o.enable(19),y.push(o.mask)}function M(y){const w=g[y.type];let O;if(w){const F=nn[w];O=Oh.clone(F.uniforms)}else O=y.uniforms;return O}function E(y,w){let O;for(let F=0,Y=u.length;F<Y;F++){const D=u[F];if(D.cacheKey===w){O=D,++O.usedTimes;break}}return O===void 0&&(O=new Zp(i,w,y,r),u.push(O)),O}function T(y){if(--y.usedTimes===0){const w=u.indexOf(y);u[w]=u[u.length-1],u.pop(),y.destroy()}}function b(y){l.remove(y)}function N(){l.dispose()}return{getParameters:p,getProgramCacheKey:c,getUniforms:M,acquireProgram:E,releaseProgram:T,releaseShaderCache:b,programs:u,dispose:N}}function nm(){let i=new WeakMap;function e(r){let a=i.get(r);return a===void 0&&(a={},i.set(r,a)),a}function t(r){i.delete(r)}function n(r,a,o){i.get(r)[a]=o}function s(){i=new WeakMap}return{get:e,remove:t,update:n,dispose:s}}function im(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Pa(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function La(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(f,h,m,g,_,p){let c=i[e];return c===void 0?(c={id:f.id,object:f,geometry:h,material:m,groupOrder:g,renderOrder:f.renderOrder,z:_,group:p},i[e]=c):(c.id=f.id,c.object=f,c.geometry=h,c.material=m,c.groupOrder=g,c.renderOrder=f.renderOrder,c.z=_,c.group=p),e++,c}function o(f,h,m,g,_,p){const c=a(f,h,m,g,_,p);m.transmission>0?n.push(c):m.transparent===!0?s.push(c):t.push(c)}function l(f,h,m,g,_,p){const c=a(f,h,m,g,_,p);m.transmission>0?n.unshift(c):m.transparent===!0?s.unshift(c):t.unshift(c)}function u(f,h){t.length>1&&t.sort(f||im),n.length>1&&n.sort(h||Pa),s.length>1&&s.sort(h||Pa)}function d(){for(let f=e,h=i.length;f<h;f++){const m=i[f];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:o,unshift:l,finish:d,sort:u}}function sm(){let i=new WeakMap;function e(n,s){const r=i.get(n);let a;return r===void 0?(a=new La,i.set(n,[a])):s>=r.length?(a=new La,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function rm(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new I,color:new Ze};break;case"SpotLight":t={position:new I,direction:new I,color:new Ze,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new I,color:new Ze,distance:0,decay:0};break;case"HemisphereLight":t={direction:new I,skyColor:new Ze,groundColor:new Ze};break;case"RectAreaLight":t={color:new Ze,position:new I,halfWidth:new I,halfHeight:new I};break}return i[e.id]=t,t}}}function om(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let am=0;function lm(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function cm(i,e){const t=new rm,n=om(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let d=0;d<9;d++)s.probe.push(new I);const r=new I,a=new ut,o=new ut;function l(d,f){let h=0,m=0,g=0;for(let F=0;F<9;F++)s.probe[F].set(0,0,0);let _=0,p=0,c=0,x=0,v=0,M=0,E=0,T=0,b=0,N=0,y=0;d.sort(lm);const w=f===!0?Math.PI:1;for(let F=0,Y=d.length;F<Y;F++){const D=d[F],B=D.color,X=D.intensity,j=D.distance,q=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)h+=B.r*X*w,m+=B.g*X*w,g+=B.b*X*w;else if(D.isLightProbe){for(let K=0;K<9;K++)s.probe[K].addScaledVector(D.sh.coefficients[K],X);y++}else if(D.isDirectionalLight){const K=t.get(D);if(K.color.copy(D.color).multiplyScalar(D.intensity*w),D.castShadow){const $=D.shadow,se=n.get(D);se.shadowBias=$.bias,se.shadowNormalBias=$.normalBias,se.shadowRadius=$.radius,se.shadowMapSize=$.mapSize,s.directionalShadow[_]=se,s.directionalShadowMap[_]=q,s.directionalShadowMatrix[_]=D.shadow.matrix,M++}s.directional[_]=K,_++}else if(D.isSpotLight){const K=t.get(D);K.position.setFromMatrixPosition(D.matrixWorld),K.color.copy(B).multiplyScalar(X*w),K.distance=j,K.coneCos=Math.cos(D.angle),K.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),K.decay=D.decay,s.spot[c]=K;const $=D.shadow;if(D.map&&(s.spotLightMap[b]=D.map,b++,$.updateMatrices(D),D.castShadow&&N++),s.spotLightMatrix[c]=$.matrix,D.castShadow){const se=n.get(D);se.shadowBias=$.bias,se.shadowNormalBias=$.normalBias,se.shadowRadius=$.radius,se.shadowMapSize=$.mapSize,s.spotShadow[c]=se,s.spotShadowMap[c]=q,T++}c++}else if(D.isRectAreaLight){const K=t.get(D);K.color.copy(B).multiplyScalar(X),K.halfWidth.set(D.width*.5,0,0),K.halfHeight.set(0,D.height*.5,0),s.rectArea[x]=K,x++}else if(D.isPointLight){const K=t.get(D);if(K.color.copy(D.color).multiplyScalar(D.intensity*w),K.distance=D.distance,K.decay=D.decay,D.castShadow){const $=D.shadow,se=n.get(D);se.shadowBias=$.bias,se.shadowNormalBias=$.normalBias,se.shadowRadius=$.radius,se.shadowMapSize=$.mapSize,se.shadowCameraNear=$.camera.near,se.shadowCameraFar=$.camera.far,s.pointShadow[p]=se,s.pointShadowMap[p]=q,s.pointShadowMatrix[p]=D.shadow.matrix,E++}s.point[p]=K,p++}else if(D.isHemisphereLight){const K=t.get(D);K.skyColor.copy(D.color).multiplyScalar(X*w),K.groundColor.copy(D.groundColor).multiplyScalar(X*w),s.hemi[v]=K,v++}}x>0&&(e.isWebGL2?i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=he.LTC_FLOAT_1,s.rectAreaLTC2=he.LTC_FLOAT_2):(s.rectAreaLTC1=he.LTC_HALF_1,s.rectAreaLTC2=he.LTC_HALF_2):i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=he.LTC_FLOAT_1,s.rectAreaLTC2=he.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=he.LTC_HALF_1,s.rectAreaLTC2=he.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=h,s.ambient[1]=m,s.ambient[2]=g;const O=s.hash;(O.directionalLength!==_||O.pointLength!==p||O.spotLength!==c||O.rectAreaLength!==x||O.hemiLength!==v||O.numDirectionalShadows!==M||O.numPointShadows!==E||O.numSpotShadows!==T||O.numSpotMaps!==b||O.numLightProbes!==y)&&(s.directional.length=_,s.spot.length=c,s.rectArea.length=x,s.point.length=p,s.hemi.length=v,s.directionalShadow.length=M,s.directionalShadowMap.length=M,s.pointShadow.length=E,s.pointShadowMap.length=E,s.spotShadow.length=T,s.spotShadowMap.length=T,s.directionalShadowMatrix.length=M,s.pointShadowMatrix.length=E,s.spotLightMatrix.length=T+b-N,s.spotLightMap.length=b,s.numSpotLightShadowsWithMaps=N,s.numLightProbes=y,O.directionalLength=_,O.pointLength=p,O.spotLength=c,O.rectAreaLength=x,O.hemiLength=v,O.numDirectionalShadows=M,O.numPointShadows=E,O.numSpotShadows=T,O.numSpotMaps=b,O.numLightProbes=y,s.version=am++)}function u(d,f){let h=0,m=0,g=0,_=0,p=0;const c=f.matrixWorldInverse;for(let x=0,v=d.length;x<v;x++){const M=d[x];if(M.isDirectionalLight){const E=s.directional[h];E.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),E.direction.sub(r),E.direction.transformDirection(c),h++}else if(M.isSpotLight){const E=s.spot[g];E.position.setFromMatrixPosition(M.matrixWorld),E.position.applyMatrix4(c),E.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),E.direction.sub(r),E.direction.transformDirection(c),g++}else if(M.isRectAreaLight){const E=s.rectArea[_];E.position.setFromMatrixPosition(M.matrixWorld),E.position.applyMatrix4(c),o.identity(),a.copy(M.matrixWorld),a.premultiply(c),o.extractRotation(a),E.halfWidth.set(M.width*.5,0,0),E.halfHeight.set(0,M.height*.5,0),E.halfWidth.applyMatrix4(o),E.halfHeight.applyMatrix4(o),_++}else if(M.isPointLight){const E=s.point[m];E.position.setFromMatrixPosition(M.matrixWorld),E.position.applyMatrix4(c),m++}else if(M.isHemisphereLight){const E=s.hemi[p];E.direction.setFromMatrixPosition(M.matrixWorld),E.direction.transformDirection(c),p++}}}return{setup:l,setupView:u,state:s}}function Da(i,e){const t=new cm(i,e),n=[],s=[];function r(){n.length=0,s.length=0}function a(f){n.push(f)}function o(f){s.push(f)}function l(f){t.setup(n,f)}function u(f){t.setupView(n,f)}return{init:r,state:{lightsArray:n,shadowsArray:s,lights:t},setupLights:l,setupLightsView:u,pushLight:a,pushShadow:o}}function hm(i,e){let t=new WeakMap;function n(r,a=0){const o=t.get(r);let l;return o===void 0?(l=new Da(i,e),t.set(r,[l])):a>=o.length?(l=new Da(i,e),o.push(l)):l=o[a],l}function s(){t=new WeakMap}return{get:n,dispose:s}}class um extends Ci{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=oh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class dm extends Ci{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const fm=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,pm=`uniform sampler2D shadow_pass;
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
}`;function mm(i,e,t){let n=new Yr;const s=new Ue,r=new Ue,a=new _t,o=new um({depthPacking:ah}),l=new dm,u={},d=t.maxTextureSize,f={[An]:Lt,[Lt]:An,[Kt]:Kt},h=new Yn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ue},radius:{value:4}},vertexShader:fm,fragmentShader:pm}),m=h.clone();m.defines.HORIZONTAL_PASS=1;const g=new Dt;g.setAttribute("position",new Qt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new At(g,h),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=_l;let c=this.type;this.render=function(T,b,N){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||T.length===0)return;const y=i.getRenderTarget(),w=i.getActiveCubeFace(),O=i.getActiveMipmapLevel(),F=i.state;F.setBlending(yn),F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const Y=c!==hn&&this.type===hn,D=c===hn&&this.type!==hn;for(let B=0,X=T.length;B<X;B++){const j=T[B],q=j.shadow;if(q===void 0){console.warn("THREE.WebGLShadowMap:",j,"has no shadow.");continue}if(q.autoUpdate===!1&&q.needsUpdate===!1)continue;s.copy(q.mapSize);const K=q.getFrameExtents();if(s.multiply(K),r.copy(q.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(r.x=Math.floor(d/K.x),s.x=r.x*K.x,q.mapSize.x=r.x),s.y>d&&(r.y=Math.floor(d/K.y),s.y=r.y*K.y,q.mapSize.y=r.y)),q.map===null||Y===!0||D===!0){const se=this.type!==hn?{minFilter:Rt,magFilter:Rt}:{};q.map!==null&&q.map.dispose(),q.map=new Wn(s.x,s.y,se),q.map.texture.name=j.name+".shadowMap",q.camera.updateProjectionMatrix()}i.setRenderTarget(q.map),i.clear();const $=q.getViewportCount();for(let se=0;se<$;se++){const oe=q.getViewport(se);a.set(r.x*oe.x,r.y*oe.y,r.x*oe.z,r.y*oe.w),F.viewport(a),q.updateMatrices(j,se),n=q.getFrustum(),M(b,N,q.camera,j,this.type)}q.isPointLightShadow!==!0&&this.type===hn&&x(q,N),q.needsUpdate=!1}c=this.type,p.needsUpdate=!1,i.setRenderTarget(y,w,O)};function x(T,b){const N=e.update(_);h.defines.VSM_SAMPLES!==T.blurSamples&&(h.defines.VSM_SAMPLES=T.blurSamples,m.defines.VSM_SAMPLES=T.blurSamples,h.needsUpdate=!0,m.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new Wn(s.x,s.y)),h.uniforms.shadow_pass.value=T.map.texture,h.uniforms.resolution.value=T.mapSize,h.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(b,null,N,h,_,null),m.uniforms.shadow_pass.value=T.mapPass.texture,m.uniforms.resolution.value=T.mapSize,m.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(b,null,N,m,_,null)}function v(T,b,N,y){let w=null;const O=N.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(O!==void 0)w=O;else if(w=N.isPointLight===!0?l:o,i.localClippingEnabled&&b.clipShadows===!0&&Array.isArray(b.clippingPlanes)&&b.clippingPlanes.length!==0||b.displacementMap&&b.displacementScale!==0||b.alphaMap&&b.alphaTest>0||b.map&&b.alphaTest>0){const F=w.uuid,Y=b.uuid;let D=u[F];D===void 0&&(D={},u[F]=D);let B=D[Y];B===void 0&&(B=w.clone(),D[Y]=B,b.addEventListener("dispose",E)),w=B}if(w.visible=b.visible,w.wireframe=b.wireframe,y===hn?w.side=b.shadowSide!==null?b.shadowSide:b.side:w.side=b.shadowSide!==null?b.shadowSide:f[b.side],w.alphaMap=b.alphaMap,w.alphaTest=b.alphaTest,w.map=b.map,w.clipShadows=b.clipShadows,w.clippingPlanes=b.clippingPlanes,w.clipIntersection=b.clipIntersection,w.displacementMap=b.displacementMap,w.displacementScale=b.displacementScale,w.displacementBias=b.displacementBias,w.wireframeLinewidth=b.wireframeLinewidth,w.linewidth=b.linewidth,N.isPointLight===!0&&w.isMeshDistanceMaterial===!0){const F=i.properties.get(w);F.light=N}return w}function M(T,b,N,y,w){if(T.visible===!1)return;if(T.layers.test(b.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&w===hn)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(N.matrixWorldInverse,T.matrixWorld);const Y=e.update(T),D=T.material;if(Array.isArray(D)){const B=Y.groups;for(let X=0,j=B.length;X<j;X++){const q=B[X],K=D[q.materialIndex];if(K&&K.visible){const $=v(T,K,y,w);T.onBeforeShadow(i,T,b,N,Y,$,q),i.renderBufferDirect(N,null,Y,$,T,q),T.onAfterShadow(i,T,b,N,Y,$,q)}}}else if(D.visible){const B=v(T,D,y,w);T.onBeforeShadow(i,T,b,N,Y,B,null),i.renderBufferDirect(N,null,Y,B,T,null),T.onAfterShadow(i,T,b,N,Y,B,null)}}const F=T.children;for(let Y=0,D=F.length;Y<D;Y++)M(F[Y],b,N,y,w)}function E(T){T.target.removeEventListener("dispose",E);for(const N in u){const y=u[N],w=T.target.uuid;w in y&&(y[w].dispose(),delete y[w])}}}function gm(i,e,t){const n=t.isWebGL2;function s(){let L=!1;const re=new _t;let ue=null;const De=new _t(0,0,0,0);return{setMask:function(we){ue!==we&&!L&&(i.colorMask(we,we,we,we),ue=we)},setLocked:function(we){L=we},setClear:function(we,Ke,$e,st,at){at===!0&&(we*=st,Ke*=st,$e*=st),re.set(we,Ke,$e,st),De.equals(re)===!1&&(i.clearColor(we,Ke,$e,st),De.copy(re))},reset:function(){L=!1,ue=null,De.set(-1,0,0,0)}}}function r(){let L=!1,re=null,ue=null,De=null;return{setTest:function(we){we?Le(i.DEPTH_TEST):be(i.DEPTH_TEST)},setMask:function(we){re!==we&&!L&&(i.depthMask(we),re=we)},setFunc:function(we){if(ue!==we){switch(we){case Oc:i.depthFunc(i.NEVER);break;case Fc:i.depthFunc(i.ALWAYS);break;case Bc:i.depthFunc(i.LESS);break;case ws:i.depthFunc(i.LEQUAL);break;case zc:i.depthFunc(i.EQUAL);break;case Hc:i.depthFunc(i.GEQUAL);break;case Gc:i.depthFunc(i.GREATER);break;case kc:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ue=we}},setLocked:function(we){L=we},setClear:function(we){De!==we&&(i.clearDepth(we),De=we)},reset:function(){L=!1,re=null,ue=null,De=null}}}function a(){let L=!1,re=null,ue=null,De=null,we=null,Ke=null,$e=null,st=null,at=null;return{setTest:function(Je){L||(Je?Le(i.STENCIL_TEST):be(i.STENCIL_TEST))},setMask:function(Je){re!==Je&&!L&&(i.stencilMask(Je),re=Je)},setFunc:function(Je,ct,tn){(ue!==Je||De!==ct||we!==tn)&&(i.stencilFunc(Je,ct,tn),ue=Je,De=ct,we=tn)},setOp:function(Je,ct,tn){(Ke!==Je||$e!==ct||st!==tn)&&(i.stencilOp(Je,ct,tn),Ke=Je,$e=ct,st=tn)},setLocked:function(Je){L=Je},setClear:function(Je){at!==Je&&(i.clearStencil(Je),at=Je)},reset:function(){L=!1,re=null,ue=null,De=null,we=null,Ke=null,$e=null,st=null,at=null}}}const o=new s,l=new r,u=new a,d=new WeakMap,f=new WeakMap;let h={},m={},g=new WeakMap,_=[],p=null,c=!1,x=null,v=null,M=null,E=null,T=null,b=null,N=null,y=new Ze(0,0,0),w=0,O=!1,F=null,Y=null,D=null,B=null,X=null;const j=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let q=!1,K=0;const $=i.getParameter(i.VERSION);$.indexOf("WebGL")!==-1?(K=parseFloat(/^WebGL (\d)/.exec($)[1]),q=K>=1):$.indexOf("OpenGL ES")!==-1&&(K=parseFloat(/^OpenGL ES (\d)/.exec($)[1]),q=K>=2);let se=null,oe={};const V=i.getParameter(i.SCISSOR_BOX),Z=i.getParameter(i.VIEWPORT),ce=new _t().fromArray(V),Me=new _t().fromArray(Z);function ve(L,re,ue,De){const we=new Uint8Array(4),Ke=i.createTexture();i.bindTexture(L,Ke),i.texParameteri(L,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(L,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let $e=0;$e<ue;$e++)n&&(L===i.TEXTURE_3D||L===i.TEXTURE_2D_ARRAY)?i.texImage3D(re,0,i.RGBA,1,1,De,0,i.RGBA,i.UNSIGNED_BYTE,we):i.texImage2D(re+$e,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,we);return Ke}const Ce={};Ce[i.TEXTURE_2D]=ve(i.TEXTURE_2D,i.TEXTURE_2D,1),Ce[i.TEXTURE_CUBE_MAP]=ve(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(Ce[i.TEXTURE_2D_ARRAY]=ve(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Ce[i.TEXTURE_3D]=ve(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),o.setClear(0,0,0,1),l.setClear(1),u.setClear(0),Le(i.DEPTH_TEST),l.setFunc(ws),Fe(!1),R(fo),Le(i.CULL_FACE),_e(yn);function Le(L){h[L]!==!0&&(i.enable(L),h[L]=!0)}function be(L){h[L]!==!1&&(i.disable(L),h[L]=!1)}function Ve(L,re){return m[L]!==re?(i.bindFramebuffer(L,re),m[L]=re,n&&(L===i.DRAW_FRAMEBUFFER&&(m[i.FRAMEBUFFER]=re),L===i.FRAMEBUFFER&&(m[i.DRAW_FRAMEBUFFER]=re)),!0):!1}function H(L,re){let ue=_,De=!1;if(L)if(ue=g.get(re),ue===void 0&&(ue=[],g.set(re,ue)),L.isWebGLMultipleRenderTargets){const we=L.texture;if(ue.length!==we.length||ue[0]!==i.COLOR_ATTACHMENT0){for(let Ke=0,$e=we.length;Ke<$e;Ke++)ue[Ke]=i.COLOR_ATTACHMENT0+Ke;ue.length=we.length,De=!0}}else ue[0]!==i.COLOR_ATTACHMENT0&&(ue[0]=i.COLOR_ATTACHMENT0,De=!0);else ue[0]!==i.BACK&&(ue[0]=i.BACK,De=!0);De&&(t.isWebGL2?i.drawBuffers(ue):e.get("WEBGL_draw_buffers").drawBuffersWEBGL(ue))}function dt(L){return p!==L?(i.useProgram(L),p=L,!0):!1}const Ee={[Un]:i.FUNC_ADD,[Sc]:i.FUNC_SUBTRACT,[yc]:i.FUNC_REVERSE_SUBTRACT};if(n)Ee[_o]=i.MIN,Ee[vo]=i.MAX;else{const L=e.get("EXT_blend_minmax");L!==null&&(Ee[_o]=L.MIN_EXT,Ee[vo]=L.MAX_EXT)}const Pe={[Ec]:i.ZERO,[Tc]:i.ONE,[bc]:i.SRC_COLOR,[Cr]:i.SRC_ALPHA,[Lc]:i.SRC_ALPHA_SATURATE,[Cc]:i.DST_COLOR,[wc]:i.DST_ALPHA,[Ac]:i.ONE_MINUS_SRC_COLOR,[Pr]:i.ONE_MINUS_SRC_ALPHA,[Pc]:i.ONE_MINUS_DST_COLOR,[Rc]:i.ONE_MINUS_DST_ALPHA,[Dc]:i.CONSTANT_COLOR,[Ic]:i.ONE_MINUS_CONSTANT_COLOR,[Uc]:i.CONSTANT_ALPHA,[Nc]:i.ONE_MINUS_CONSTANT_ALPHA};function _e(L,re,ue,De,we,Ke,$e,st,at,Je){if(L===yn){c===!0&&(be(i.BLEND),c=!1);return}if(c===!1&&(Le(i.BLEND),c=!0),L!==xc){if(L!==x||Je!==O){if((v!==Un||T!==Un)&&(i.blendEquation(i.FUNC_ADD),v=Un,T=Un),Je)switch(L){case xi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case po:i.blendFunc(i.ONE,i.ONE);break;case mo:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case go:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}else switch(L){case xi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case po:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case mo:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case go:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}M=null,E=null,b=null,N=null,y.set(0,0,0),w=0,x=L,O=Je}return}we=we||re,Ke=Ke||ue,$e=$e||De,(re!==v||we!==T)&&(i.blendEquationSeparate(Ee[re],Ee[we]),v=re,T=we),(ue!==M||De!==E||Ke!==b||$e!==N)&&(i.blendFuncSeparate(Pe[ue],Pe[De],Pe[Ke],Pe[$e]),M=ue,E=De,b=Ke,N=$e),(st.equals(y)===!1||at!==w)&&(i.blendColor(st.r,st.g,st.b,at),y.copy(st),w=at),x=L,O=!1}function et(L,re){L.side===Kt?be(i.CULL_FACE):Le(i.CULL_FACE);let ue=L.side===Lt;re&&(ue=!ue),Fe(ue),L.blending===xi&&L.transparent===!1?_e(yn):_e(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),l.setFunc(L.depthFunc),l.setTest(L.depthTest),l.setMask(L.depthWrite),o.setMask(L.colorWrite);const De=L.stencilWrite;u.setTest(De),De&&(u.setMask(L.stencilWriteMask),u.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),u.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),z(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?Le(i.SAMPLE_ALPHA_TO_COVERAGE):be(i.SAMPLE_ALPHA_TO_COVERAGE)}function Fe(L){F!==L&&(L?i.frontFace(i.CW):i.frontFace(i.CCW),F=L)}function R(L){L!==vc?(Le(i.CULL_FACE),L!==Y&&(L===fo?i.cullFace(i.BACK):L===Mc?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):be(i.CULL_FACE),Y=L}function S(L){L!==D&&(q&&i.lineWidth(L),D=L)}function z(L,re,ue){L?(Le(i.POLYGON_OFFSET_FILL),(B!==re||X!==ue)&&(i.polygonOffset(re,ue),B=re,X=ue)):be(i.POLYGON_OFFSET_FILL)}function te(L){L?Le(i.SCISSOR_TEST):be(i.SCISSOR_TEST)}function Q(L){L===void 0&&(L=i.TEXTURE0+j-1),se!==L&&(i.activeTexture(L),se=L)}function ne(L,re,ue){ue===void 0&&(se===null?ue=i.TEXTURE0+j-1:ue=se);let De=oe[ue];De===void 0&&(De={type:void 0,texture:void 0},oe[ue]=De),(De.type!==L||De.texture!==re)&&(se!==ue&&(i.activeTexture(ue),se=ue),i.bindTexture(L,re||Ce[L]),De.type=L,De.texture=re)}function xe(){const L=oe[se];L!==void 0&&L.type!==void 0&&(i.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function de(){try{i.compressedTexImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ge(){try{i.compressedTexImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Re(){try{i.texSubImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function He(){try{i.texSubImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function J(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Qe(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Xe(){try{i.texStorage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Ne(){try{i.texStorage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Te(){try{i.texImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function fe(){try{i.texImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function C(L){ce.equals(L)===!1&&(i.scissor(L.x,L.y,L.z,L.w),ce.copy(L))}function ie(L){Me.equals(L)===!1&&(i.viewport(L.x,L.y,L.z,L.w),Me.copy(L))}function Se(L,re){let ue=f.get(re);ue===void 0&&(ue=new WeakMap,f.set(re,ue));let De=ue.get(L);De===void 0&&(De=i.getUniformBlockIndex(re,L.name),ue.set(L,De))}function me(L,re){const De=f.get(re).get(L);d.get(re)!==De&&(i.uniformBlockBinding(re,De,L.__bindingPointIndex),d.set(re,De))}function ee(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},se=null,oe={},m={},g=new WeakMap,_=[],p=null,c=!1,x=null,v=null,M=null,E=null,T=null,b=null,N=null,y=new Ze(0,0,0),w=0,O=!1,F=null,Y=null,D=null,B=null,X=null,ce.set(0,0,i.canvas.width,i.canvas.height),Me.set(0,0,i.canvas.width,i.canvas.height),o.reset(),l.reset(),u.reset()}return{buffers:{color:o,depth:l,stencil:u},enable:Le,disable:be,bindFramebuffer:Ve,drawBuffers:H,useProgram:dt,setBlending:_e,setMaterial:et,setFlipSided:Fe,setCullFace:R,setLineWidth:S,setPolygonOffset:z,setScissorTest:te,activeTexture:Q,bindTexture:ne,unbindTexture:xe,compressedTexImage2D:de,compressedTexImage3D:ge,texImage2D:Te,texImage3D:fe,updateUBOMapping:Se,uniformBlockBinding:me,texStorage2D:Xe,texStorage3D:Ne,texSubImage2D:Re,texSubImage3D:He,compressedTexSubImage2D:J,compressedTexSubImage3D:Qe,scissor:C,viewport:ie,reset:ee}}function _m(i,e,t,n,s,r,a){const o=s.isWebGL2,l=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,u=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),d=new WeakMap;let f;const h=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(R,S){return m?new OffscreenCanvas(R,S):Ds("canvas")}function _(R,S,z,te){let Q=1;if((R.width>te||R.height>te)&&(Q=te/Math.max(R.width,R.height)),Q<1||S===!0)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap){const ne=S?Fr:Math.floor,xe=ne(Q*R.width),de=ne(Q*R.height);f===void 0&&(f=g(xe,de));const ge=z?g(xe,de):f;return ge.width=xe,ge.height=de,ge.getContext("2d").drawImage(R,0,0,xe,de),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+R.width+"x"+R.height+") to ("+xe+"x"+de+")."),ge}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+R.width+"x"+R.height+")."),R;return R}function p(R){return jo(R.width)&&jo(R.height)}function c(R){return o?!1:R.wrapS!==$t||R.wrapT!==$t||R.minFilter!==Rt&&R.minFilter!==Gt}function x(R,S){return R.generateMipmaps&&S&&R.minFilter!==Rt&&R.minFilter!==Gt}function v(R){i.generateMipmap(R)}function M(R,S,z,te,Q=!1){if(o===!1)return S;if(R!==null){if(i[R]!==void 0)return i[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let ne=S;if(S===i.RED&&(z===i.FLOAT&&(ne=i.R32F),z===i.HALF_FLOAT&&(ne=i.R16F),z===i.UNSIGNED_BYTE&&(ne=i.R8)),S===i.RED_INTEGER&&(z===i.UNSIGNED_BYTE&&(ne=i.R8UI),z===i.UNSIGNED_SHORT&&(ne=i.R16UI),z===i.UNSIGNED_INT&&(ne=i.R32UI),z===i.BYTE&&(ne=i.R8I),z===i.SHORT&&(ne=i.R16I),z===i.INT&&(ne=i.R32I)),S===i.RG&&(z===i.FLOAT&&(ne=i.RG32F),z===i.HALF_FLOAT&&(ne=i.RG16F),z===i.UNSIGNED_BYTE&&(ne=i.RG8)),S===i.RGBA){const xe=Q?Rs:tt.getTransfer(te);z===i.FLOAT&&(ne=i.RGBA32F),z===i.HALF_FLOAT&&(ne=i.RGBA16F),z===i.UNSIGNED_BYTE&&(ne=xe===nt?i.SRGB8_ALPHA8:i.RGBA8),z===i.UNSIGNED_SHORT_4_4_4_4&&(ne=i.RGBA4),z===i.UNSIGNED_SHORT_5_5_5_1&&(ne=i.RGB5_A1)}return(ne===i.R16F||ne===i.R32F||ne===i.RG16F||ne===i.RG32F||ne===i.RGBA16F||ne===i.RGBA32F)&&e.get("EXT_color_buffer_float"),ne}function E(R,S,z){return x(R,z)===!0||R.isFramebufferTexture&&R.minFilter!==Rt&&R.minFilter!==Gt?Math.log2(Math.max(S.width,S.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?S.mipmaps.length:1}function T(R){return R===Rt||R===Mo||R===Ys?i.NEAREST:i.LINEAR}function b(R){const S=R.target;S.removeEventListener("dispose",b),y(S),S.isVideoTexture&&d.delete(S)}function N(R){const S=R.target;S.removeEventListener("dispose",N),O(S)}function y(R){const S=n.get(R);if(S.__webglInit===void 0)return;const z=R.source,te=h.get(z);if(te){const Q=te[S.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&w(R),Object.keys(te).length===0&&h.delete(z)}n.remove(R)}function w(R){const S=n.get(R);i.deleteTexture(S.__webglTexture);const z=R.source,te=h.get(z);delete te[S.__cacheKey],a.memory.textures--}function O(R){const S=R.texture,z=n.get(R),te=n.get(S);if(te.__webglTexture!==void 0&&(i.deleteTexture(te.__webglTexture),a.memory.textures--),R.depthTexture&&R.depthTexture.dispose(),R.isWebGLCubeRenderTarget)for(let Q=0;Q<6;Q++){if(Array.isArray(z.__webglFramebuffer[Q]))for(let ne=0;ne<z.__webglFramebuffer[Q].length;ne++)i.deleteFramebuffer(z.__webglFramebuffer[Q][ne]);else i.deleteFramebuffer(z.__webglFramebuffer[Q]);z.__webglDepthbuffer&&i.deleteRenderbuffer(z.__webglDepthbuffer[Q])}else{if(Array.isArray(z.__webglFramebuffer))for(let Q=0;Q<z.__webglFramebuffer.length;Q++)i.deleteFramebuffer(z.__webglFramebuffer[Q]);else i.deleteFramebuffer(z.__webglFramebuffer);if(z.__webglDepthbuffer&&i.deleteRenderbuffer(z.__webglDepthbuffer),z.__webglMultisampledFramebuffer&&i.deleteFramebuffer(z.__webglMultisampledFramebuffer),z.__webglColorRenderbuffer)for(let Q=0;Q<z.__webglColorRenderbuffer.length;Q++)z.__webglColorRenderbuffer[Q]&&i.deleteRenderbuffer(z.__webglColorRenderbuffer[Q]);z.__webglDepthRenderbuffer&&i.deleteRenderbuffer(z.__webglDepthRenderbuffer)}if(R.isWebGLMultipleRenderTargets)for(let Q=0,ne=S.length;Q<ne;Q++){const xe=n.get(S[Q]);xe.__webglTexture&&(i.deleteTexture(xe.__webglTexture),a.memory.textures--),n.remove(S[Q])}n.remove(S),n.remove(R)}let F=0;function Y(){F=0}function D(){const R=F;return R>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+s.maxTextures),F+=1,R}function B(R){const S=[];return S.push(R.wrapS),S.push(R.wrapT),S.push(R.wrapR||0),S.push(R.magFilter),S.push(R.minFilter),S.push(R.anisotropy),S.push(R.internalFormat),S.push(R.format),S.push(R.type),S.push(R.generateMipmaps),S.push(R.premultiplyAlpha),S.push(R.flipY),S.push(R.unpackAlignment),S.push(R.colorSpace),S.join()}function X(R,S){const z=n.get(R);if(R.isVideoTexture&&et(R),R.isRenderTargetTexture===!1&&R.version>0&&z.__version!==R.version){const te=R.image;if(te===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(te.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ce(z,R,S);return}}t.bindTexture(i.TEXTURE_2D,z.__webglTexture,i.TEXTURE0+S)}function j(R,S){const z=n.get(R);if(R.version>0&&z.__version!==R.version){ce(z,R,S);return}t.bindTexture(i.TEXTURE_2D_ARRAY,z.__webglTexture,i.TEXTURE0+S)}function q(R,S){const z=n.get(R);if(R.version>0&&z.__version!==R.version){ce(z,R,S);return}t.bindTexture(i.TEXTURE_3D,z.__webglTexture,i.TEXTURE0+S)}function K(R,S){const z=n.get(R);if(R.version>0&&z.__version!==R.version){Me(z,R,S);return}t.bindTexture(i.TEXTURE_CUBE_MAP,z.__webglTexture,i.TEXTURE0+S)}const $={[Ir]:i.REPEAT,[$t]:i.CLAMP_TO_EDGE,[Ur]:i.MIRRORED_REPEAT},se={[Rt]:i.NEAREST,[Mo]:i.NEAREST_MIPMAP_NEAREST,[Ys]:i.NEAREST_MIPMAP_LINEAR,[Gt]:i.LINEAR,[Zc]:i.LINEAR_MIPMAP_NEAREST,[ki]:i.LINEAR_MIPMAP_LINEAR},oe={[ch]:i.NEVER,[mh]:i.ALWAYS,[hh]:i.LESS,[Cl]:i.LEQUAL,[uh]:i.EQUAL,[ph]:i.GEQUAL,[dh]:i.GREATER,[fh]:i.NOTEQUAL};function V(R,S,z){if(z?(i.texParameteri(R,i.TEXTURE_WRAP_S,$[S.wrapS]),i.texParameteri(R,i.TEXTURE_WRAP_T,$[S.wrapT]),(R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY)&&i.texParameteri(R,i.TEXTURE_WRAP_R,$[S.wrapR]),i.texParameteri(R,i.TEXTURE_MAG_FILTER,se[S.magFilter]),i.texParameteri(R,i.TEXTURE_MIN_FILTER,se[S.minFilter])):(i.texParameteri(R,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(R,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY)&&i.texParameteri(R,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(S.wrapS!==$t||S.wrapT!==$t)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(R,i.TEXTURE_MAG_FILTER,T(S.magFilter)),i.texParameteri(R,i.TEXTURE_MIN_FILTER,T(S.minFilter)),S.minFilter!==Rt&&S.minFilter!==Gt&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),S.compareFunction&&(i.texParameteri(R,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(R,i.TEXTURE_COMPARE_FUNC,oe[S.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){const te=e.get("EXT_texture_filter_anisotropic");if(S.magFilter===Rt||S.minFilter!==Ys&&S.minFilter!==ki||S.type===Sn&&e.has("OES_texture_float_linear")===!1||o===!1&&S.type===Vi&&e.has("OES_texture_half_float_linear")===!1)return;(S.anisotropy>1||n.get(S).__currentAnisotropy)&&(i.texParameterf(R,te.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,s.getMaxAnisotropy())),n.get(S).__currentAnisotropy=S.anisotropy)}}function Z(R,S){let z=!1;R.__webglInit===void 0&&(R.__webglInit=!0,S.addEventListener("dispose",b));const te=S.source;let Q=h.get(te);Q===void 0&&(Q={},h.set(te,Q));const ne=B(S);if(ne!==R.__cacheKey){Q[ne]===void 0&&(Q[ne]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,z=!0),Q[ne].usedTimes++;const xe=Q[R.__cacheKey];xe!==void 0&&(Q[R.__cacheKey].usedTimes--,xe.usedTimes===0&&w(S)),R.__cacheKey=ne,R.__webglTexture=Q[ne].texture}return z}function ce(R,S,z){let te=i.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(te=i.TEXTURE_2D_ARRAY),S.isData3DTexture&&(te=i.TEXTURE_3D);const Q=Z(R,S),ne=S.source;t.bindTexture(te,R.__webglTexture,i.TEXTURE0+z);const xe=n.get(ne);if(ne.version!==xe.__version||Q===!0){t.activeTexture(i.TEXTURE0+z);const de=tt.getPrimaries(tt.workingColorSpace),ge=S.colorSpace===Wt?null:tt.getPrimaries(S.colorSpace),Re=S.colorSpace===Wt||de===ge?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Re);const He=c(S)&&p(S.image)===!1;let J=_(S.image,He,!1,s.maxTextureSize);J=Fe(S,J);const Qe=p(J)||o,Xe=r.convert(S.format,S.colorSpace);let Ne=r.convert(S.type),Te=M(S.internalFormat,Xe,Ne,S.colorSpace,S.isVideoTexture);V(te,S,Qe);let fe;const C=S.mipmaps,ie=o&&S.isVideoTexture!==!0&&Te!==Al,Se=xe.__version===void 0||Q===!0,me=E(S,J,Qe);if(S.isDepthTexture)Te=i.DEPTH_COMPONENT,o?S.type===Sn?Te=i.DEPTH_COMPONENT32F:S.type===xn?Te=i.DEPTH_COMPONENT24:S.type===Bn?Te=i.DEPTH24_STENCIL8:Te=i.DEPTH_COMPONENT16:S.type===Sn&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),S.format===zn&&Te===i.DEPTH_COMPONENT&&S.type!==Vr&&S.type!==xn&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),S.type=xn,Ne=r.convert(S.type)),S.format===Ai&&Te===i.DEPTH_COMPONENT&&(Te=i.DEPTH_STENCIL,S.type!==Bn&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),S.type=Bn,Ne=r.convert(S.type))),Se&&(ie?t.texStorage2D(i.TEXTURE_2D,1,Te,J.width,J.height):t.texImage2D(i.TEXTURE_2D,0,Te,J.width,J.height,0,Xe,Ne,null));else if(S.isDataTexture)if(C.length>0&&Qe){ie&&Se&&t.texStorage2D(i.TEXTURE_2D,me,Te,C[0].width,C[0].height);for(let ee=0,L=C.length;ee<L;ee++)fe=C[ee],ie?t.texSubImage2D(i.TEXTURE_2D,ee,0,0,fe.width,fe.height,Xe,Ne,fe.data):t.texImage2D(i.TEXTURE_2D,ee,Te,fe.width,fe.height,0,Xe,Ne,fe.data);S.generateMipmaps=!1}else ie?(Se&&t.texStorage2D(i.TEXTURE_2D,me,Te,J.width,J.height),t.texSubImage2D(i.TEXTURE_2D,0,0,0,J.width,J.height,Xe,Ne,J.data)):t.texImage2D(i.TEXTURE_2D,0,Te,J.width,J.height,0,Xe,Ne,J.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){ie&&Se&&t.texStorage3D(i.TEXTURE_2D_ARRAY,me,Te,C[0].width,C[0].height,J.depth);for(let ee=0,L=C.length;ee<L;ee++)fe=C[ee],S.format!==Zt?Xe!==null?ie?t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ee,0,0,0,fe.width,fe.height,J.depth,Xe,fe.data,0,0):t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ee,Te,fe.width,fe.height,J.depth,0,fe.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ie?t.texSubImage3D(i.TEXTURE_2D_ARRAY,ee,0,0,0,fe.width,fe.height,J.depth,Xe,Ne,fe.data):t.texImage3D(i.TEXTURE_2D_ARRAY,ee,Te,fe.width,fe.height,J.depth,0,Xe,Ne,fe.data)}else{ie&&Se&&t.texStorage2D(i.TEXTURE_2D,me,Te,C[0].width,C[0].height);for(let ee=0,L=C.length;ee<L;ee++)fe=C[ee],S.format!==Zt?Xe!==null?ie?t.compressedTexSubImage2D(i.TEXTURE_2D,ee,0,0,fe.width,fe.height,Xe,fe.data):t.compressedTexImage2D(i.TEXTURE_2D,ee,Te,fe.width,fe.height,0,fe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ie?t.texSubImage2D(i.TEXTURE_2D,ee,0,0,fe.width,fe.height,Xe,Ne,fe.data):t.texImage2D(i.TEXTURE_2D,ee,Te,fe.width,fe.height,0,Xe,Ne,fe.data)}else if(S.isDataArrayTexture)ie?(Se&&t.texStorage3D(i.TEXTURE_2D_ARRAY,me,Te,J.width,J.height,J.depth),t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,J.width,J.height,J.depth,Xe,Ne,J.data)):t.texImage3D(i.TEXTURE_2D_ARRAY,0,Te,J.width,J.height,J.depth,0,Xe,Ne,J.data);else if(S.isData3DTexture)ie?(Se&&t.texStorage3D(i.TEXTURE_3D,me,Te,J.width,J.height,J.depth),t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,J.width,J.height,J.depth,Xe,Ne,J.data)):t.texImage3D(i.TEXTURE_3D,0,Te,J.width,J.height,J.depth,0,Xe,Ne,J.data);else if(S.isFramebufferTexture){if(Se)if(ie)t.texStorage2D(i.TEXTURE_2D,me,Te,J.width,J.height);else{let ee=J.width,L=J.height;for(let re=0;re<me;re++)t.texImage2D(i.TEXTURE_2D,re,Te,ee,L,0,Xe,Ne,null),ee>>=1,L>>=1}}else if(C.length>0&&Qe){ie&&Se&&t.texStorage2D(i.TEXTURE_2D,me,Te,C[0].width,C[0].height);for(let ee=0,L=C.length;ee<L;ee++)fe=C[ee],ie?t.texSubImage2D(i.TEXTURE_2D,ee,0,0,Xe,Ne,fe):t.texImage2D(i.TEXTURE_2D,ee,Te,Xe,Ne,fe);S.generateMipmaps=!1}else ie?(Se&&t.texStorage2D(i.TEXTURE_2D,me,Te,J.width,J.height),t.texSubImage2D(i.TEXTURE_2D,0,0,0,Xe,Ne,J)):t.texImage2D(i.TEXTURE_2D,0,Te,Xe,Ne,J);x(S,Qe)&&v(te),xe.__version=ne.version,S.onUpdate&&S.onUpdate(S)}R.__version=S.version}function Me(R,S,z){if(S.image.length!==6)return;const te=Z(R,S),Q=S.source;t.bindTexture(i.TEXTURE_CUBE_MAP,R.__webglTexture,i.TEXTURE0+z);const ne=n.get(Q);if(Q.version!==ne.__version||te===!0){t.activeTexture(i.TEXTURE0+z);const xe=tt.getPrimaries(tt.workingColorSpace),de=S.colorSpace===Wt?null:tt.getPrimaries(S.colorSpace),ge=S.colorSpace===Wt||xe===de?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ge);const Re=S.isCompressedTexture||S.image[0].isCompressedTexture,He=S.image[0]&&S.image[0].isDataTexture,J=[];for(let ee=0;ee<6;ee++)!Re&&!He?J[ee]=_(S.image[ee],!1,!0,s.maxCubemapSize):J[ee]=He?S.image[ee].image:S.image[ee],J[ee]=Fe(S,J[ee]);const Qe=J[0],Xe=p(Qe)||o,Ne=r.convert(S.format,S.colorSpace),Te=r.convert(S.type),fe=M(S.internalFormat,Ne,Te,S.colorSpace),C=o&&S.isVideoTexture!==!0,ie=ne.__version===void 0||te===!0;let Se=E(S,Qe,Xe);V(i.TEXTURE_CUBE_MAP,S,Xe);let me;if(Re){C&&ie&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Se,fe,Qe.width,Qe.height);for(let ee=0;ee<6;ee++){me=J[ee].mipmaps;for(let L=0;L<me.length;L++){const re=me[L];S.format!==Zt?Ne!==null?C?t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,L,0,0,re.width,re.height,Ne,re.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,L,fe,re.width,re.height,0,re.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):C?t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,L,0,0,re.width,re.height,Ne,Te,re.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,L,fe,re.width,re.height,0,Ne,Te,re.data)}}}else{me=S.mipmaps,C&&ie&&(me.length>0&&Se++,t.texStorage2D(i.TEXTURE_CUBE_MAP,Se,fe,J[0].width,J[0].height));for(let ee=0;ee<6;ee++)if(He){C?t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,J[ee].width,J[ee].height,Ne,Te,J[ee].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,fe,J[ee].width,J[ee].height,0,Ne,Te,J[ee].data);for(let L=0;L<me.length;L++){const ue=me[L].image[ee].image;C?t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,L+1,0,0,ue.width,ue.height,Ne,Te,ue.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,L+1,fe,ue.width,ue.height,0,Ne,Te,ue.data)}}else{C?t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,Ne,Te,J[ee]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,fe,Ne,Te,J[ee]);for(let L=0;L<me.length;L++){const re=me[L];C?t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,L+1,0,0,Ne,Te,re.image[ee]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,L+1,fe,Ne,Te,re.image[ee])}}}x(S,Xe)&&v(i.TEXTURE_CUBE_MAP),ne.__version=Q.version,S.onUpdate&&S.onUpdate(S)}R.__version=S.version}function ve(R,S,z,te,Q,ne){const xe=r.convert(z.format,z.colorSpace),de=r.convert(z.type),ge=M(z.internalFormat,xe,de,z.colorSpace);if(!n.get(S).__hasExternalTextures){const He=Math.max(1,S.width>>ne),J=Math.max(1,S.height>>ne);Q===i.TEXTURE_3D||Q===i.TEXTURE_2D_ARRAY?t.texImage3D(Q,ne,ge,He,J,S.depth,0,xe,de,null):t.texImage2D(Q,ne,ge,He,J,0,xe,de,null)}t.bindFramebuffer(i.FRAMEBUFFER,R),_e(S)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,te,Q,n.get(z).__webglTexture,0,Pe(S)):(Q===i.TEXTURE_2D||Q>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,te,Q,n.get(z).__webglTexture,ne),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ce(R,S,z){if(i.bindRenderbuffer(i.RENDERBUFFER,R),S.depthBuffer&&!S.stencilBuffer){let te=o===!0?i.DEPTH_COMPONENT24:i.DEPTH_COMPONENT16;if(z||_e(S)){const Q=S.depthTexture;Q&&Q.isDepthTexture&&(Q.type===Sn?te=i.DEPTH_COMPONENT32F:Q.type===xn&&(te=i.DEPTH_COMPONENT24));const ne=Pe(S);_e(S)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ne,te,S.width,S.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,ne,te,S.width,S.height)}else i.renderbufferStorage(i.RENDERBUFFER,te,S.width,S.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,R)}else if(S.depthBuffer&&S.stencilBuffer){const te=Pe(S);z&&_e(S)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,te,i.DEPTH24_STENCIL8,S.width,S.height):_e(S)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,te,i.DEPTH24_STENCIL8,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,S.width,S.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,R)}else{const te=S.isWebGLMultipleRenderTargets===!0?S.texture:[S.texture];for(let Q=0;Q<te.length;Q++){const ne=te[Q],xe=r.convert(ne.format,ne.colorSpace),de=r.convert(ne.type),ge=M(ne.internalFormat,xe,de,ne.colorSpace),Re=Pe(S);z&&_e(S)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Re,ge,S.width,S.height):_e(S)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Re,ge,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,ge,S.width,S.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Le(R,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,R),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(S.depthTexture).__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),X(S.depthTexture,0);const te=n.get(S.depthTexture).__webglTexture,Q=Pe(S);if(S.depthTexture.format===zn)_e(S)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,te,0,Q):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,te,0);else if(S.depthTexture.format===Ai)_e(S)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,te,0,Q):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,te,0);else throw new Error("Unknown depthTexture format")}function be(R){const S=n.get(R),z=R.isWebGLCubeRenderTarget===!0;if(R.depthTexture&&!S.__autoAllocateDepthBuffer){if(z)throw new Error("target.depthTexture not supported in Cube render targets");Le(S.__webglFramebuffer,R)}else if(z){S.__webglDepthbuffer=[];for(let te=0;te<6;te++)t.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer[te]),S.__webglDepthbuffer[te]=i.createRenderbuffer(),Ce(S.__webglDepthbuffer[te],R,!1)}else t.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer=i.createRenderbuffer(),Ce(S.__webglDepthbuffer,R,!1);t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ve(R,S,z){const te=n.get(R);S!==void 0&&ve(te.__webglFramebuffer,R,R.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),z!==void 0&&be(R)}function H(R){const S=R.texture,z=n.get(R),te=n.get(S);R.addEventListener("dispose",N),R.isWebGLMultipleRenderTargets!==!0&&(te.__webglTexture===void 0&&(te.__webglTexture=i.createTexture()),te.__version=S.version,a.memory.textures++);const Q=R.isWebGLCubeRenderTarget===!0,ne=R.isWebGLMultipleRenderTargets===!0,xe=p(R)||o;if(Q){z.__webglFramebuffer=[];for(let de=0;de<6;de++)if(o&&S.mipmaps&&S.mipmaps.length>0){z.__webglFramebuffer[de]=[];for(let ge=0;ge<S.mipmaps.length;ge++)z.__webglFramebuffer[de][ge]=i.createFramebuffer()}else z.__webglFramebuffer[de]=i.createFramebuffer()}else{if(o&&S.mipmaps&&S.mipmaps.length>0){z.__webglFramebuffer=[];for(let de=0;de<S.mipmaps.length;de++)z.__webglFramebuffer[de]=i.createFramebuffer()}else z.__webglFramebuffer=i.createFramebuffer();if(ne)if(s.drawBuffers){const de=R.texture;for(let ge=0,Re=de.length;ge<Re;ge++){const He=n.get(de[ge]);He.__webglTexture===void 0&&(He.__webglTexture=i.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(o&&R.samples>0&&_e(R)===!1){const de=ne?S:[S];z.__webglMultisampledFramebuffer=i.createFramebuffer(),z.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let ge=0;ge<de.length;ge++){const Re=de[ge];z.__webglColorRenderbuffer[ge]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,z.__webglColorRenderbuffer[ge]);const He=r.convert(Re.format,Re.colorSpace),J=r.convert(Re.type),Qe=M(Re.internalFormat,He,J,Re.colorSpace,R.isXRRenderTarget===!0),Xe=Pe(R);i.renderbufferStorageMultisample(i.RENDERBUFFER,Xe,Qe,R.width,R.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ge,i.RENDERBUFFER,z.__webglColorRenderbuffer[ge])}i.bindRenderbuffer(i.RENDERBUFFER,null),R.depthBuffer&&(z.__webglDepthRenderbuffer=i.createRenderbuffer(),Ce(z.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Q){t.bindTexture(i.TEXTURE_CUBE_MAP,te.__webglTexture),V(i.TEXTURE_CUBE_MAP,S,xe);for(let de=0;de<6;de++)if(o&&S.mipmaps&&S.mipmaps.length>0)for(let ge=0;ge<S.mipmaps.length;ge++)ve(z.__webglFramebuffer[de][ge],R,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+de,ge);else ve(z.__webglFramebuffer[de],R,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+de,0);x(S,xe)&&v(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ne){const de=R.texture;for(let ge=0,Re=de.length;ge<Re;ge++){const He=de[ge],J=n.get(He);t.bindTexture(i.TEXTURE_2D,J.__webglTexture),V(i.TEXTURE_2D,He,xe),ve(z.__webglFramebuffer,R,He,i.COLOR_ATTACHMENT0+ge,i.TEXTURE_2D,0),x(He,xe)&&v(i.TEXTURE_2D)}t.unbindTexture()}else{let de=i.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(o?de=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),t.bindTexture(de,te.__webglTexture),V(de,S,xe),o&&S.mipmaps&&S.mipmaps.length>0)for(let ge=0;ge<S.mipmaps.length;ge++)ve(z.__webglFramebuffer[ge],R,S,i.COLOR_ATTACHMENT0,de,ge);else ve(z.__webglFramebuffer,R,S,i.COLOR_ATTACHMENT0,de,0);x(S,xe)&&v(de),t.unbindTexture()}R.depthBuffer&&be(R)}function dt(R){const S=p(R)||o,z=R.isWebGLMultipleRenderTargets===!0?R.texture:[R.texture];for(let te=0,Q=z.length;te<Q;te++){const ne=z[te];if(x(ne,S)){const xe=R.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,de=n.get(ne).__webglTexture;t.bindTexture(xe,de),v(xe),t.unbindTexture()}}}function Ee(R){if(o&&R.samples>0&&_e(R)===!1){const S=R.isWebGLMultipleRenderTargets?R.texture:[R.texture],z=R.width,te=R.height;let Q=i.COLOR_BUFFER_BIT;const ne=[],xe=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,de=n.get(R),ge=R.isWebGLMultipleRenderTargets===!0;if(ge)for(let Re=0;Re<S.length;Re++)t.bindFramebuffer(i.FRAMEBUFFER,de.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Re,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,de.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Re,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,de.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,de.__webglFramebuffer);for(let Re=0;Re<S.length;Re++){ne.push(i.COLOR_ATTACHMENT0+Re),R.depthBuffer&&ne.push(xe);const He=de.__ignoreDepthValues!==void 0?de.__ignoreDepthValues:!1;if(He===!1&&(R.depthBuffer&&(Q|=i.DEPTH_BUFFER_BIT),R.stencilBuffer&&(Q|=i.STENCIL_BUFFER_BIT)),ge&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,de.__webglColorRenderbuffer[Re]),He===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[xe]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[xe])),ge){const J=n.get(S[Re]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,J,0)}i.blitFramebuffer(0,0,z,te,0,0,z,te,Q,i.NEAREST),u&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ne)}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ge)for(let Re=0;Re<S.length;Re++){t.bindFramebuffer(i.FRAMEBUFFER,de.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Re,i.RENDERBUFFER,de.__webglColorRenderbuffer[Re]);const He=n.get(S[Re]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,de.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Re,i.TEXTURE_2D,He,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,de.__webglMultisampledFramebuffer)}}function Pe(R){return Math.min(s.maxSamples,R.samples)}function _e(R){const S=n.get(R);return o&&R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function et(R){const S=a.render.frame;d.get(R)!==S&&(d.set(R,S),R.update())}function Fe(R,S){const z=R.colorSpace,te=R.format,Q=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||R.format===Nr||z!==fn&&z!==Wt&&(tt.getTransfer(z)===nt?o===!1?e.has("EXT_sRGB")===!0&&te===Zt?(R.format=Nr,R.minFilter=Gt,R.generateMipmaps=!1):S=Ll.sRGBToLinear(S):(te!==Zt||Q!==Tn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",z)),S}this.allocateTextureUnit=D,this.resetTextureUnits=Y,this.setTexture2D=X,this.setTexture2DArray=j,this.setTexture3D=q,this.setTextureCube=K,this.rebindTextures=Ve,this.setupRenderTarget=H,this.updateRenderTargetMipmap=dt,this.updateMultisampleRenderTarget=Ee,this.setupDepthRenderbuffer=be,this.setupFrameBufferTexture=ve,this.useMultisampledRTT=_e}function vm(i,e,t){const n=t.isWebGL2;function s(r,a=Wt){let o;const l=tt.getTransfer(a);if(r===Tn)return i.UNSIGNED_BYTE;if(r===Sl)return i.UNSIGNED_SHORT_4_4_4_4;if(r===yl)return i.UNSIGNED_SHORT_5_5_5_1;if(r===Jc)return i.BYTE;if(r===Qc)return i.SHORT;if(r===Vr)return i.UNSIGNED_SHORT;if(r===xl)return i.INT;if(r===xn)return i.UNSIGNED_INT;if(r===Sn)return i.FLOAT;if(r===Vi)return n?i.HALF_FLOAT:(o=e.get("OES_texture_half_float"),o!==null?o.HALF_FLOAT_OES:null);if(r===eh)return i.ALPHA;if(r===Zt)return i.RGBA;if(r===th)return i.LUMINANCE;if(r===nh)return i.LUMINANCE_ALPHA;if(r===zn)return i.DEPTH_COMPONENT;if(r===Ai)return i.DEPTH_STENCIL;if(r===Nr)return o=e.get("EXT_sRGB"),o!==null?o.SRGB_ALPHA_EXT:null;if(r===ih)return i.RED;if(r===El)return i.RED_INTEGER;if(r===sh)return i.RG;if(r===Tl)return i.RG_INTEGER;if(r===bl)return i.RGBA_INTEGER;if(r===qs||r===js||r===Ks||r===$s)if(l===nt)if(o=e.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(r===qs)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===js)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===Ks)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===$s)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=e.get("WEBGL_compressed_texture_s3tc"),o!==null){if(r===qs)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===js)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===Ks)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===$s)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===xo||r===So||r===yo||r===Eo)if(o=e.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(r===xo)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===So)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===yo)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===Eo)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===Al)return o=e.get("WEBGL_compressed_texture_etc1"),o!==null?o.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===To||r===bo)if(o=e.get("WEBGL_compressed_texture_etc"),o!==null){if(r===To)return l===nt?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(r===bo)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===Ao||r===wo||r===Ro||r===Co||r===Po||r===Lo||r===Do||r===Io||r===Uo||r===No||r===Oo||r===Fo||r===Bo||r===zo)if(o=e.get("WEBGL_compressed_texture_astc"),o!==null){if(r===Ao)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===wo)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Ro)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===Co)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===Po)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===Lo)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===Do)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Io)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Uo)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===No)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Oo)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Fo)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===Bo)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===zo)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===Zs||r===Ho||r===Go)if(o=e.get("EXT_texture_compression_bptc"),o!==null){if(r===Zs)return l===nt?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===Ho)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===Go)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===rh||r===ko||r===Vo||r===Wo)if(o=e.get("EXT_texture_compression_rgtc"),o!==null){if(r===Zs)return o.COMPRESSED_RED_RGTC1_EXT;if(r===ko)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===Vo)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===Wo)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===Bn?n?i.UNSIGNED_INT_24_8:(o=e.get("WEBGL_depth_texture"),o!==null?o.UNSIGNED_INT_24_8_WEBGL:null):i[r]!==void 0?i[r]:null}return{convert:s}}class Mm extends Vt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class vs extends yt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const xm={type:"move"};class Sr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new vs,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new vs,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new vs,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,u=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(u&&e.hand){a=!0;for(const _ of e.hand.values()){const p=t.getJointPose(_,n),c=this._getHandJoint(u,_);p!==null&&(c.matrix.fromArray(p.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,c.jointRadius=p.radius),c.visible=p!==null}const d=u.joints["index-finger-tip"],f=u.joints["thumb-tip"],h=d.position.distanceTo(f.position),m=.02,g=.005;u.inputState.pinching&&h>m+g?(u.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!u.inputState.pinching&&h<=m-g&&(u.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(xm)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),u!==null&&(u.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new vs;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class Sm extends qn{constructor(e,t){super();const n=this;let s=null,r=1,a=null,o="local-floor",l=1,u=null,d=null,f=null,h=null,m=null,g=null;const _=t.getContextAttributes();let p=null,c=null;const x=[],v=[],M=new Ue;let E=null;const T=new Vt;T.layers.enable(1),T.viewport=new _t;const b=new Vt;b.layers.enable(2),b.viewport=new _t;const N=[T,b],y=new Mm;y.layers.enable(1),y.layers.enable(2);let w=null,O=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(V){let Z=x[V];return Z===void 0&&(Z=new Sr,x[V]=Z),Z.getTargetRaySpace()},this.getControllerGrip=function(V){let Z=x[V];return Z===void 0&&(Z=new Sr,x[V]=Z),Z.getGripSpace()},this.getHand=function(V){let Z=x[V];return Z===void 0&&(Z=new Sr,x[V]=Z),Z.getHandSpace()};function F(V){const Z=v.indexOf(V.inputSource);if(Z===-1)return;const ce=x[Z];ce!==void 0&&(ce.update(V.inputSource,V.frame,u||a),ce.dispatchEvent({type:V.type,data:V.inputSource}))}function Y(){s.removeEventListener("select",F),s.removeEventListener("selectstart",F),s.removeEventListener("selectend",F),s.removeEventListener("squeeze",F),s.removeEventListener("squeezestart",F),s.removeEventListener("squeezeend",F),s.removeEventListener("end",Y),s.removeEventListener("inputsourceschange",D);for(let V=0;V<x.length;V++){const Z=v[V];Z!==null&&(v[V]=null,x[V].disconnect(Z))}w=null,O=null,e.setRenderTarget(p),m=null,h=null,f=null,s=null,c=null,oe.stop(),n.isPresenting=!1,e.setPixelRatio(E),e.setSize(M.width,M.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(V){r=V,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(V){o=V,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return u||a},this.setReferenceSpace=function(V){u=V},this.getBaseLayer=function(){return h!==null?h:m},this.getBinding=function(){return f},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(V){if(s=V,s!==null){if(p=e.getRenderTarget(),s.addEventListener("select",F),s.addEventListener("selectstart",F),s.addEventListener("selectend",F),s.addEventListener("squeeze",F),s.addEventListener("squeezestart",F),s.addEventListener("squeezeend",F),s.addEventListener("end",Y),s.addEventListener("inputsourceschange",D),_.xrCompatible!==!0&&await t.makeXRCompatible(),E=e.getPixelRatio(),e.getSize(M),s.renderState.layers===void 0||e.capabilities.isWebGL2===!1){const Z={antialias:s.renderState.layers===void 0?_.antialias:!0,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,t,Z),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),c=new Wn(m.framebufferWidth,m.framebufferHeight,{format:Zt,type:Tn,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil})}else{let Z=null,ce=null,Me=null;_.depth&&(Me=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Z=_.stencil?Ai:zn,ce=_.stencil?Bn:xn);const ve={colorFormat:t.RGBA8,depthFormat:Me,scaleFactor:r};f=new XRWebGLBinding(s,t),h=f.createProjectionLayer(ve),s.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),c=new Wn(h.textureWidth,h.textureHeight,{format:Zt,type:Tn,depthTexture:new kl(h.textureWidth,h.textureHeight,ce,void 0,void 0,void 0,void 0,void 0,void 0,Z),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0});const Ce=e.properties.get(c);Ce.__ignoreDepthValues=h.ignoreDepthValues}c.isXRRenderTarget=!0,this.setFoveation(l),u=null,a=await s.requestReferenceSpace(o),oe.setContext(s),oe.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function D(V){for(let Z=0;Z<V.removed.length;Z++){const ce=V.removed[Z],Me=v.indexOf(ce);Me>=0&&(v[Me]=null,x[Me].disconnect(ce))}for(let Z=0;Z<V.added.length;Z++){const ce=V.added[Z];let Me=v.indexOf(ce);if(Me===-1){for(let Ce=0;Ce<x.length;Ce++)if(Ce>=v.length){v.push(ce),Me=Ce;break}else if(v[Ce]===null){v[Ce]=ce,Me=Ce;break}if(Me===-1)break}const ve=x[Me];ve&&ve.connect(ce)}}const B=new I,X=new I;function j(V,Z,ce){B.setFromMatrixPosition(Z.matrixWorld),X.setFromMatrixPosition(ce.matrixWorld);const Me=B.distanceTo(X),ve=Z.projectionMatrix.elements,Ce=ce.projectionMatrix.elements,Le=ve[14]/(ve[10]-1),be=ve[14]/(ve[10]+1),Ve=(ve[9]+1)/ve[5],H=(ve[9]-1)/ve[5],dt=(ve[8]-1)/ve[0],Ee=(Ce[8]+1)/Ce[0],Pe=Le*dt,_e=Le*Ee,et=Me/(-dt+Ee),Fe=et*-dt;Z.matrixWorld.decompose(V.position,V.quaternion,V.scale),V.translateX(Fe),V.translateZ(et),V.matrixWorld.compose(V.position,V.quaternion,V.scale),V.matrixWorldInverse.copy(V.matrixWorld).invert();const R=Le+et,S=be+et,z=Pe-Fe,te=_e+(Me-Fe),Q=Ve*be/S*R,ne=H*be/S*R;V.projectionMatrix.makePerspective(z,te,Q,ne,R,S),V.projectionMatrixInverse.copy(V.projectionMatrix).invert()}function q(V,Z){Z===null?V.matrixWorld.copy(V.matrix):V.matrixWorld.multiplyMatrices(Z.matrixWorld,V.matrix),V.matrixWorldInverse.copy(V.matrixWorld).invert()}this.updateCamera=function(V){if(s===null)return;y.near=b.near=T.near=V.near,y.far=b.far=T.far=V.far,(w!==y.near||O!==y.far)&&(s.updateRenderState({depthNear:y.near,depthFar:y.far}),w=y.near,O=y.far);const Z=V.parent,ce=y.cameras;q(y,Z);for(let Me=0;Me<ce.length;Me++)q(ce[Me],Z);ce.length===2?j(y,T,b):y.projectionMatrix.copy(T.projectionMatrix),K(V,y,Z)};function K(V,Z,ce){ce===null?V.matrix.copy(Z.matrixWorld):(V.matrix.copy(ce.matrixWorld),V.matrix.invert(),V.matrix.multiply(Z.matrixWorld)),V.matrix.decompose(V.position,V.quaternion,V.scale),V.updateMatrixWorld(!0),V.projectionMatrix.copy(Z.projectionMatrix),V.projectionMatrixInverse.copy(Z.projectionMatrixInverse),V.isPerspectiveCamera&&(V.fov=Or*2*Math.atan(1/V.projectionMatrix.elements[5]),V.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(h===null&&m===null))return l},this.setFoveation=function(V){l=V,h!==null&&(h.fixedFoveation=V),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=V)};let $=null;function se(V,Z){if(d=Z.getViewerPose(u||a),g=Z,d!==null){const ce=d.views;m!==null&&(e.setRenderTargetFramebuffer(c,m.framebuffer),e.setRenderTarget(c));let Me=!1;ce.length!==y.cameras.length&&(y.cameras.length=0,Me=!0);for(let ve=0;ve<ce.length;ve++){const Ce=ce[ve];let Le=null;if(m!==null)Le=m.getViewport(Ce);else{const Ve=f.getViewSubImage(h,Ce);Le=Ve.viewport,ve===0&&(e.setRenderTargetTextures(c,Ve.colorTexture,h.ignoreDepthValues?void 0:Ve.depthStencilTexture),e.setRenderTarget(c))}let be=N[ve];be===void 0&&(be=new Vt,be.layers.enable(ve),be.viewport=new _t,N[ve]=be),be.matrix.fromArray(Ce.transform.matrix),be.matrix.decompose(be.position,be.quaternion,be.scale),be.projectionMatrix.fromArray(Ce.projectionMatrix),be.projectionMatrixInverse.copy(be.projectionMatrix).invert(),be.viewport.set(Le.x,Le.y,Le.width,Le.height),ve===0&&(y.matrix.copy(be.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),Me===!0&&y.cameras.push(be)}}for(let ce=0;ce<x.length;ce++){const Me=v[ce],ve=x[ce];Me!==null&&ve!==void 0&&ve.update(Me,Z,u||a)}$&&$(V,Z),Z.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Z}),g=null}const oe=new Hl;oe.setAnimationLoop(se),this.setAnimationLoop=function(V){$=V},this.dispose=function(){}}}function ym(i,e){function t(p,c){p.matrixAutoUpdate===!0&&p.updateMatrix(),c.value.copy(p.matrix)}function n(p,c){c.color.getRGB(p.fogColor.value,Fl(i)),c.isFog?(p.fogNear.value=c.near,p.fogFar.value=c.far):c.isFogExp2&&(p.fogDensity.value=c.density)}function s(p,c,x,v,M){c.isMeshBasicMaterial||c.isMeshLambertMaterial?r(p,c):c.isMeshToonMaterial?(r(p,c),f(p,c)):c.isMeshPhongMaterial?(r(p,c),d(p,c)):c.isMeshStandardMaterial?(r(p,c),h(p,c),c.isMeshPhysicalMaterial&&m(p,c,M)):c.isMeshMatcapMaterial?(r(p,c),g(p,c)):c.isMeshDepthMaterial?r(p,c):c.isMeshDistanceMaterial?(r(p,c),_(p,c)):c.isMeshNormalMaterial?r(p,c):c.isLineBasicMaterial?(a(p,c),c.isLineDashedMaterial&&o(p,c)):c.isPointsMaterial?l(p,c,x,v):c.isSpriteMaterial?u(p,c):c.isShadowMaterial?(p.color.value.copy(c.color),p.opacity.value=c.opacity):c.isShaderMaterial&&(c.uniformsNeedUpdate=!1)}function r(p,c){p.opacity.value=c.opacity,c.color&&p.diffuse.value.copy(c.color),c.emissive&&p.emissive.value.copy(c.emissive).multiplyScalar(c.emissiveIntensity),c.map&&(p.map.value=c.map,t(c.map,p.mapTransform)),c.alphaMap&&(p.alphaMap.value=c.alphaMap,t(c.alphaMap,p.alphaMapTransform)),c.bumpMap&&(p.bumpMap.value=c.bumpMap,t(c.bumpMap,p.bumpMapTransform),p.bumpScale.value=c.bumpScale,c.side===Lt&&(p.bumpScale.value*=-1)),c.normalMap&&(p.normalMap.value=c.normalMap,t(c.normalMap,p.normalMapTransform),p.normalScale.value.copy(c.normalScale),c.side===Lt&&p.normalScale.value.negate()),c.displacementMap&&(p.displacementMap.value=c.displacementMap,t(c.displacementMap,p.displacementMapTransform),p.displacementScale.value=c.displacementScale,p.displacementBias.value=c.displacementBias),c.emissiveMap&&(p.emissiveMap.value=c.emissiveMap,t(c.emissiveMap,p.emissiveMapTransform)),c.specularMap&&(p.specularMap.value=c.specularMap,t(c.specularMap,p.specularMapTransform)),c.alphaTest>0&&(p.alphaTest.value=c.alphaTest);const x=e.get(c).envMap;if(x&&(p.envMap.value=x,p.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=c.reflectivity,p.ior.value=c.ior,p.refractionRatio.value=c.refractionRatio),c.lightMap){p.lightMap.value=c.lightMap;const v=i._useLegacyLights===!0?Math.PI:1;p.lightMapIntensity.value=c.lightMapIntensity*v,t(c.lightMap,p.lightMapTransform)}c.aoMap&&(p.aoMap.value=c.aoMap,p.aoMapIntensity.value=c.aoMapIntensity,t(c.aoMap,p.aoMapTransform))}function a(p,c){p.diffuse.value.copy(c.color),p.opacity.value=c.opacity,c.map&&(p.map.value=c.map,t(c.map,p.mapTransform))}function o(p,c){p.dashSize.value=c.dashSize,p.totalSize.value=c.dashSize+c.gapSize,p.scale.value=c.scale}function l(p,c,x,v){p.diffuse.value.copy(c.color),p.opacity.value=c.opacity,p.size.value=c.size*x,p.scale.value=v*.5,c.map&&(p.map.value=c.map,t(c.map,p.uvTransform)),c.alphaMap&&(p.alphaMap.value=c.alphaMap,t(c.alphaMap,p.alphaMapTransform)),c.alphaTest>0&&(p.alphaTest.value=c.alphaTest)}function u(p,c){p.diffuse.value.copy(c.color),p.opacity.value=c.opacity,p.rotation.value=c.rotation,c.map&&(p.map.value=c.map,t(c.map,p.mapTransform)),c.alphaMap&&(p.alphaMap.value=c.alphaMap,t(c.alphaMap,p.alphaMapTransform)),c.alphaTest>0&&(p.alphaTest.value=c.alphaTest)}function d(p,c){p.specular.value.copy(c.specular),p.shininess.value=Math.max(c.shininess,1e-4)}function f(p,c){c.gradientMap&&(p.gradientMap.value=c.gradientMap)}function h(p,c){p.metalness.value=c.metalness,c.metalnessMap&&(p.metalnessMap.value=c.metalnessMap,t(c.metalnessMap,p.metalnessMapTransform)),p.roughness.value=c.roughness,c.roughnessMap&&(p.roughnessMap.value=c.roughnessMap,t(c.roughnessMap,p.roughnessMapTransform)),e.get(c).envMap&&(p.envMapIntensity.value=c.envMapIntensity)}function m(p,c,x){p.ior.value=c.ior,c.sheen>0&&(p.sheenColor.value.copy(c.sheenColor).multiplyScalar(c.sheen),p.sheenRoughness.value=c.sheenRoughness,c.sheenColorMap&&(p.sheenColorMap.value=c.sheenColorMap,t(c.sheenColorMap,p.sheenColorMapTransform)),c.sheenRoughnessMap&&(p.sheenRoughnessMap.value=c.sheenRoughnessMap,t(c.sheenRoughnessMap,p.sheenRoughnessMapTransform))),c.clearcoat>0&&(p.clearcoat.value=c.clearcoat,p.clearcoatRoughness.value=c.clearcoatRoughness,c.clearcoatMap&&(p.clearcoatMap.value=c.clearcoatMap,t(c.clearcoatMap,p.clearcoatMapTransform)),c.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=c.clearcoatRoughnessMap,t(c.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),c.clearcoatNormalMap&&(p.clearcoatNormalMap.value=c.clearcoatNormalMap,t(c.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(c.clearcoatNormalScale),c.side===Lt&&p.clearcoatNormalScale.value.negate())),c.iridescence>0&&(p.iridescence.value=c.iridescence,p.iridescenceIOR.value=c.iridescenceIOR,p.iridescenceThicknessMinimum.value=c.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=c.iridescenceThicknessRange[1],c.iridescenceMap&&(p.iridescenceMap.value=c.iridescenceMap,t(c.iridescenceMap,p.iridescenceMapTransform)),c.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=c.iridescenceThicknessMap,t(c.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),c.transmission>0&&(p.transmission.value=c.transmission,p.transmissionSamplerMap.value=x.texture,p.transmissionSamplerSize.value.set(x.width,x.height),c.transmissionMap&&(p.transmissionMap.value=c.transmissionMap,t(c.transmissionMap,p.transmissionMapTransform)),p.thickness.value=c.thickness,c.thicknessMap&&(p.thicknessMap.value=c.thicknessMap,t(c.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=c.attenuationDistance,p.attenuationColor.value.copy(c.attenuationColor)),c.anisotropy>0&&(p.anisotropyVector.value.set(c.anisotropy*Math.cos(c.anisotropyRotation),c.anisotropy*Math.sin(c.anisotropyRotation)),c.anisotropyMap&&(p.anisotropyMap.value=c.anisotropyMap,t(c.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=c.specularIntensity,p.specularColor.value.copy(c.specularColor),c.specularColorMap&&(p.specularColorMap.value=c.specularColorMap,t(c.specularColorMap,p.specularColorMapTransform)),c.specularIntensityMap&&(p.specularIntensityMap.value=c.specularIntensityMap,t(c.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,c){c.matcap&&(p.matcap.value=c.matcap)}function _(p,c){const x=e.get(c).light;p.referencePosition.value.setFromMatrixPosition(x.matrixWorld),p.nearDistance.value=x.shadow.camera.near,p.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Em(i,e,t,n){let s={},r={},a=[];const o=t.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(x,v){const M=v.program;n.uniformBlockBinding(x,M)}function u(x,v){let M=s[x.id];M===void 0&&(g(x),M=d(x),s[x.id]=M,x.addEventListener("dispose",p));const E=v.program;n.updateUBOMapping(x,E);const T=e.render.frame;r[x.id]!==T&&(h(x),r[x.id]=T)}function d(x){const v=f();x.__bindingPointIndex=v;const M=i.createBuffer(),E=x.__size,T=x.usage;return i.bindBuffer(i.UNIFORM_BUFFER,M),i.bufferData(i.UNIFORM_BUFFER,E,T),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,v,M),M}function f(){for(let x=0;x<o;x++)if(a.indexOf(x)===-1)return a.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(x){const v=s[x.id],M=x.uniforms,E=x.__cache;i.bindBuffer(i.UNIFORM_BUFFER,v);for(let T=0,b=M.length;T<b;T++){const N=Array.isArray(M[T])?M[T]:[M[T]];for(let y=0,w=N.length;y<w;y++){const O=N[y];if(m(O,T,y,E)===!0){const F=O.__offset,Y=Array.isArray(O.value)?O.value:[O.value];let D=0;for(let B=0;B<Y.length;B++){const X=Y[B],j=_(X);typeof X=="number"||typeof X=="boolean"?(O.__data[0]=X,i.bufferSubData(i.UNIFORM_BUFFER,F+D,O.__data)):X.isMatrix3?(O.__data[0]=X.elements[0],O.__data[1]=X.elements[1],O.__data[2]=X.elements[2],O.__data[3]=0,O.__data[4]=X.elements[3],O.__data[5]=X.elements[4],O.__data[6]=X.elements[5],O.__data[7]=0,O.__data[8]=X.elements[6],O.__data[9]=X.elements[7],O.__data[10]=X.elements[8],O.__data[11]=0):(X.toArray(O.__data,D),D+=j.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,F,O.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(x,v,M,E){const T=x.value,b=v+"_"+M;if(E[b]===void 0)return typeof T=="number"||typeof T=="boolean"?E[b]=T:E[b]=T.clone(),!0;{const N=E[b];if(typeof T=="number"||typeof T=="boolean"){if(N!==T)return E[b]=T,!0}else if(N.equals(T)===!1)return N.copy(T),!0}return!1}function g(x){const v=x.uniforms;let M=0;const E=16;for(let b=0,N=v.length;b<N;b++){const y=Array.isArray(v[b])?v[b]:[v[b]];for(let w=0,O=y.length;w<O;w++){const F=y[w],Y=Array.isArray(F.value)?F.value:[F.value];for(let D=0,B=Y.length;D<B;D++){const X=Y[D],j=_(X),q=M%E;q!==0&&E-q<j.boundary&&(M+=E-q),F.__data=new Float32Array(j.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=M,M+=j.storage}}}const T=M%E;return T>0&&(M+=E-T),x.__size=M,x.__cache={},this}function _(x){const v={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(v.boundary=4,v.storage=4):x.isVector2?(v.boundary=8,v.storage=8):x.isVector3||x.isColor?(v.boundary=16,v.storage=12):x.isVector4?(v.boundary=16,v.storage=16):x.isMatrix3?(v.boundary=48,v.storage=48):x.isMatrix4?(v.boundary=64,v.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),v}function p(x){const v=x.target;v.removeEventListener("dispose",p);const M=a.indexOf(v.__bindingPointIndex);a.splice(M,1),i.deleteBuffer(s[v.id]),delete s[v.id],delete r[v.id]}function c(){for(const x in s)i.deleteBuffer(s[x]);a=[],s={},r={}}return{bind:l,update:u,dispose:c}}class jl{constructor(e={}){const{canvas:t=vh(),context:n=null,depth:s=!0,stencil:r=!0,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:u=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:f=!1}=e;this.isWebGLRenderer=!0;let h;n!==null?h=n.getContextAttributes().alpha:h=a;const m=new Uint32Array(4),g=new Int32Array(4);let _=null,p=null;const c=[],x=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=xt,this._useLegacyLights=!1,this.toneMapping=En,this.toneMappingExposure=1;const v=this;let M=!1,E=0,T=0,b=null,N=-1,y=null;const w=new _t,O=new _t;let F=null;const Y=new Ze(0);let D=0,B=t.width,X=t.height,j=1,q=null,K=null;const $=new _t(0,0,B,X),se=new _t(0,0,B,X);let oe=!1;const V=new Yr;let Z=!1,ce=!1,Me=null;const ve=new ut,Ce=new Ue,Le=new I,be={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Ve(){return b===null?j:1}let H=n;function dt(A,U){for(let k=0;k<A.length;k++){const W=A[k],G=t.getContext(W,U);if(G!==null)return G}return null}try{const A={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:u,powerPreference:d,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Gr}`),t.addEventListener("webglcontextlost",ee,!1),t.addEventListener("webglcontextrestored",L,!1),t.addEventListener("webglcontextcreationerror",re,!1),H===null){const U=["webgl2","webgl","experimental-webgl"];if(v.isWebGL1Renderer===!0&&U.shift(),H=dt(U,A),H===null)throw dt(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&H instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),H.getShaderPrecisionFormat===void 0&&(H.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let Ee,Pe,_e,et,Fe,R,S,z,te,Q,ne,xe,de,ge,Re,He,J,Qe,Xe,Ne,Te,fe,C,ie;function Se(){Ee=new If(H),Pe=new wf(H,Ee,e),Ee.init(Pe),fe=new vm(H,Ee,Pe),_e=new gm(H,Ee,Pe),et=new Of(H),Fe=new nm,R=new _m(H,Ee,_e,Fe,Pe,fe,et),S=new Cf(v),z=new Df(v),te=new Vh(H,Pe),C=new bf(H,Ee,te,Pe),Q=new Uf(H,te,et,C),ne=new Hf(H,Q,te,et),Xe=new zf(H,Pe,R),He=new Rf(Fe),xe=new tm(v,S,z,Ee,Pe,C,He),de=new ym(v,Fe),ge=new sm,Re=new hm(Ee,Pe),Qe=new Tf(v,S,z,_e,ne,h,l),J=new mm(v,ne,Pe),ie=new Em(H,et,Pe,_e),Ne=new Af(H,Ee,et,Pe),Te=new Nf(H,Ee,et,Pe),et.programs=xe.programs,v.capabilities=Pe,v.extensions=Ee,v.properties=Fe,v.renderLists=ge,v.shadowMap=J,v.state=_e,v.info=et}Se();const me=new Sm(v,H);this.xr=me,this.getContext=function(){return H},this.getContextAttributes=function(){return H.getContextAttributes()},this.forceContextLoss=function(){const A=Ee.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=Ee.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return j},this.setPixelRatio=function(A){A!==void 0&&(j=A,this.setSize(B,X,!1))},this.getSize=function(A){return A.set(B,X)},this.setSize=function(A,U,k=!0){if(me.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}B=A,X=U,t.width=Math.floor(A*j),t.height=Math.floor(U*j),k===!0&&(t.style.width=A+"px",t.style.height=U+"px"),this.setViewport(0,0,A,U)},this.getDrawingBufferSize=function(A){return A.set(B*j,X*j).floor()},this.setDrawingBufferSize=function(A,U,k){B=A,X=U,j=k,t.width=Math.floor(A*k),t.height=Math.floor(U*k),this.setViewport(0,0,A,U)},this.getCurrentViewport=function(A){return A.copy(w)},this.getViewport=function(A){return A.copy($)},this.setViewport=function(A,U,k,W){A.isVector4?$.set(A.x,A.y,A.z,A.w):$.set(A,U,k,W),_e.viewport(w.copy($).multiplyScalar(j).floor())},this.getScissor=function(A){return A.copy(se)},this.setScissor=function(A,U,k,W){A.isVector4?se.set(A.x,A.y,A.z,A.w):se.set(A,U,k,W),_e.scissor(O.copy(se).multiplyScalar(j).floor())},this.getScissorTest=function(){return oe},this.setScissorTest=function(A){_e.setScissorTest(oe=A)},this.setOpaqueSort=function(A){q=A},this.setTransparentSort=function(A){K=A},this.getClearColor=function(A){return A.copy(Qe.getClearColor())},this.setClearColor=function(){Qe.setClearColor.apply(Qe,arguments)},this.getClearAlpha=function(){return Qe.getClearAlpha()},this.setClearAlpha=function(){Qe.setClearAlpha.apply(Qe,arguments)},this.clear=function(A=!0,U=!0,k=!0){let W=0;if(A){let G=!1;if(b!==null){const pe=b.texture.format;G=pe===bl||pe===Tl||pe===El}if(G){const pe=b.texture.type,ye=pe===Tn||pe===xn||pe===Vr||pe===Bn||pe===Sl||pe===yl,Ie=Qe.getClearColor(),Oe=Qe.getClearAlpha(),Ye=Ie.r,Be=Ie.g,Ge=Ie.b;ye?(m[0]=Ye,m[1]=Be,m[2]=Ge,m[3]=Oe,H.clearBufferuiv(H.COLOR,0,m)):(g[0]=Ye,g[1]=Be,g[2]=Ge,g[3]=Oe,H.clearBufferiv(H.COLOR,0,g))}else W|=H.COLOR_BUFFER_BIT}U&&(W|=H.DEPTH_BUFFER_BIT),k&&(W|=H.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),H.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ee,!1),t.removeEventListener("webglcontextrestored",L,!1),t.removeEventListener("webglcontextcreationerror",re,!1),ge.dispose(),Re.dispose(),Fe.dispose(),S.dispose(),z.dispose(),ne.dispose(),C.dispose(),ie.dispose(),xe.dispose(),me.dispose(),me.removeEventListener("sessionstart",at),me.removeEventListener("sessionend",Je),Me&&(Me.dispose(),Me=null),ct.stop()};function ee(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),M=!0}function L(){console.log("THREE.WebGLRenderer: Context Restored."),M=!1;const A=et.autoReset,U=J.enabled,k=J.autoUpdate,W=J.needsUpdate,G=J.type;Se(),et.autoReset=A,J.enabled=U,J.autoUpdate=k,J.needsUpdate=W,J.type=G}function re(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function ue(A){const U=A.target;U.removeEventListener("dispose",ue),De(U)}function De(A){we(A),Fe.remove(A)}function we(A){const U=Fe.get(A).programs;U!==void 0&&(U.forEach(function(k){xe.releaseProgram(k)}),A.isShaderMaterial&&xe.releaseShaderCache(A))}this.renderBufferDirect=function(A,U,k,W,G,pe){U===null&&(U=be);const ye=G.isMesh&&G.matrixWorld.determinant()<0,Ie=hc(A,U,k,W,G);_e.setMaterial(W,ye);let Oe=k.index,Ye=1;if(W.wireframe===!0){if(Oe=Q.getWireframeAttribute(k),Oe===void 0)return;Ye=2}const Be=k.drawRange,Ge=k.attributes.position;let lt=Be.start*Ye,It=(Be.start+Be.count)*Ye;pe!==null&&(lt=Math.max(lt,pe.start*Ye),It=Math.min(It,(pe.start+pe.count)*Ye)),Oe!==null?(lt=Math.max(lt,0),It=Math.min(It,Oe.count)):Ge!=null&&(lt=Math.max(lt,0),It=Math.min(It,Ge.count));const mt=It-lt;if(mt<0||mt===1/0)return;C.setup(G,W,Ie,k,Oe);let sn,it=Ne;if(Oe!==null&&(sn=te.get(Oe),it=Te,it.setIndex(sn)),G.isMesh)W.wireframe===!0?(_e.setLineWidth(W.wireframeLinewidth*Ve()),it.setMode(H.LINES)):it.setMode(H.TRIANGLES);else if(G.isLine){let qe=W.linewidth;qe===void 0&&(qe=1),_e.setLineWidth(qe*Ve()),G.isLineSegments?it.setMode(H.LINES):G.isLineLoop?it.setMode(H.LINE_LOOP):it.setMode(H.LINE_STRIP)}else G.isPoints?it.setMode(H.POINTS):G.isSprite&&it.setMode(H.TRIANGLES);if(G.isBatchedMesh)it.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else if(G.isInstancedMesh)it.renderInstances(lt,mt,G.count);else if(k.isInstancedBufferGeometry){const qe=k._maxInstanceCount!==void 0?k._maxInstanceCount:1/0,ks=Math.min(k.instanceCount,qe);it.renderInstances(lt,mt,ks)}else it.render(lt,mt)};function Ke(A,U,k){A.transparent===!0&&A.side===Kt&&A.forceSinglePass===!1?(A.side=Lt,A.needsUpdate=!0,ji(A,U,k),A.side=An,A.needsUpdate=!0,ji(A,U,k),A.side=Kt):ji(A,U,k)}this.compile=function(A,U,k=null){k===null&&(k=A),p=Re.get(k),p.init(),x.push(p),k.traverseVisible(function(G){G.isLight&&G.layers.test(U.layers)&&(p.pushLight(G),G.castShadow&&p.pushShadow(G))}),A!==k&&A.traverseVisible(function(G){G.isLight&&G.layers.test(U.layers)&&(p.pushLight(G),G.castShadow&&p.pushShadow(G))}),p.setupLights(v._useLegacyLights);const W=new Set;return A.traverse(function(G){const pe=G.material;if(pe)if(Array.isArray(pe))for(let ye=0;ye<pe.length;ye++){const Ie=pe[ye];Ke(Ie,k,G),W.add(Ie)}else Ke(pe,k,G),W.add(pe)}),x.pop(),p=null,W},this.compileAsync=function(A,U,k=null){const W=this.compile(A,U,k);return new Promise(G=>{function pe(){if(W.forEach(function(ye){Fe.get(ye).currentProgram.isReady()&&W.delete(ye)}),W.size===0){G(A);return}setTimeout(pe,10)}Ee.get("KHR_parallel_shader_compile")!==null?pe():setTimeout(pe,10)})};let $e=null;function st(A){$e&&$e(A)}function at(){ct.stop()}function Je(){ct.start()}const ct=new Hl;ct.setAnimationLoop(st),typeof self<"u"&&ct.setContext(self),this.setAnimationLoop=function(A){$e=A,me.setAnimationLoop(A),A===null?ct.stop():ct.start()},me.addEventListener("sessionstart",at),me.addEventListener("sessionend",Je),this.render=function(A,U){if(U!==void 0&&U.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(M===!0)return;A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),me.enabled===!0&&me.isPresenting===!0&&(me.cameraAutoUpdate===!0&&me.updateCamera(U),U=me.getCamera()),A.isScene===!0&&A.onBeforeRender(v,A,U,b),p=Re.get(A,x.length),p.init(),x.push(p),ve.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),V.setFromProjectionMatrix(ve),ce=this.localClippingEnabled,Z=He.init(this.clippingPlanes,ce),_=ge.get(A,c.length),_.init(),c.push(_),tn(A,U,0,v.sortObjects),_.finish(),v.sortObjects===!0&&_.sort(q,K),this.info.render.frame++,Z===!0&&He.beginShadows();const k=p.state.shadowsArray;if(J.render(k,A,U),Z===!0&&He.endShadows(),this.info.autoReset===!0&&this.info.reset(),Qe.render(_,A),p.setupLights(v._useLegacyLights),U.isArrayCamera){const W=U.cameras;for(let G=0,pe=W.length;G<pe;G++){const ye=W[G];so(_,A,ye,ye.viewport)}}else so(_,A,U);b!==null&&(R.updateMultisampleRenderTarget(b),R.updateRenderTargetMipmap(b)),A.isScene===!0&&A.onAfterRender(v,A,U),C.resetDefaultState(),N=-1,y=null,x.pop(),x.length>0?p=x[x.length-1]:p=null,c.pop(),c.length>0?_=c[c.length-1]:_=null};function tn(A,U,k,W){if(A.visible===!1)return;if(A.layers.test(U.layers)){if(A.isGroup)k=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(U);else if(A.isLight)p.pushLight(A),A.castShadow&&p.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||V.intersectsSprite(A)){W&&Le.setFromMatrixPosition(A.matrixWorld).applyMatrix4(ve);const ye=ne.update(A),Ie=A.material;Ie.visible&&_.push(A,ye,Ie,k,Le.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||V.intersectsObject(A))){const ye=ne.update(A),Ie=A.material;if(W&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),Le.copy(A.boundingSphere.center)):(ye.boundingSphere===null&&ye.computeBoundingSphere(),Le.copy(ye.boundingSphere.center)),Le.applyMatrix4(A.matrixWorld).applyMatrix4(ve)),Array.isArray(Ie)){const Oe=ye.groups;for(let Ye=0,Be=Oe.length;Ye<Be;Ye++){const Ge=Oe[Ye],lt=Ie[Ge.materialIndex];lt&&lt.visible&&_.push(A,ye,lt,k,Le.z,Ge)}}else Ie.visible&&_.push(A,ye,Ie,k,Le.z,null)}}const pe=A.children;for(let ye=0,Ie=pe.length;ye<Ie;ye++)tn(pe[ye],U,k,W)}function so(A,U,k,W){const G=A.opaque,pe=A.transmissive,ye=A.transparent;p.setupLightsView(k),Z===!0&&He.setGlobalState(v.clippingPlanes,k),pe.length>0&&cc(G,pe,U,k),W&&_e.viewport(w.copy(W)),G.length>0&&qi(G,U,k),pe.length>0&&qi(pe,U,k),ye.length>0&&qi(ye,U,k),_e.buffers.depth.setTest(!0),_e.buffers.depth.setMask(!0),_e.buffers.color.setMask(!0),_e.setPolygonOffset(!1)}function cc(A,U,k,W){if((k.isScene===!0?k.overrideMaterial:null)!==null)return;const pe=Pe.isWebGL2;Me===null&&(Me=new Wn(1,1,{generateMipmaps:!0,type:Ee.has("EXT_color_buffer_half_float")?Vi:Tn,minFilter:ki,samples:pe?4:0})),v.getDrawingBufferSize(Ce),pe?Me.setSize(Ce.x,Ce.y):Me.setSize(Fr(Ce.x),Fr(Ce.y));const ye=v.getRenderTarget();v.setRenderTarget(Me),v.getClearColor(Y),D=v.getClearAlpha(),D<1&&v.setClearColor(16777215,.5),v.clear();const Ie=v.toneMapping;v.toneMapping=En,qi(A,k,W),R.updateMultisampleRenderTarget(Me),R.updateRenderTargetMipmap(Me);let Oe=!1;for(let Ye=0,Be=U.length;Ye<Be;Ye++){const Ge=U[Ye],lt=Ge.object,It=Ge.geometry,mt=Ge.material,sn=Ge.group;if(mt.side===Kt&&lt.layers.test(W.layers)){const it=mt.side;mt.side=Lt,mt.needsUpdate=!0,ro(lt,k,W,It,mt,sn),mt.side=it,mt.needsUpdate=!0,Oe=!0}}Oe===!0&&(R.updateMultisampleRenderTarget(Me),R.updateRenderTargetMipmap(Me)),v.setRenderTarget(ye),v.setClearColor(Y,D),v.toneMapping=Ie}function qi(A,U,k){const W=U.isScene===!0?U.overrideMaterial:null;for(let G=0,pe=A.length;G<pe;G++){const ye=A[G],Ie=ye.object,Oe=ye.geometry,Ye=W===null?ye.material:W,Be=ye.group;Ie.layers.test(k.layers)&&ro(Ie,U,k,Oe,Ye,Be)}}function ro(A,U,k,W,G,pe){A.onBeforeRender(v,U,k,W,G,pe),A.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),G.onBeforeRender(v,U,k,W,A,pe),G.transparent===!0&&G.side===Kt&&G.forceSinglePass===!1?(G.side=Lt,G.needsUpdate=!0,v.renderBufferDirect(k,U,W,G,A,pe),G.side=An,G.needsUpdate=!0,v.renderBufferDirect(k,U,W,G,A,pe),G.side=Kt):v.renderBufferDirect(k,U,W,G,A,pe),A.onAfterRender(v,U,k,W,G,pe)}function ji(A,U,k){U.isScene!==!0&&(U=be);const W=Fe.get(A),G=p.state.lights,pe=p.state.shadowsArray,ye=G.state.version,Ie=xe.getParameters(A,G.state,pe,U,k),Oe=xe.getProgramCacheKey(Ie);let Ye=W.programs;W.environment=A.isMeshStandardMaterial?U.environment:null,W.fog=U.fog,W.envMap=(A.isMeshStandardMaterial?z:S).get(A.envMap||W.environment),Ye===void 0&&(A.addEventListener("dispose",ue),Ye=new Map,W.programs=Ye);let Be=Ye.get(Oe);if(Be!==void 0){if(W.currentProgram===Be&&W.lightsStateVersion===ye)return ao(A,Ie),Be}else Ie.uniforms=xe.getUniforms(A),A.onBuild(k,Ie,v),A.onBeforeCompile(Ie,v),Be=xe.acquireProgram(Ie,Oe),Ye.set(Oe,Be),W.uniforms=Ie.uniforms;const Ge=W.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Ge.clippingPlanes=He.uniform),ao(A,Ie),W.needsLights=dc(A),W.lightsStateVersion=ye,W.needsLights&&(Ge.ambientLightColor.value=G.state.ambient,Ge.lightProbe.value=G.state.probe,Ge.directionalLights.value=G.state.directional,Ge.directionalLightShadows.value=G.state.directionalShadow,Ge.spotLights.value=G.state.spot,Ge.spotLightShadows.value=G.state.spotShadow,Ge.rectAreaLights.value=G.state.rectArea,Ge.ltc_1.value=G.state.rectAreaLTC1,Ge.ltc_2.value=G.state.rectAreaLTC2,Ge.pointLights.value=G.state.point,Ge.pointLightShadows.value=G.state.pointShadow,Ge.hemisphereLights.value=G.state.hemi,Ge.directionalShadowMap.value=G.state.directionalShadowMap,Ge.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Ge.spotShadowMap.value=G.state.spotShadowMap,Ge.spotLightMatrix.value=G.state.spotLightMatrix,Ge.spotLightMap.value=G.state.spotLightMap,Ge.pointShadowMap.value=G.state.pointShadowMap,Ge.pointShadowMatrix.value=G.state.pointShadowMatrix),W.currentProgram=Be,W.uniformsList=null,Be}function oo(A){if(A.uniformsList===null){const U=A.currentProgram.getUniforms();A.uniformsList=As.seqWithValue(U.seq,A.uniforms)}return A.uniformsList}function ao(A,U){const k=Fe.get(A);k.outputColorSpace=U.outputColorSpace,k.batching=U.batching,k.instancing=U.instancing,k.instancingColor=U.instancingColor,k.skinning=U.skinning,k.morphTargets=U.morphTargets,k.morphNormals=U.morphNormals,k.morphColors=U.morphColors,k.morphTargetsCount=U.morphTargetsCount,k.numClippingPlanes=U.numClippingPlanes,k.numIntersection=U.numClipIntersection,k.vertexAlphas=U.vertexAlphas,k.vertexTangents=U.vertexTangents,k.toneMapping=U.toneMapping}function hc(A,U,k,W,G){U.isScene!==!0&&(U=be),R.resetTextureUnits();const pe=U.fog,ye=W.isMeshStandardMaterial?U.environment:null,Ie=b===null?v.outputColorSpace:b.isXRRenderTarget===!0?b.texture.colorSpace:fn,Oe=(W.isMeshStandardMaterial?z:S).get(W.envMap||ye),Ye=W.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,Be=!!k.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),Ge=!!k.morphAttributes.position,lt=!!k.morphAttributes.normal,It=!!k.morphAttributes.color;let mt=En;W.toneMapped&&(b===null||b.isXRRenderTarget===!0)&&(mt=v.toneMapping);const sn=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,it=sn!==void 0?sn.length:0,qe=Fe.get(W),ks=p.state.lights;if(Z===!0&&(ce===!0||A!==y)){const zt=A===y&&W.id===N;He.setState(W,A,zt)}let rt=!1;W.version===qe.__version?(qe.needsLights&&qe.lightsStateVersion!==ks.state.version||qe.outputColorSpace!==Ie||G.isBatchedMesh&&qe.batching===!1||!G.isBatchedMesh&&qe.batching===!0||G.isInstancedMesh&&qe.instancing===!1||!G.isInstancedMesh&&qe.instancing===!0||G.isSkinnedMesh&&qe.skinning===!1||!G.isSkinnedMesh&&qe.skinning===!0||G.isInstancedMesh&&qe.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&qe.instancingColor===!1&&G.instanceColor!==null||qe.envMap!==Oe||W.fog===!0&&qe.fog!==pe||qe.numClippingPlanes!==void 0&&(qe.numClippingPlanes!==He.numPlanes||qe.numIntersection!==He.numIntersection)||qe.vertexAlphas!==Ye||qe.vertexTangents!==Be||qe.morphTargets!==Ge||qe.morphNormals!==lt||qe.morphColors!==It||qe.toneMapping!==mt||Pe.isWebGL2===!0&&qe.morphTargetsCount!==it)&&(rt=!0):(rt=!0,qe.__version=W.version);let wn=qe.currentProgram;rt===!0&&(wn=ji(W,U,G));let lo=!1,Di=!1,Vs=!1;const Et=wn.getUniforms(),Rn=qe.uniforms;if(_e.useProgram(wn.program)&&(lo=!0,Di=!0,Vs=!0),W.id!==N&&(N=W.id,Di=!0),lo||y!==A){Et.setValue(H,"projectionMatrix",A.projectionMatrix),Et.setValue(H,"viewMatrix",A.matrixWorldInverse);const zt=Et.map.cameraPosition;zt!==void 0&&zt.setValue(H,Le.setFromMatrixPosition(A.matrixWorld)),Pe.logarithmicDepthBuffer&&Et.setValue(H,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&Et.setValue(H,"isOrthographic",A.isOrthographicCamera===!0),y!==A&&(y=A,Di=!0,Vs=!0)}if(G.isSkinnedMesh){Et.setOptional(H,G,"bindMatrix"),Et.setOptional(H,G,"bindMatrixInverse");const zt=G.skeleton;zt&&(Pe.floatVertexTextures?(zt.boneTexture===null&&zt.computeBoneTexture(),Et.setValue(H,"boneTexture",zt.boneTexture,R)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}G.isBatchedMesh&&(Et.setOptional(H,G,"batchingTexture"),Et.setValue(H,"batchingTexture",G._matricesTexture,R));const Ws=k.morphAttributes;if((Ws.position!==void 0||Ws.normal!==void 0||Ws.color!==void 0&&Pe.isWebGL2===!0)&&Xe.update(G,k,wn),(Di||qe.receiveShadow!==G.receiveShadow)&&(qe.receiveShadow=G.receiveShadow,Et.setValue(H,"receiveShadow",G.receiveShadow)),W.isMeshGouraudMaterial&&W.envMap!==null&&(Rn.envMap.value=Oe,Rn.flipEnvMap.value=Oe.isCubeTexture&&Oe.isRenderTargetTexture===!1?-1:1),Di&&(Et.setValue(H,"toneMappingExposure",v.toneMappingExposure),qe.needsLights&&uc(Rn,Vs),pe&&W.fog===!0&&de.refreshFogUniforms(Rn,pe),de.refreshMaterialUniforms(Rn,W,j,X,Me),As.upload(H,oo(qe),Rn,R)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(As.upload(H,oo(qe),Rn,R),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&Et.setValue(H,"center",G.center),Et.setValue(H,"modelViewMatrix",G.modelViewMatrix),Et.setValue(H,"normalMatrix",G.normalMatrix),Et.setValue(H,"modelMatrix",G.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){const zt=W.uniformsGroups;for(let Xs=0,fc=zt.length;Xs<fc;Xs++)if(Pe.isWebGL2){const co=zt[Xs];ie.update(co,wn),ie.bind(co,wn)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return wn}function uc(A,U){A.ambientLightColor.needsUpdate=U,A.lightProbe.needsUpdate=U,A.directionalLights.needsUpdate=U,A.directionalLightShadows.needsUpdate=U,A.pointLights.needsUpdate=U,A.pointLightShadows.needsUpdate=U,A.spotLights.needsUpdate=U,A.spotLightShadows.needsUpdate=U,A.rectAreaLights.needsUpdate=U,A.hemisphereLights.needsUpdate=U}function dc(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return E},this.getActiveMipmapLevel=function(){return T},this.getRenderTarget=function(){return b},this.setRenderTargetTextures=function(A,U,k){Fe.get(A.texture).__webglTexture=U,Fe.get(A.depthTexture).__webglTexture=k;const W=Fe.get(A);W.__hasExternalTextures=!0,W.__hasExternalTextures&&(W.__autoAllocateDepthBuffer=k===void 0,W.__autoAllocateDepthBuffer||Ee.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),W.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(A,U){const k=Fe.get(A);k.__webglFramebuffer=U,k.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(A,U=0,k=0){b=A,E=U,T=k;let W=!0,G=null,pe=!1,ye=!1;if(A){const Oe=Fe.get(A);Oe.__useDefaultFramebuffer!==void 0?(_e.bindFramebuffer(H.FRAMEBUFFER,null),W=!1):Oe.__webglFramebuffer===void 0?R.setupRenderTarget(A):Oe.__hasExternalTextures&&R.rebindTextures(A,Fe.get(A.texture).__webglTexture,Fe.get(A.depthTexture).__webglTexture);const Ye=A.texture;(Ye.isData3DTexture||Ye.isDataArrayTexture||Ye.isCompressedArrayTexture)&&(ye=!0);const Be=Fe.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(Be[U])?G=Be[U][k]:G=Be[U],pe=!0):Pe.isWebGL2&&A.samples>0&&R.useMultisampledRTT(A)===!1?G=Fe.get(A).__webglMultisampledFramebuffer:Array.isArray(Be)?G=Be[k]:G=Be,w.copy(A.viewport),O.copy(A.scissor),F=A.scissorTest}else w.copy($).multiplyScalar(j).floor(),O.copy(se).multiplyScalar(j).floor(),F=oe;if(_e.bindFramebuffer(H.FRAMEBUFFER,G)&&Pe.drawBuffers&&W&&_e.drawBuffers(A,G),_e.viewport(w),_e.scissor(O),_e.setScissorTest(F),pe){const Oe=Fe.get(A.texture);H.framebufferTexture2D(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_CUBE_MAP_POSITIVE_X+U,Oe.__webglTexture,k)}else if(ye){const Oe=Fe.get(A.texture),Ye=U||0;H.framebufferTextureLayer(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0,Oe.__webglTexture,k||0,Ye)}N=-1},this.readRenderTargetPixels=function(A,U,k,W,G,pe,ye){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ie=Fe.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&ye!==void 0&&(Ie=Ie[ye]),Ie){_e.bindFramebuffer(H.FRAMEBUFFER,Ie);try{const Oe=A.texture,Ye=Oe.format,Be=Oe.type;if(Ye!==Zt&&fe.convert(Ye)!==H.getParameter(H.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Ge=Be===Vi&&(Ee.has("EXT_color_buffer_half_float")||Pe.isWebGL2&&Ee.has("EXT_color_buffer_float"));if(Be!==Tn&&fe.convert(Be)!==H.getParameter(H.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Be===Sn&&(Pe.isWebGL2||Ee.has("OES_texture_float")||Ee.has("WEBGL_color_buffer_float")))&&!Ge){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=A.width-W&&k>=0&&k<=A.height-G&&H.readPixels(U,k,W,G,fe.convert(Ye),fe.convert(Be),pe)}finally{const Oe=b!==null?Fe.get(b).__webglFramebuffer:null;_e.bindFramebuffer(H.FRAMEBUFFER,Oe)}}},this.copyFramebufferToTexture=function(A,U,k=0){const W=Math.pow(2,-k),G=Math.floor(U.image.width*W),pe=Math.floor(U.image.height*W);R.setTexture2D(U,0),H.copyTexSubImage2D(H.TEXTURE_2D,k,0,0,A.x,A.y,G,pe),_e.unbindTexture()},this.copyTextureToTexture=function(A,U,k,W=0){const G=U.image.width,pe=U.image.height,ye=fe.convert(k.format),Ie=fe.convert(k.type);R.setTexture2D(k,0),H.pixelStorei(H.UNPACK_FLIP_Y_WEBGL,k.flipY),H.pixelStorei(H.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),H.pixelStorei(H.UNPACK_ALIGNMENT,k.unpackAlignment),U.isDataTexture?H.texSubImage2D(H.TEXTURE_2D,W,A.x,A.y,G,pe,ye,Ie,U.image.data):U.isCompressedTexture?H.compressedTexSubImage2D(H.TEXTURE_2D,W,A.x,A.y,U.mipmaps[0].width,U.mipmaps[0].height,ye,U.mipmaps[0].data):H.texSubImage2D(H.TEXTURE_2D,W,A.x,A.y,ye,Ie,U.image),W===0&&k.generateMipmaps&&H.generateMipmap(H.TEXTURE_2D),_e.unbindTexture()},this.copyTextureToTexture3D=function(A,U,k,W,G=0){if(v.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const pe=A.max.x-A.min.x+1,ye=A.max.y-A.min.y+1,Ie=A.max.z-A.min.z+1,Oe=fe.convert(W.format),Ye=fe.convert(W.type);let Be;if(W.isData3DTexture)R.setTexture3D(W,0),Be=H.TEXTURE_3D;else if(W.isDataArrayTexture||W.isCompressedArrayTexture)R.setTexture2DArray(W,0),Be=H.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}H.pixelStorei(H.UNPACK_FLIP_Y_WEBGL,W.flipY),H.pixelStorei(H.UNPACK_PREMULTIPLY_ALPHA_WEBGL,W.premultiplyAlpha),H.pixelStorei(H.UNPACK_ALIGNMENT,W.unpackAlignment);const Ge=H.getParameter(H.UNPACK_ROW_LENGTH),lt=H.getParameter(H.UNPACK_IMAGE_HEIGHT),It=H.getParameter(H.UNPACK_SKIP_PIXELS),mt=H.getParameter(H.UNPACK_SKIP_ROWS),sn=H.getParameter(H.UNPACK_SKIP_IMAGES),it=k.isCompressedTexture?k.mipmaps[G]:k.image;H.pixelStorei(H.UNPACK_ROW_LENGTH,it.width),H.pixelStorei(H.UNPACK_IMAGE_HEIGHT,it.height),H.pixelStorei(H.UNPACK_SKIP_PIXELS,A.min.x),H.pixelStorei(H.UNPACK_SKIP_ROWS,A.min.y),H.pixelStorei(H.UNPACK_SKIP_IMAGES,A.min.z),k.isDataTexture||k.isData3DTexture?H.texSubImage3D(Be,G,U.x,U.y,U.z,pe,ye,Ie,Oe,Ye,it.data):k.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),H.compressedTexSubImage3D(Be,G,U.x,U.y,U.z,pe,ye,Ie,Oe,it.data)):H.texSubImage3D(Be,G,U.x,U.y,U.z,pe,ye,Ie,Oe,Ye,it),H.pixelStorei(H.UNPACK_ROW_LENGTH,Ge),H.pixelStorei(H.UNPACK_IMAGE_HEIGHT,lt),H.pixelStorei(H.UNPACK_SKIP_PIXELS,It),H.pixelStorei(H.UNPACK_SKIP_ROWS,mt),H.pixelStorei(H.UNPACK_SKIP_IMAGES,sn),G===0&&W.generateMipmaps&&H.generateMipmap(Be),_e.unbindTexture()},this.initTexture=function(A){A.isCubeTexture?R.setTextureCube(A,0):A.isData3DTexture?R.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?R.setTexture2DArray(A,0):R.setTexture2D(A,0),_e.unbindTexture()},this.resetState=function(){E=0,T=0,b=null,_e.reset(),C.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return un}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===Wr?"display-p3":"srgb",t.unpackColorSpace=tt.workingColorSpace===Ns?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===xt?Hn:wl}set outputEncoding(e){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=e===Hn?xt:fn}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(e){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=e}}class Tm extends jl{}Tm.prototype.isWebGL1Renderer=!0;class bm extends yt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t}}class pi extends Ci{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ze(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Ia=new I,Ua=new I,Na=new ut,yr=new Fs,Ms=new Os;class Kl extends yt{constructor(e=new Dt,t=new pi){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Ia.fromBufferAttribute(t,s-1),Ua.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Ia.distanceTo(Ua);e.setAttribute("lineDistance",new vt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ms.copy(n.boundingSphere),Ms.applyMatrix4(s),Ms.radius+=r,e.ray.intersectsSphere(Ms)===!1)return;Na.copy(s).invert(),yr.copy(e.ray).applyMatrix4(Na);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,u=new I,d=new I,f=new I,h=new I,m=this.isLineSegments?2:1,g=n.index,p=n.attributes.position;if(g!==null){const c=Math.max(0,a.start),x=Math.min(g.count,a.start+a.count);for(let v=c,M=x-1;v<M;v+=m){const E=g.getX(v),T=g.getX(v+1);if(u.fromBufferAttribute(p,E),d.fromBufferAttribute(p,T),yr.distanceSqToSegment(u,d,h,f)>l)continue;h.applyMatrix4(this.matrixWorld);const N=e.ray.origin.distanceTo(h);N<e.near||N>e.far||t.push({distance:N,point:f.clone().applyMatrix4(this.matrixWorld),index:v,face:null,faceIndex:null,object:this})}}else{const c=Math.max(0,a.start),x=Math.min(p.count,a.start+a.count);for(let v=c,M=x-1;v<M;v+=m){if(u.fromBufferAttribute(p,v),d.fromBufferAttribute(p,v+1),yr.distanceSqToSegment(u,d,h,f)>l)continue;h.applyMatrix4(this.matrixWorld);const T=e.ray.origin.distanceTo(h);T<e.near||T>e.far||t.push({distance:T,point:f.clone().applyMatrix4(this.matrixWorld),index:v,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}const Oa=new I,Fa=new I;class xs extends Kl{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)Oa.fromBufferAttribute(t,s),Fa.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Oa.distanceTo(Fa);e.setAttribute("lineDistance",new vt(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Hs extends Dt{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const u=this;s=Math.floor(s),r=Math.floor(r);const d=[],f=[],h=[],m=[];let g=0;const _=[],p=n/2;let c=0;x(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(d),this.setAttribute("position",new vt(f,3)),this.setAttribute("normal",new vt(h,3)),this.setAttribute("uv",new vt(m,2));function x(){const M=new I,E=new I;let T=0;const b=(t-e)/n;for(let N=0;N<=r;N++){const y=[],w=N/r,O=w*(t-e)+e;for(let F=0;F<=s;F++){const Y=F/s,D=Y*l+o,B=Math.sin(D),X=Math.cos(D);E.x=O*B,E.y=-w*n+p,E.z=O*X,f.push(E.x,E.y,E.z),M.set(B,b,X).normalize(),h.push(M.x,M.y,M.z),m.push(Y,1-w),y.push(g++)}_.push(y)}for(let N=0;N<s;N++)for(let y=0;y<r;y++){const w=_[y][N],O=_[y+1][N],F=_[y+1][N+1],Y=_[y][N+1];d.push(w,O,Y),d.push(O,F,Y),T+=6}u.addGroup(c,T,0),c+=T}function v(M){const E=g,T=new Ue,b=new I;let N=0;const y=M===!0?e:t,w=M===!0?1:-1;for(let F=1;F<=s;F++)f.push(0,p*w,0),h.push(0,w,0),m.push(.5,.5),g++;const O=g;for(let F=0;F<=s;F++){const D=F/s*l+o,B=Math.cos(D),X=Math.sin(D);b.x=y*X,b.y=p*w,b.z=y*B,f.push(b.x,b.y,b.z),h.push(0,w,0),T.x=B*.5+.5,T.y=X*.5*w+.5,m.push(T.x,T.y),g++}for(let F=0;F<s;F++){const Y=E+F,D=O+F;M===!0?d.push(D,D+1,Y):d.push(D+1,D,Y),N+=3}u.addGroup(c,N,M===!0?1:2),c+=N}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Hs(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class jr extends Hs{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new jr(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}const Ss=new I,ys=new I,Er=new I,Es=new kt;class Ba extends Dt{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){const s=Math.pow(10,4),r=Math.cos(Hi*t),a=e.getIndex(),o=e.getAttribute("position"),l=a?a.count:o.count,u=[0,0,0],d=["a","b","c"],f=new Array(3),h={},m=[];for(let g=0;g<l;g+=3){a?(u[0]=a.getX(g),u[1]=a.getX(g+1),u[2]=a.getX(g+2)):(u[0]=g,u[1]=g+1,u[2]=g+2);const{a:_,b:p,c}=Es;if(_.fromBufferAttribute(o,u[0]),p.fromBufferAttribute(o,u[1]),c.fromBufferAttribute(o,u[2]),Es.getNormal(Er),f[0]=`${Math.round(_.x*s)},${Math.round(_.y*s)},${Math.round(_.z*s)}`,f[1]=`${Math.round(p.x*s)},${Math.round(p.y*s)},${Math.round(p.z*s)}`,f[2]=`${Math.round(c.x*s)},${Math.round(c.y*s)},${Math.round(c.z*s)}`,!(f[0]===f[1]||f[1]===f[2]||f[2]===f[0]))for(let x=0;x<3;x++){const v=(x+1)%3,M=f[x],E=f[v],T=Es[d[x]],b=Es[d[v]],N=`${M}_${E}`,y=`${E}_${M}`;y in h&&h[y]?(Er.dot(h[y].normal)<=r&&(m.push(T.x,T.y,T.z),m.push(b.x,b.y,b.z)),h[y]=null):N in h||(h[N]={index0:u[x],index1:u[v],normal:Er.clone()})}}for(const g in h)if(h[g]){const{index0:_,index1:p}=h[g];Ss.fromBufferAttribute(o,_),ys.fromBufferAttribute(o,p),m.push(Ss.x,Ss.y,Ss.z),m.push(ys.x,ys.y,ys.z)}this.setAttribute("position",new vt(m,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class Is extends Dt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let u=0;const d=[],f=new I,h=new I,m=[],g=[],_=[],p=[];for(let c=0;c<=n;c++){const x=[],v=c/n;let M=0;c===0&&a===0?M=.5/t:c===n&&l===Math.PI&&(M=-.5/t);for(let E=0;E<=t;E++){const T=E/t;f.x=-e*Math.cos(s+T*r)*Math.sin(a+v*o),f.y=e*Math.cos(a+v*o),f.z=e*Math.sin(s+T*r)*Math.sin(a+v*o),g.push(f.x,f.y,f.z),h.copy(f).normalize(),_.push(h.x,h.y,h.z),p.push(T+M,1-v),x.push(u++)}d.push(x)}for(let c=0;c<n;c++)for(let x=0;x<t;x++){const v=d[c][x+1],M=d[c][x],E=d[c+1][x],T=d[c+1][x+1];(c!==0||a>0)&&m.push(v,M,T),(c!==n-1||l<Math.PI)&&m.push(M,E,T)}this.setIndex(m),this.setAttribute("position",new vt(g,3)),this.setAttribute("normal",new vt(_,3)),this.setAttribute("uv",new vt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Is(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Ts extends Ci{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Ze(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ze(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Rl,this.normalScale=new Ue(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=kr,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class $l extends yt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ze(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}}const Tr=new ut,za=new I,Ha=new I;class Am{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ue(512,512),this.map=null,this.mapPass=null,this.matrix=new ut,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Yr,this._frameExtents=new Ue(1,1),this._viewportCount=1,this._viewports=[new _t(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;za.setFromMatrixPosition(e.matrixWorld),t.position.copy(za),Ha.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Ha),t.updateMatrixWorld(),Tr.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Tr),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Tr)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class wm extends Am{constructor(){super(new Gl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Rm extends $l{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(yt.DEFAULT_UP),this.updateMatrix(),this.target=new yt,this.shadow=new wm}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Cm extends $l{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class Kr{constructor(e,t,n=0,s=1/0){this.ray=new Fs(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new Xr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}intersectObject(e,t=!0,n=[]){return zr(e,this,n,t),n.sort(Ga),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)zr(e[s],this,n,t);return n.sort(Ga),n}}function Ga(i,e){return i.distance-e.distance}function zr(i,e,t,n){if(i.layers.test(e.layers)&&i.raycast(e,t),n===!0){const s=i.children;for(let r=0,a=s.length;r<a;r++)zr(s[r],e,t,!0)}}class ka{constructor(e=1,t=0,n=0){return this.radius=e,this.phi=t,this.theta=n,this}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(Ct(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Gr}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Gr);const Va={type:"change"},br={type:"start"},Wa={type:"end"},bs=new Fs,Xa=new Mn,Pm=Math.cos(70*_h.DEG2RAD);class Lm extends qn{constructor(e,t){super(),this.object=e,this.domElement=t,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new I,this.cursor=new I,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Ot.ROTATE,MIDDLE:Ot.DOLLY,RIGHT:Ot.PAN},this.touches={ONE:$n.ROTATE,TWO:$n.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return o.phi},this.getAzimuthalAngle=function(){return o.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(C){C.addEventListener("keydown",Re),this._domElementKeyEvents=C},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",Re),this._domElementKeyEvents=null},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(Va),n.update(),r=s.NONE},this.update=function(){const C=new I,ie=new Xn().setFromUnitVectors(e.up,new I(0,1,0)),Se=ie.clone().invert(),me=new I,ee=new Xn,L=new I,re=2*Math.PI;return function(De=null){const we=n.object.position;C.copy(we).sub(n.target),C.applyQuaternion(ie),o.setFromVector3(C),n.autoRotate&&r===s.NONE&&F(w(De)),n.enableDamping?(o.theta+=l.theta*n.dampingFactor,o.phi+=l.phi*n.dampingFactor):(o.theta+=l.theta,o.phi+=l.phi);let Ke=n.minAzimuthAngle,$e=n.maxAzimuthAngle;isFinite(Ke)&&isFinite($e)&&(Ke<-Math.PI?Ke+=re:Ke>Math.PI&&(Ke-=re),$e<-Math.PI?$e+=re:$e>Math.PI&&($e-=re),Ke<=$e?o.theta=Math.max(Ke,Math.min($e,o.theta)):o.theta=o.theta>(Ke+$e)/2?Math.max(Ke,o.theta):Math.min($e,o.theta)),o.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,o.phi)),o.makeSafe(),n.enableDamping===!0?n.target.addScaledVector(d,n.dampingFactor):n.target.add(d),n.target.sub(n.cursor),n.target.clampLength(n.minTargetRadius,n.maxTargetRadius),n.target.add(n.cursor),n.zoomToCursor&&T||n.object.isOrthographicCamera?o.radius=$(o.radius):o.radius=$(o.radius*u),C.setFromSpherical(o),C.applyQuaternion(Se),we.copy(n.target).add(C),n.object.lookAt(n.target),n.enableDamping===!0?(l.theta*=1-n.dampingFactor,l.phi*=1-n.dampingFactor,d.multiplyScalar(1-n.dampingFactor)):(l.set(0,0,0),d.set(0,0,0));let st=!1;if(n.zoomToCursor&&T){let at=null;if(n.object.isPerspectiveCamera){const Je=C.length();at=$(Je*u);const ct=Je-at;n.object.position.addScaledVector(M,ct),n.object.updateMatrixWorld()}else if(n.object.isOrthographicCamera){const Je=new I(E.x,E.y,0);Je.unproject(n.object),n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/u)),n.object.updateProjectionMatrix(),st=!0;const ct=new I(E.x,E.y,0);ct.unproject(n.object),n.object.position.sub(ct).add(Je),n.object.updateMatrixWorld(),at=C.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;at!==null&&(this.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(at).add(n.object.position):(bs.origin.copy(n.object.position),bs.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(bs.direction))<Pm?e.lookAt(n.target):(Xa.setFromNormalAndCoplanarPoint(n.object.up,n.target),bs.intersectPlane(Xa,n.target))))}else n.object.isOrthographicCamera&&(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/u)),n.object.updateProjectionMatrix(),st=!0);return u=1,T=!1,st||me.distanceToSquared(n.object.position)>a||8*(1-ee.dot(n.object.quaternion))>a||L.distanceToSquared(n.target)>0?(n.dispatchEvent(Va),me.copy(n.object.position),ee.copy(n.object.quaternion),L.copy(n.target),!0):!1}}(),this.dispose=function(){n.domElement.removeEventListener("contextmenu",Qe),n.domElement.removeEventListener("pointerdown",R),n.domElement.removeEventListener("pointercancel",z),n.domElement.removeEventListener("wheel",ne),n.domElement.removeEventListener("pointermove",S),n.domElement.removeEventListener("pointerup",z),n._domElementKeyEvents!==null&&(n._domElementKeyEvents.removeEventListener("keydown",Re),n._domElementKeyEvents=null)};const n=this,s={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let r=s.NONE;const a=1e-6,o=new ka,l=new ka;let u=1;const d=new I,f=new Ue,h=new Ue,m=new Ue,g=new Ue,_=new Ue,p=new Ue,c=new Ue,x=new Ue,v=new Ue,M=new I,E=new Ue;let T=!1;const b=[],N={};let y=!1;function w(C){return C!==null?2*Math.PI/60*n.autoRotateSpeed*C:2*Math.PI/60/60*n.autoRotateSpeed}function O(C){const ie=Math.abs(C*.01);return Math.pow(.95,n.zoomSpeed*ie)}function F(C){l.theta-=C}function Y(C){l.phi-=C}const D=function(){const C=new I;return function(Se,me){C.setFromMatrixColumn(me,0),C.multiplyScalar(-Se),d.add(C)}}(),B=function(){const C=new I;return function(Se,me){n.screenSpacePanning===!0?C.setFromMatrixColumn(me,1):(C.setFromMatrixColumn(me,0),C.crossVectors(n.object.up,C)),C.multiplyScalar(Se),d.add(C)}}(),X=function(){const C=new I;return function(Se,me){const ee=n.domElement;if(n.object.isPerspectiveCamera){const L=n.object.position;C.copy(L).sub(n.target);let re=C.length();re*=Math.tan(n.object.fov/2*Math.PI/180),D(2*Se*re/ee.clientHeight,n.object.matrix),B(2*me*re/ee.clientHeight,n.object.matrix)}else n.object.isOrthographicCamera?(D(Se*(n.object.right-n.object.left)/n.object.zoom/ee.clientWidth,n.object.matrix),B(me*(n.object.top-n.object.bottom)/n.object.zoom/ee.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}}();function j(C){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?u/=C:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function q(C){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?u*=C:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function K(C,ie){if(!n.zoomToCursor)return;T=!0;const Se=n.domElement.getBoundingClientRect(),me=C-Se.left,ee=ie-Se.top,L=Se.width,re=Se.height;E.x=me/L*2-1,E.y=-(ee/re)*2+1,M.set(E.x,E.y,1).unproject(n.object).sub(n.object.position).normalize()}function $(C){return Math.max(n.minDistance,Math.min(n.maxDistance,C))}function se(C){f.set(C.clientX,C.clientY)}function oe(C){K(C.clientX,C.clientX),c.set(C.clientX,C.clientY)}function V(C){g.set(C.clientX,C.clientY)}function Z(C){h.set(C.clientX,C.clientY),m.subVectors(h,f).multiplyScalar(n.rotateSpeed);const ie=n.domElement;F(2*Math.PI*m.x/ie.clientHeight),Y(2*Math.PI*m.y/ie.clientHeight),f.copy(h),n.update()}function ce(C){x.set(C.clientX,C.clientY),v.subVectors(x,c),v.y>0?j(O(v.y)):v.y<0&&q(O(v.y)),c.copy(x),n.update()}function Me(C){_.set(C.clientX,C.clientY),p.subVectors(_,g).multiplyScalar(n.panSpeed),X(p.x,p.y),g.copy(_),n.update()}function ve(C){K(C.clientX,C.clientY),C.deltaY<0?q(O(C.deltaY)):C.deltaY>0&&j(O(C.deltaY)),n.update()}function Ce(C){let ie=!1;switch(C.code){case n.keys.UP:C.ctrlKey||C.metaKey||C.shiftKey?Y(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):X(0,n.keyPanSpeed),ie=!0;break;case n.keys.BOTTOM:C.ctrlKey||C.metaKey||C.shiftKey?Y(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):X(0,-n.keyPanSpeed),ie=!0;break;case n.keys.LEFT:C.ctrlKey||C.metaKey||C.shiftKey?F(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):X(n.keyPanSpeed,0),ie=!0;break;case n.keys.RIGHT:C.ctrlKey||C.metaKey||C.shiftKey?F(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):X(-n.keyPanSpeed,0),ie=!0;break}ie&&(C.preventDefault(),n.update())}function Le(C){if(b.length===1)f.set(C.pageX,C.pageY);else{const ie=fe(C),Se=.5*(C.pageX+ie.x),me=.5*(C.pageY+ie.y);f.set(Se,me)}}function be(C){if(b.length===1)g.set(C.pageX,C.pageY);else{const ie=fe(C),Se=.5*(C.pageX+ie.x),me=.5*(C.pageY+ie.y);g.set(Se,me)}}function Ve(C){const ie=fe(C),Se=C.pageX-ie.x,me=C.pageY-ie.y,ee=Math.sqrt(Se*Se+me*me);c.set(0,ee)}function H(C){n.enableZoom&&Ve(C),n.enablePan&&be(C)}function dt(C){n.enableZoom&&Ve(C),n.enableRotate&&Le(C)}function Ee(C){if(b.length==1)h.set(C.pageX,C.pageY);else{const Se=fe(C),me=.5*(C.pageX+Se.x),ee=.5*(C.pageY+Se.y);h.set(me,ee)}m.subVectors(h,f).multiplyScalar(n.rotateSpeed);const ie=n.domElement;F(2*Math.PI*m.x/ie.clientHeight),Y(2*Math.PI*m.y/ie.clientHeight),f.copy(h)}function Pe(C){if(b.length===1)_.set(C.pageX,C.pageY);else{const ie=fe(C),Se=.5*(C.pageX+ie.x),me=.5*(C.pageY+ie.y);_.set(Se,me)}p.subVectors(_,g).multiplyScalar(n.panSpeed),X(p.x,p.y),g.copy(_)}function _e(C){const ie=fe(C),Se=C.pageX-ie.x,me=C.pageY-ie.y,ee=Math.sqrt(Se*Se+me*me);x.set(0,ee),v.set(0,Math.pow(x.y/c.y,n.zoomSpeed)),j(v.y),c.copy(x);const L=(C.pageX+ie.x)*.5,re=(C.pageY+ie.y)*.5;K(L,re)}function et(C){n.enableZoom&&_e(C),n.enablePan&&Pe(C)}function Fe(C){n.enableZoom&&_e(C),n.enableRotate&&Ee(C)}function R(C){n.enabled!==!1&&(b.length===0&&(n.domElement.setPointerCapture(C.pointerId),n.domElement.addEventListener("pointermove",S),n.domElement.addEventListener("pointerup",z)),Xe(C),C.pointerType==="touch"?He(C):te(C))}function S(C){n.enabled!==!1&&(C.pointerType==="touch"?J(C):Q(C))}function z(C){Ne(C),b.length===0&&(n.domElement.releasePointerCapture(C.pointerId),n.domElement.removeEventListener("pointermove",S),n.domElement.removeEventListener("pointerup",z)),n.dispatchEvent(Wa),r=s.NONE}function te(C){let ie;switch(C.button){case 0:ie=n.mouseButtons.LEFT;break;case 1:ie=n.mouseButtons.MIDDLE;break;case 2:ie=n.mouseButtons.RIGHT;break;default:ie=-1}switch(ie){case Ot.DOLLY:if(n.enableZoom===!1)return;oe(C),r=s.DOLLY;break;case Ot.ROTATE:if(C.ctrlKey||C.metaKey||C.shiftKey){if(n.enablePan===!1)return;V(C),r=s.PAN}else{if(n.enableRotate===!1)return;se(C),r=s.ROTATE}break;case Ot.PAN:if(C.ctrlKey||C.metaKey||C.shiftKey){if(n.enableRotate===!1)return;se(C),r=s.ROTATE}else{if(n.enablePan===!1)return;V(C),r=s.PAN}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(br)}function Q(C){switch(r){case s.ROTATE:if(n.enableRotate===!1)return;Z(C);break;case s.DOLLY:if(n.enableZoom===!1)return;ce(C);break;case s.PAN:if(n.enablePan===!1)return;Me(C);break}}function ne(C){n.enabled===!1||n.enableZoom===!1||r!==s.NONE||(C.preventDefault(),n.dispatchEvent(br),ve(xe(C)),n.dispatchEvent(Wa))}function xe(C){const ie=C.deltaMode,Se={clientX:C.clientX,clientY:C.clientY,deltaY:C.deltaY};switch(ie){case 1:Se.deltaY*=16;break;case 2:Se.deltaY*=100;break}return C.ctrlKey&&!y&&(Se.deltaY*=10),Se}function de(C){C.key==="Control"&&(y=!0,document.addEventListener("keyup",ge,{passive:!0,capture:!0}))}function ge(C){C.key==="Control"&&(y=!1,document.removeEventListener("keyup",ge,{passive:!0,capture:!0}))}function Re(C){n.enabled===!1||n.enablePan===!1||Ce(C)}function He(C){switch(Te(C),b.length){case 1:switch(n.touches.ONE){case $n.ROTATE:if(n.enableRotate===!1)return;Le(C),r=s.TOUCH_ROTATE;break;case $n.PAN:if(n.enablePan===!1)return;be(C),r=s.TOUCH_PAN;break;default:r=s.NONE}break;case 2:switch(n.touches.TWO){case $n.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;H(C),r=s.TOUCH_DOLLY_PAN;break;case $n.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;dt(C),r=s.TOUCH_DOLLY_ROTATE;break;default:r=s.NONE}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(br)}function J(C){switch(Te(C),r){case s.TOUCH_ROTATE:if(n.enableRotate===!1)return;Ee(C),n.update();break;case s.TOUCH_PAN:if(n.enablePan===!1)return;Pe(C),n.update();break;case s.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;et(C),n.update();break;case s.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;Fe(C),n.update();break;default:r=s.NONE}}function Qe(C){n.enabled!==!1&&C.preventDefault()}function Xe(C){b.push(C.pointerId)}function Ne(C){delete N[C.pointerId];for(let ie=0;ie<b.length;ie++)if(b[ie]==C.pointerId){b.splice(ie,1);return}}function Te(C){let ie=N[C.pointerId];ie===void 0&&(ie=new Ue,N[C.pointerId]=ie),ie.set(C.pageX,C.pageY)}function fe(C){const ie=C.pointerId===b[0]?b[1]:b[0];return N[ie]}n.domElement.addEventListener("contextmenu",Qe),n.domElement.addEventListener("pointerdown",R),n.domElement.addEventListener("pointercancel",z),n.domElement.addEventListener("wheel",ne,{passive:!1}),document.addEventListener("keydown",de,{passive:!0,capture:!0}),this.update()}}const Zl={tavern:{id:"tavern",width:2,height:1,name:"Tavern",color:14251782},shipwright:{id:"shipwright",width:2,height:1,name:"Shipwright",color:6583435},market:{id:"market",width:2,height:1,name:"Market",color:1483594},lighthouse:{id:"lighthouse",width:1,height:1,name:"Lighthouse",color:16498468},warehouse:{id:"warehouse",width:2,height:2,name:"Warehouse",color:7893356},fort:{id:"fort",width:3,height:2,name:"Fort",color:7041664},docks:{id:"docks",width:3,height:1,name:"Docks",color:959977,allowOverWater:!0},dragon_sanctuary:{id:"dragon_sanctuary",width:3,height:3,name:"Dragon Sanctuary",color:8141549},castle:{id:"castle",width:3,height:3,name:"Castle",color:3621201,description:"Store cargo, gold/pieces-of-eight for crew wages, receive tax from buildings and player trading"},blacksmith:{id:"blacksmith",width:2,height:1,name:"Blacksmith",color:11817737,description:"Craft and sell cannons, cannonballs, and swords"}};function Ft(i){return Zl[i]??null}function Ar(i){const e=Ft(i);return!!(e&&e.allowOverWater)}let mi={};function Jl(i,e,t){e!=null||t!=null?(mi[i]=mi[i]||{},e!=null&&(mi[i].width=Math.max(1,Math.min(5,e))),t!=null&&(mi[i].height=Math.max(1,Math.min(5,t)))):delete mi[i]}function Fn(i){const e=Ft(i),t=e?{width:e.width,height:e.height}:{width:1,height:1},n=mi[i];return n?{width:n.width??t.width,height:n.height??t.height}:t}function en(i){return i&&i.width!=null&&i.height!=null?{width:i.width,height:i.height}:Fn((i==null?void 0:i.type)??"")}const Ql={berry_bush_01:{id:"berry_bush_01",name:"Berry Bush",color:2278750,fbxPath:"/props/BerryBush_01/BerryBush_01.fbx",placeholderShape:"sphere"},oak_tree_01:{id:"oak_tree_01",name:"Oak Tree",color:1409085,fbxPath:"/props/OakTree_01/OakTree_01.fbx",placeholderShape:"cone"},palm_tree_01:{id:"palm_tree_01",name:"Palm Tree 1",color:1483594,fbxPath:"/props/PalmTree_01/PalmTree_01.fbx",placeholderShape:"cylinder"},palm_tree_02:{id:"palm_tree_02",name:"Palm Tree 2",color:1409085,fbxPath:"/props/PalmTree_02/PalmTree_02.fbx",placeholderShape:"cylinder"},rock_01:{id:"rock_01",name:"Rock",color:7041664,fbxPath:"/props/Rock_01/Rock_01.fbx",placeholderShape:"sphere"},rock_06:{id:"rock_06",name:"Brimstone Rock",color:8330525,fbxPath:"/props/Rock_06/Rock_06.fbx",placeholderShape:"sphere"},sign:{id:"sign",name:"Sign",color:7893356,placeholderShape:"box"}};function yi(i){return Ql[i]??null}const Dm=9139029;function Im(i){const e=en(i),t=e.width,n=e.height;return{tx:Math.floor(i.chunkX+t/2),ty:Math.floor(i.chunkY+n/2)}}function Ya(i,e,t,n,s,r,a,o){const l=s.length-1;function u(x,v){var N;if(x<0||x>=a||v<0||v>=o)return!1;const M=Math.floor(l/a),E=Math.min(l,Math.floor((x+.5)*M)),T=Math.min(l,Math.floor((v+.5)*M));return(((N=s[T])==null?void 0:N[E])??0)>r}const d=(x,v)=>`${x},${v}`,f=new Map,h=new Set,m=new Map,g=new Map,_=new Map,p=d(i,e);m.set(p,0),g.set(p,Math.abs(t-i)+Math.abs(n-e)),f.set(p,{tx:i,ty:e,f:g.get(p)});const c=[[0,1],[1,0],[0,-1],[-1,0],[1,1],[1,-1],[-1,-1],[-1,1]];for(;f.size>0;){let x=null,v=1/0;for(const[E,T]of f)T.f<v&&(v=T.f,x=E);if(x===null)break;const M=f.get(x);if(f.delete(x),h.add(x),M.tx===t&&M.ty===n){const E=[];let T=x;for(;T;){const[b,N]=T.split(",").map(Number);E.unshift({tx:b,ty:N}),T=_.get(T)}return E}for(const[E,T]of c){const b=M.tx+E,N=M.ty+T,y=d(b,N);if(h.has(y)||!u(b,N))continue;const w=E!==0&&T!==0?1.414:1,O=(m.get(x)??1/0)+w;if(O>=(m.get(y)??1/0))continue;_.set(y,x),m.set(y,O);const F=Math.abs(t-b)+Math.abs(n-N);g.set(y,O+F),f.set(y,{tx:b,ty:N,f:O+F})}}return null}function qa(i,e,t,n){if(!i||e<=1)return i;let s=new Set(i);const r=[[0,1],[1,0],[0,-1],[-1,0]];for(let a=0;a<e-1;a++){const o=new Set(s);for(const l of s){const[u,d]=l.split(",").map(Number);for(const[f,h]of r){const m=u+f,g=d+h;m>=0&&m<t&&g>=0&&g<n&&o.add(`${m},${g}`)}}s=o}return s}function Um(i,e,t){const n=new Set;if(!e||!i||i.length<2)return n;const s=e.length-1,r=(t==null?void 0:t.tileSize)??(t==null?void 0:t.chunkSize)??8,a=(t==null?void 0:t.tilesX)??Math.floor(s/r),o=(t==null?void 0:t.tilesY)??Math.floor(s/r),l=(t==null?void 0:t.seaLevel)??.12,u=Math.max(1,Math.min(5,parseInt(t==null?void 0:t.pathWidth,10)||1)),d=i.map(_=>Im(_)),f=d.length;for(const _ of d)n.add(`${_.tx},${_.ty}`);if(f<2)return qa(n,u,a,o);const h=[];for(let _=0;_<f;_++)for(let p=_+1;p<f;p++){const c=Ya(d[_].tx,d[_].ty,d[p].tx,d[p].ty,e,l,a,o);c&&c.length>0&&h.push({i:_,j:p,path:c,len:c.length})}const m=new Set([0]),g=[];for(;m.size<f;){let _=null;for(const p of h){const c=m.has(p.i),x=m.has(p.j);c!==x&&(_===null||p.len<_.len)&&(_=p)}if(_===null)break;g.push(_),m.add(_.i),m.add(_.j)}for(let _=1;_<f;_++){if(m.has(_))continue;const p=Ya(d[0].tx,d[0].ty,d[_].tx,d[_].ty,e,l,a,o);p&&(g.push({i:0,j:_,path:p,len:p.length}),m.add(_))}for(const _ of g)for(const{tx:p,ty:c}of _.path)n.add(`${p},${c}`);return qa(n,u,a,o)}function Nm(i,e,t){var a;if(!i||!e||e.size===0)return;const n=i.length-1,s=(t==null?void 0:t.tileSize)??(t==null?void 0:t.chunkSize)??8;(t==null?void 0:t.tilesX)??Math.floor(n/s),(t==null?void 0:t.tilesY)??Math.floor(n/s);const r=[];for(const o of e){const[l,u]=o.split(",").map(Number),d=Math.max(0,l*s),f=Math.max(0,u*s),h=Math.min(n,(l+1)*s),m=Math.min(n,(u+1)*s);let g=0,_=0;for(let p=f;p<=m;p++)for(let c=d;c<=h;c++)g+=((a=i[p])==null?void 0:a[c])??0,_++;if(_>0){const p=g/_;r.push({x0:d,y0:f,x1:h,y1:m,avg:p})}}for(const{x0:o,y0:l,x1:u,y1:d,avg:f}of r)for(let h=l;h<=d;h++)for(let m=o;m<=u;m++)i[h]&&(i[h][m]=f)}function jn(i,e,t){const n=e?e.map(r=>[...r]):null;if(!n)return{pathTiles:new Set,heightMap:n};const s=Um(i,n,t);return Nm(n,s,t),{pathTiles:s,heightMap:n}}const zi={water:3900150,beach:16708551,grass:4881497,rock:7041664,snow:15792639};function ja(i,e){if(i<=e)return zi.water;const t=(i-e)/(1.2-e);return t<.12?zi.beach:t<.4?zi.grass:t<.7?zi.rock:zi.snow}function Ka(i){return[(i>>16&255)/255,(i>>8&255)/255,(i&255)/255]}class Om{constructor(e){this.container=e,this.scene=null,this.camera=null,this.renderer=null,this.controls=null,this.islandMesh=null,this.waterMesh=null,this.hoverOverlayMesh=null,this.buildingMeshes=[],this.gridOverlayMesh=null,this.placementPreviewMesh=null,this.buildingHighlightMesh=null,this.propMeshes=[],this.propPlacementPreviewMesh=null,this.propHighlightMesh=null,this.rampPreviewMesh=null,this._inputMode="view",this._spaceHeld=!1,this.ambientLight=null,this.directionalLight=null,this.config={waterColor:2450411,wireframe:!1,showWater:!0,heightScale:1,useVertexColors:!0,seaLevel:.12,pathColor:Dm},this.pathTiles=new Set}init(){const e=this.container.clientWidth,t=this.container.clientHeight;this.scene=new bm,this.scene.background=new Ze(8900331),this.camera=new Vt(55,e/t,.1,1e3),this.camera.position.set(1.5,1.2,1.5),this.camera.lookAt(0,0,0),this.camera.layers.enable(1),this.renderer=new jl({antialias:!0}),this.renderer.setSize(e,t),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=vl,this.container.appendChild(this.renderer.domElement),this.controls=new Lm(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.05,this.controls.minDistance=.5,this.controls.maxDistance=8,this.ambientLight=new Cm(16777215,.55),this.scene.add(this.ambientLight),this.directionalLight=new Rm(16777215,.85),this.directionalLight.position.set(2,4,2),this.directionalLight.castShadow=!0,this.directionalLight.shadow.mapSize.width=1024,this.directionalLight.shadow.mapSize.height=1024,this.scene.add(this.directionalLight),window.addEventListener("resize",()=>this.onResize())}onResize(){const e=this.container.clientWidth,t=this.container.clientHeight;this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t)}render(e){var g;if(!(e!=null&&e.heightMap))return;this.hoverOverlayMesh&&(this.islandMesh&&this.islandMesh.remove(this.hoverOverlayMesh),this.hoverOverlayMesh.geometry.dispose(),this.hoverOverlayMesh.material.dispose(),this.hoverOverlayMesh=null),this._clearRampPreview(),this._clearContourOverlay(),this._clearBuildings(),this._clearGridOverlay(),this.islandMesh&&(this.scene.remove(this.islandMesh),this.islandMesh.geometry.dispose(),this.islandMesh.material.dispose()),this.waterMesh&&(this.scene.remove(this.waterMesh),this.waterMesh.geometry.dispose(),this.waterMesh.material.dispose());const{heightMap:t,config:n}=e;this.pathTiles=e.pathTiles?new Set(e.pathTiles):new Set;const s=(n==null?void 0:n.gridSize)??t.length-1,r=(n==null?void 0:n.seaLevel)??this.config.seaLevel;this.config.seaLevel=r;const a=(n==null?void 0:n.tileSize)??(n==null?void 0:n.chunkSize)??8;(n==null?void 0:n.tilesX)??Math.floor(s/a);const o=1,l=s,u=new On(o,o,l,l),d=u.attributes.position,f=d.count,h=new Float32Array(f*3);for(let _=0;_<f;_++){const p=Math.floor(_%(l+1)),c=Math.floor(_/(l+1)),x=((g=t[c])==null?void 0:g[p])??0;d.setZ(_,x*this.config.heightScale);const v=Math.floor(p/a),M=Math.floor(c/a),E=`${v},${M}`,T=this.pathTiles.has(E)?this.config.pathColor:ja(x,r),[b,N,y]=Ka(T);h[_*3]=b,h[_*3+1]=N,h[_*3+2]=y}u.setAttribute("color",new Qt(h,3)),u.computeVertexNormals();const m=new Ts({vertexColors:this.config.useVertexColors,flatShading:!1,wireframe:this.config.wireframe});if(this.islandMesh=new At(u,m),this.islandMesh.rotation.x=-Math.PI/2,this.islandMesh.receiveShadow=!0,this.islandMesh.castShadow=!0,this.scene.add(this.islandMesh),this.config.showWater){const _=new On(o*1.5,o*1.5,1,1),p=new Ts({color:this.config.waterColor,transparent:!0,opacity:.75});this.waterMesh=new At(_,p),this.waterMesh.rotation.x=-Math.PI/2,this.waterMesh.position.y=-.02,this.scene.add(this.waterMesh)}}setHoverOverlay(e,t){var v,M;if(this.hoverOverlayMesh&&((v=this.islandMesh)==null||v.remove(this.hoverOverlayMesh),this.hoverOverlayMesh.geometry.dispose(),this.hoverOverlayMesh.material.dispose(),this.hoverOverlayMesh=null),!e||!t||!this.islandMesh)return;const{x0:n,y0:s,x1:r,y1:a}=e,o=t.length-1,l=Math.max(1,r-n),u=Math.max(1,a-s),d=Math.min(l,o),f=Math.min(u,o),h=(r-n)/o,m=(a-s)/o,g=new On(h,m,d,f),_=g.attributes.position;for(let E=0;E<_.count;E++){const T=Math.min(o,n+E%(d+1)),b=Math.min(o,s+Math.floor(E/(d+1))),N=((M=t[b])==null?void 0:M[T])??0;_.setZ(E,N*this.config.heightScale+.012)}g.computeVertexNormals();const p=new gi({color:16707722,transparent:!0,opacity:.5,depthTest:!0,depthWrite:!1});this.hoverOverlayMesh=new At(g,p),this.hoverOverlayMesh.layers.set(1);const c=(n+r)/(2*o)-.5,x=.5-(s+a)/(2*o);this.hoverOverlayMesh.position.set(c,x,0),this.islandMesh.add(this.hoverOverlayMesh)}_clearBuildings(){var e,t;for(const n of this.buildingMeshes)n.parent&&n.parent.remove(n),(e=n.geometry)==null||e.dispose(),(t=n.material)==null||t.dispose();this.buildingMeshes=[]}_clearGridOverlay(){this.gridOverlayMesh&&(this.gridOverlayMesh.parent&&this.gridOverlayMesh.parent.remove(this.gridOverlayMesh),this.gridOverlayMesh.geometry.dispose(),this.gridOverlayMesh.material.dispose(),this.gridOverlayMesh=null)}_clearPlacementPreview(){var e,t;this.placementPreviewMesh&&this.islandMesh&&(this.islandMesh.remove(this.placementPreviewMesh),(e=this.placementPreviewMesh.geometry)==null||e.dispose(),(t=this.placementPreviewMesh.material)==null||t.dispose(),this.placementPreviewMesh=null)}_clearBuildingHighlight(){var e,t;this.buildingHighlightMesh&&this.islandMesh&&(this.islandMesh.remove(this.buildingHighlightMesh),(e=this.buildingHighlightMesh.geometry)==null||e.dispose(),(t=this.buildingHighlightMesh.material)==null||t.dispose(),this.buildingHighlightMesh=null)}_clearRampPreview(){var e,t;this.rampPreviewMesh&&this.islandMesh&&(this.islandMesh.remove(this.rampPreviewMesh),(e=this.rampPreviewMesh.geometry)==null||e.dispose(),(t=this.rampPreviewMesh.material)==null||t.dispose(),this.rampPreviewMesh=null)}setRampPreview(e,t,n){if(this._clearRampPreview(),!e||!t||!this.islandMesh||n<=0)return;const s=1/n,r=e.gx*s-.5,a=.5-e.gy*s,o=(e.h??0)*this.config.heightScale+.01,l=t.gx*s-.5,u=.5-t.gy*s,d=(t.h??0)*this.config.heightScale+.01,f=new Dt().setFromPoints([new I(r,a,o),new I(l,u,d)]),h=new pi({color:16498468,linewidth:2});this.rampPreviewMesh=new Kl(f,h),this.rampPreviewMesh.layers.set(1),this.islandMesh.add(this.rampPreviewMesh)}_clearContourOverlay(){var e,t;this.contourOverlayMesh&&this.islandMesh&&(this.islandMesh.remove(this.contourOverlayMesh),(e=this.contourOverlayMesh.geometry)==null||e.dispose(),(t=this.contourOverlayMesh.material)==null||t.dispose(),this.contourOverlayMesh=null)}setContourOverlay(e,t,n=.1){var d,f,h,m;if(this._clearContourOverlay(),!e||!t||!this.islandMesh||n<=0)return;const s=t.length-1;if(s<=0)return;const r=1/s,a=[],o=(g,_,p,c,x,v)=>{a.push(g,_,p,c,x,v)};for(let g=n;g<1;g+=n)for(let _=0;_<s;_++)for(let p=0;p<s;p++){const c=((d=t[_])==null?void 0:d[p])??0,x=((f=t[_])==null?void 0:f[p+1])??0,v=((h=t[_+1])==null?void 0:h[p])??0,M=((m=t[_+1])==null?void 0:m[p+1])??0,E=(b,N)=>b<=g&&g<=N||N<=g&&g<=b,T=[];if(E(c,x)){const b=(g-c)/(x-c||1e-9);T.push([(p+b)*r-.5,.5-_*r,g*this.config.heightScale+.005])}if(E(x,M)){const b=(g-x)/(M-x||1e-9);T.push([(p+1)*r-.5,.5-(_+b)*r,g*this.config.heightScale+.005])}if(E(M,v)){const b=(g-M)/(v-M||1e-9);T.push([(p+1-b)*r-.5,.5-(_+1)*r,g*this.config.heightScale+.005])}if(E(v,c)){const b=(g-v)/(c-v||1e-9);T.push([p*r-.5,.5-(_+1-b)*r,g*this.config.heightScale+.005])}T.length>=2&&o(T[0][0],T[0][1],T[0][2],T[1][0],T[1][1],T[1][2])}if(a.length<6)return;const l=new Dt;l.setAttribute("position",new vt(a,3)),l.setDrawRange(0,a.length/3);const u=new pi({color:959977,transparent:!0,opacity:.6});this.contourOverlayMesh=new xs(l,u),this.contourOverlayMesh.layers.set(1),this.islandMesh.add(this.contourOverlayMesh)}setPlacementPreview(e,t,n,s,r,a,o,l){var N;if(this._clearPlacementPreview(),e==null||t==null||!this.islandMesh||!r)return;const u=Ft(n);if(!u)return;const d=Fn(n),f=d.width,h=d.height,m=r.length-1,g=a||8,_=o??Math.floor(m/g),p=l??Math.floor(m/g),c=(e+f/2)/_-.5,x=.5-(t+h/2)/p,v=Math.min(m,Math.floor((e+f/2)*g)),M=Math.min(m,Math.floor((t+h/2)*g)),E=(((N=r[M])==null?void 0:N[v])??0)*this.config.heightScale+.02,T=f*g/m,b=h*g/m;if(s){const y=Math.max(E*.5,.08),w=new dn(T,b,y),O=new gi({color:u.color,transparent:!0,opacity:.6,depthTest:!0,depthWrite:!1,side:Kt});this.placementPreviewMesh=new At(w,O),this.placementPreviewMesh.position.set(c,x,E+y*.5+.015),this.placementPreviewMesh.layers.set(1),this.islandMesh.add(this.placementPreviewMesh)}else{const y=new On(T,b),w=new gi({color:15680580,transparent:!0,opacity:.5,depthTest:!0,depthWrite:!1,side:Kt});this.placementPreviewMesh=new At(y,w),this.placementPreviewMesh.position.set(c,x,E+.02),this.placementPreviewMesh.layers.set(1),this.islandMesh.add(this.placementPreviewMesh)}}setBuildingHighlight(e,t,n,s,r){var F;if(this._clearBuildingHighlight(),!e||!this.islandMesh||!t||!Ft(e.type))return;const o=en(e),l=o.width,u=o.height,d=t.length-1,f=n||8,h=s??Math.floor(d/f),m=r??Math.floor(d/f),g=e.chunkX??0,_=e.chunkY??0,p=(e.rotation??0)*(Math.PI/180),c=(g+l/2)/h-.5,x=.5-(_+u/2)/m,v=Math.min(d,Math.floor((g+l/2)*f)),M=Math.min(d,Math.floor((_+u/2)*f)),E=(((F=t[M])==null?void 0:F[v])??0)*this.config.heightScale+.02,T=l*f/d,b=u*f/d,N=Math.max(E*.5,.08),y=new dn(T,b,N+.02),w=new Ba(y);y.dispose();const O=new pi({color:16498468,linewidth:2});this.buildingHighlightMesh=new xs(w,O),this.buildingHighlightMesh.position.set(c,x,E+N*.5),this.buildingHighlightMesh.rotation.z=-p,this.buildingHighlightMesh.layers.set(1),this.islandMesh.add(this.buildingHighlightMesh)}clearPlacementPreview(){this._clearPlacementPreview()}clearBuildingHighlight(){this._clearBuildingHighlight()}_clearProps(){var e,t;for(const n of this.propMeshes)n.parent&&n.parent.remove(n),(e=n.geometry)==null||e.dispose(),(t=n.material)==null||t.dispose();this.propMeshes=[]}_clearPropPlacementPreview(){var e,t;this.propPlacementPreviewMesh&&this.islandMesh&&(this.islandMesh.remove(this.propPlacementPreviewMesh),(e=this.propPlacementPreviewMesh.geometry)==null||e.dispose(),(t=this.propPlacementPreviewMesh.material)==null||t.dispose(),this.propPlacementPreviewMesh=null)}_clearPropHighlight(){var e,t;this.propHighlightMesh&&this.islandMesh&&(this.islandMesh.remove(this.propHighlightMesh),(e=this.propHighlightMesh.geometry)==null||e.dispose(),(t=this.propHighlightMesh.material)==null||t.dispose(),this.propHighlightMesh=null)}_createPropPlaceholderGeometry(e,t=.08){switch(e){case"sphere":return new Is(t,8,6);case"cylinder":return new Hs(t*.4,t*.5,t*1.5,8);case"cone":return new jr(t*.6,t*1.2,8);case"box":return new dn(t*.4,t*1.2,t*.2);default:return new Is(t,8,6)}}renderProps(e,t,n,s,r){var d;if(this._clearProps(),!this.islandMesh||!t||!Array.isArray(e))return;const a=t.length-1,o=n||8,l=s??Math.floor(a/o),u=r??Math.floor(a/o);for(const f of e){const h=yi(f.type);if(!h)continue;const m=f.chunkX??0,g=f.chunkY??0,_=(f.rotation??0)*(Math.PI/180),p=(m+.5)/l-.5,c=.5-(g+.5)/u,x=Math.min(a,Math.floor((m+.5)*o)),v=Math.min(a,Math.floor((g+.5)*o)),M=(((d=t[v])==null?void 0:d[x])??0)*this.config.heightScale+.02,E=this._createPropPlaceholderGeometry(h.placeholderShape??"sphere"),T=new Ts({color:h.color}),b=new At(E,T);b.position.set(p,c,M+.04),b.rotation.z=-_,b.castShadow=!0,b.receiveShadow=!0,b.userData.prop=f,this.islandMesh.add(b),this.propMeshes.push(b)}}setPropPlacementPreview(e,t,n,s,r,a,o,l){var E;if(this._clearPropPlacementPreview(),e==null||t==null||!this.islandMesh||!r)return;const u=yi(n);if(!u)return;const d=r.length-1,f=a||8,h=o??Math.floor(d/f),m=l??Math.floor(d/f),g=(e+.5)/h-.5,_=.5-(t+.5)/m,p=Math.min(d,Math.floor((e+.5)*f)),c=Math.min(d,Math.floor((t+.5)*f)),x=(((E=r[c])==null?void 0:E[p])??0)*this.config.heightScale+.02,v=this._createPropPlaceholderGeometry(u.placeholderShape??"sphere"),M=new gi({color:s?u.color:15680580,transparent:!0,opacity:s?.6:.5,depthTest:!0,depthWrite:!1});this.propPlacementPreviewMesh=new At(v,M),this.propPlacementPreviewMesh.position.set(g,_,x+.04),this.propPlacementPreviewMesh.layers.set(1),this.islandMesh.add(this.propPlacementPreviewMesh)}setPropHighlight(e,t,n,s,r){var E;if(this._clearPropHighlight(),!e||!this.islandMesh||!t)return;const a=yi(e.type);if(!a)return;const o=t.length-1,l=n||8,u=s??Math.floor(o/l),d=r??Math.floor(o/l),f=e.chunkX??0,h=e.chunkY??0,m=(f+.5)/u-.5,g=.5-(h+.5)/d,_=Math.min(o,Math.floor((f+.5)*l)),p=Math.min(o,Math.floor((h+.5)*l)),c=(((E=t[p])==null?void 0:E[_])??0)*this.config.heightScale+.02,x=this._createPropPlaceholderGeometry(a.placeholderShape??"sphere"),v=new Ba(x);x.dispose();const M=new pi({color:16498468});this.propHighlightMesh=new xs(v,M),this.propHighlightMesh.position.set(m,g,c+.04),this.propHighlightMesh.layers.set(1),this.islandMesh.add(this.propHighlightMesh)}clearPropPlacementPreview(){this._clearPropPlacementPreview()}clearPropHighlight(){this._clearPropHighlight()}renderBuildings(e,t,n,s,r){var d;if(this._clearBuildings(),!this.islandMesh||!t||!Array.isArray(e))return;const a=t.length-1,o=n||8,l=s??Math.floor(a/o),u=r??Math.floor(a/o);for(const f of e){const h=Ft(f.type);if(!h)continue;const m=en(f),g=m.width,_=m.height,p=f.chunkX??0,c=f.chunkY??0,x=(f.rotation??0)*(Math.PI/180),v=(p+g/2)/l-.5,M=.5-(c+_/2)/u,E=Math.min(a,Math.floor((p+g/2)*o)),T=Math.min(a,Math.floor((c+_/2)*o)),b=(((d=t[T])==null?void 0:d[E])??0)*this.config.heightScale+.02,N=g*o/a,y=_*o/a,w=Math.max(b*.5,.08),O=new dn(N,y,w),F=new Ts({color:h.color}),Y=new At(O,F);Y.position.set(v,M,b+w*.5),Y.rotation.z=-x,Y.castShadow=!0,Y.receiveShadow=!0,this.islandMesh.add(Y),this.buildingMeshes.push(Y)}}setTileGridOverlay(e,t,n,s){if(this._clearGridOverlay(),!e||!this.islandMesh||t<=0||n<=0)return;const r=[];for(let l=0;l<=t;l++){const u=l/t-.5;r.push(u,-.5,.01,u,.5,.01)}for(let l=0;l<=n;l++){const u=l/n-.5;r.push(-.5,u,.01,.5,u,.01)}const a=new Dt;a.setAttribute("position",new vt(r,3)),a.setDrawRange(0,r.length/3);const o=new pi({color:959977,transparent:!0,opacity:.4});this.gridOverlayMesh=new xs(a,o),this.gridOverlayMesh.layers.set(1),this.islandMesh.add(this.gridOverlayMesh)}updateFromHeightMap(e,t,n){var u;if(!this.islandMesh||!e)return;t!=null&&(this.pathTiles=t instanceof Set?t:new Set(t));const s=this.islandMesh.geometry.attributes.position,r=this.islandMesh.geometry.attributes.color,a=Math.sqrt(s.count)-1,o=this.config.seaLevel,l=n??Math.max(1,Math.floor(a/16));for(let d=0;d<s.count;d++){const f=Math.floor(d%(a+1)),h=Math.floor(d/(a+1)),m=((u=e[h])==null?void 0:u[f])??0;s.setZ(d,m*this.config.heightScale);const g=Math.floor(f/l),_=Math.floor(h/l),p=`${g},${_}`,c=this.pathTiles.has(p)?this.config.pathColor:ja(m,o),[x,v,M]=Ka(c);r.setXYZ(d,x,v,M)}s.needsUpdate=!0,r.needsUpdate=!0,this.islandMesh.geometry.computeVertexNormals()}setConfig(e){Object.assign(this.config,e)}getMesh(){return this.islandMesh}getScene(){return this.scene}getCamera(){return this.camera}getRenderer(){return this.renderer}getControls(){return this.controls}setInputMode(e){this.controls&&(this._inputMode=e,this._spaceHeld=!1,this._removeSpaceListeners(),e==="edit"?(this._applyEditMouseButtons(),this._spaceKeyDown=t=>{var n,s;t.code==="Space"&&!t.repeat&&!((s=(n=document.activeElement)==null?void 0:n.closest)!=null&&s.call(n,"input, textarea, select"))&&(t.preventDefault(),this._spaceHeld=!0,this._applyEditMouseButtons())},this._spaceKeyUp=t=>{t.code==="Space"&&!t.repeat&&this._spaceHeld&&(t.preventDefault(),this._spaceHeld=!1,this._applyEditMouseButtons())},window.addEventListener("keydown",this._spaceKeyDown),window.addEventListener("keyup",this._spaceKeyUp)):(this.controls.mouseButtons.LEFT=Ot.ROTATE,this.controls.mouseButtons.MIDDLE=Ot.DOLLY,this.controls.mouseButtons.RIGHT=Ot.PAN))}_applyEditMouseButtons(){this.controls&&(this._spaceHeld?(this.controls.mouseButtons.LEFT=Ot.ROTATE,this.controls.mouseButtons.RIGHT=Ot.PAN):(this.controls.mouseButtons.LEFT=null,this.controls.mouseButtons.RIGHT=Ot.ROTATE),this.controls.mouseButtons.MIDDLE=Ot.DOLLY)}isSpaceHeld(){return this._spaceHeld===!0}_removeSpaceListeners(){this._spaceKeyDown&&(window.removeEventListener("keydown",this._spaceKeyDown),window.removeEventListener("keyup",this._spaceKeyUp),this._spaceKeyDown=null,this._spaceKeyUp=null)}animate(){var e,t;requestAnimationFrame(()=>this.animate()),(e=this.controls)==null||e.update(),(t=this.renderer)==null||t.render(this.scene,this.camera)}}const Fm={sea:.12,beach:.2,grass:.35,rock:.55,snow:.75};class Bm{constructor(e){this.visualizer=e,this.raycaster=new Kr,this.mouse=new Ue,this.isEditing=!1,this.brushMode="raise",this.brushSizeInTiles=1,this.brushStrength=.02,this.brushTargetHeight=.35,this.heightMap=null,this.gridSize=0,this.tileSize=8,this.tilesX=0,this.tilesY=0,this.seaLevel=.12,this._boundHandleMouse=this._handleMouse.bind(this),this.onHeightAtCursor=null,this.onBeforeBrush=null,this.onAfterBrush=null,this.onHoverTile=null,this.applyOnClickOnly=!1,this.canPaint=null,this.elevMin=0,this.elevMax=1,this.rampPointA=null,this.onRampPreview=null}setElevationClamp(e,t){this.elevMin=e!=null?Math.max(0,Math.min(1,e)):0,this.elevMax=t!=null?Math.max(0,Math.min(1,t)):1}setHeightMap(e){this.heightMap=e?e.map(t=>[...t]):null,this.gridSize=this.heightMap?this.heightMap.length-1:0}setTileConfig(e,t,n){this.tileSize=e||8,this.tilesX=t||Math.floor(this.gridSize/this.tileSize),this.tilesY=n||Math.floor(this.gridSize/this.tileSize)}getHeightMap(){return this.heightMap}setBrushSizeInTiles(e){this.brushSizeInTiles=Math.max(1,Math.min(5,e))}setBrushStrength(e){this.brushStrength=Math.max(.001,Math.min(.2,e))}setBrushMode(e){this.brushMode=e,e!=="ramp"&&(this.rampPointA=null)}setBrushTargetHeight(e){this.brushTargetHeight=Math.max(0,Math.min(1,e))}setSeaLevel(e){this.seaLevel=e}setApplyOnClickOnly(e){this.applyOnClickOnly=!!e}setCanPaint(e){this.canPaint=typeof e=="function"?e:null}enable(e){this.domElement=e,e.addEventListener("mousedown",this._boundHandleMouse),e.addEventListener("mousemove",this._boundHandleMouse),e.addEventListener("mouseup",this._boundHandleMouse),e.addEventListener("mouseleave",this._boundHandleMouse),this.isEditing=!0}disable(){this.domElement&&(this.domElement.removeEventListener("mousedown",this._boundHandleMouse),this.domElement.removeEventListener("mousemove",this._boundHandleMouse),this.domElement.removeEventListener("mouseup",this._boundHandleMouse),this.domElement.removeEventListener("mouseleave",this._boundHandleMouse)),this.isEditing=!1,this.onHeightAtCursor&&this.onHeightAtCursor(null),this.onHoverTile&&this.onHoverTile(null)}_handleMouse(e){if(!this.heightMap||!this.visualizer.getMesh())return;const t=this.domElement.getBoundingClientRect();if(this.mouse.x=(e.clientX-t.left)/t.width*2-1,this.mouse.y=-((e.clientY-t.top)/t.height)*2+1,e.type==="mouseup"||e.type==="mouseleave"){e.type==="mouseleave"&&(this.onHeightAtCursor&&this.onHeightAtCursor(null),this.onHoverTile&&this.onHoverTile(null),this.onRampPreview&&this.onRampPreview(null,null)),e.type==="mouseup"&&e.buttons===2&&this.brushMode==="ramp"&&(this.rampPointA=null,this.onRampPreview&&this.onRampPreview(null,null));return}if(e.type==="mousemove"){const n=this._getTileAtCursor(),s=n?this.heightMap[n.gy][n.gx]:null;if(this.onHeightAtCursor&&this.onHeightAtCursor(s,n),this.brushMode==="ramp"&&this.rampPointA&&n&&this.onRampPreview?this.onRampPreview(this.rampPointA,{gx:n.gx,gy:n.gy,h:s}):this.brushMode==="ramp"&&!this.rampPointA&&this.onRampPreview&&this.onRampPreview(null,null),this.onHoverTile&&n){const r=this.brushSizeInTiles,a=this.tileSize,o=Math.floor(r/2),l=Math.max(0,n.tx-o),u=Math.max(0,n.ty-o),d=Math.min(this.tilesX,n.tx-o+r),f=Math.min(this.tilesY,n.ty-o+r),h=l*a,m=u*a,g=Math.min(this.gridSize+1,d*a+1),_=Math.min(this.gridSize+1,f*a+1);this.onHoverTile({t0x:l,t0y:u,t1x:d,t1y:f,x0:h,y0:m,x1:g,y1:_})}else this.onHoverTile&&this.onHoverTile(null);this.brushMode!=="ramp"&&e.buttons===1&&!this.applyOnClickOnly&&(!this.canPaint||this.canPaint())&&this._applyBrush(!1);return}if(e.type==="mousedown"&&e.buttons===1&&(!this.canPaint||this.canPaint())){const n=this._getTileAtCursor();this.brushMode==="ramp"?this._handleRampClick(n):this._applyBrush(!0)}}_handleRampClick(e){if(!e||!this.heightMap)return;const t=this.heightMap[e.gy][e.gx];if(!this.rampPointA){this.rampPointA={gx:e.gx,gy:e.gy,h:t};return}const n=this.rampPointA,s={gx:e.gx,gy:e.gy,h:this.heightMap[e.gy][e.gx]};n.gx===s.gx&&n.gy===s.gy||(this.onBeforeBrush&&this.onBeforeBrush(),this._applyRamp(n,s),this.rampPointA=null,this.onRampPreview&&this.onRampPreview(null,null),this.visualizer.updateFromHeightMap(this.heightMap),this.onAfterBrush&&this.onAfterBrush())}_applyRamp(e,t){const n=Math.abs(t.gx-e.gx),s=Math.abs(t.gy-e.gy),r=Math.max(n,s,1);Math.sqrt((t.gx-e.gx)**2+(t.gy-e.gy)**2);for(let a=0;a<=r;a++){const o=a/r,l=Math.round(e.gx+(t.gx-e.gx)*o),u=Math.round(e.gy+(t.gy-e.gy)*o);if(l<0||l>this.gridSize||u<0||u>this.gridSize)continue;const d=e.h+(t.h-e.h)*o;let f=Math.max(0,Math.min(2,d));(this.elevMin>0||this.elevMax<1)&&(f=Math.max(this.elevMin>0?this.elevMin:0,Math.min(this.elevMax<1?this.elevMax:2,f))),this.heightMap[u][l]=f}}_getTileAtCursor(){const e=this.visualizer.getMesh();if(!e||!this.heightMap)return null;this.raycaster.setFromCamera(this.mouse,this.visualizer.getCamera()),this.raycaster.layers.set(0);const t=this.raycaster.intersectObject(e,!1);if(t.length===0)return null;const n=t[0];let s,r;if(n.uv)s=Math.max(0,Math.min(1,n.uv.x)),r=Math.max(0,Math.min(1,1-n.uv.y));else{const d=n.point.clone();e.worldToLocal(d),s=Math.max(0,Math.min(1,d.x+.5)),r=Math.max(0,Math.min(1,.5-d.y))}if(this.tilesX<=0||this.tilesY<=0)return null;const a=Math.min(this.tilesX-1,Math.max(0,Math.floor(s*this.tilesX))),o=Math.min(this.tilesY-1,Math.max(0,Math.floor(r*this.tilesY))),l=Math.min(this.gridSize,Math.max(0,Math.round(s*this.gridSize))),u=Math.min(this.gridSize,Math.max(0,Math.round(r*this.gridSize)));return{tx:a,ty:o,gx:l,gy:u}}_getHeightAtCursor(){const e=this._getTileAtCursor();return e?this.heightMap[e.gy][e.gx]:null}_applyBrush(e=!1){if(!this.visualizer.getMesh()||!this.heightMap)return;const n=this._getTileAtCursor();if(!n)return;const{tx:s,ty:r}=n,a=this.brushSizeInTiles,o=this.tileSize,l=Math.floor(a/2),u=Math.max(0,s-l),d=Math.max(0,r-l),f=Math.min(this.tilesX,s-l+a),h=Math.min(this.tilesY,r-l+a),m=u*o,g=d*o,_=Math.min(this.gridSize+1,f*o+1),p=Math.min(this.gridSize+1,h*o+1),c=this.brushMode==="plateau"?this.heightMap[n.gy][n.gx]:null;e&&this.onBeforeBrush&&this.onBeforeBrush();let x=!1;if(this.brushMode==="smooth"){const v=this.heightMap.map(M=>[...M]);for(let M=g;M<p;M++)for(let E=m;E<_;E++){if(M>this.gridSize||E>this.gridSize)continue;let T=0,b=0;for(let O=-1;O<=1;O++)for(let F=-1;F<=1;F++){const Y=E+F,D=M+O;Y>=0&&Y<=this.gridSize&&D>=0&&D<=this.gridSize&&(T+=this.heightMap[D][Y],b++)}const N=b>0?T/b:this.heightMap[M][E],y=this.brushStrength*5;let w=Math.max(0,Math.min(2,this.heightMap[M][E]+(N-this.heightMap[M][E])*y));(this.elevMin>0||this.elevMax<1)&&(w=Math.max(this.elevMin>0?this.elevMin:0,Math.min(this.elevMax<1?this.elevMax:2,w))),v[M][E]=w,x=!0}for(let M=g;M<p;M++)for(let E=m;E<_;E++)M<=this.gridSize&&E<=this.gridSize&&(this.heightMap[M][E]=v[M][E])}else for(let v=g;v<p;v++)for(let M=m;M<_;M++){if(v>this.gridSize||M>this.gridSize)continue;let E=this.heightMap[v][M];this.brushMode==="raise"?E=Math.min(2,E+this.brushStrength):this.brushMode==="lower"?E=Math.max(0,E-this.brushStrength):this.brushMode==="flatten"?E=E+(this.brushTargetHeight-E)*this.brushStrength*5:this.brushMode==="absolute"?(E=E+(this.brushTargetHeight-E)*this.brushStrength*10,E=Math.max(0,Math.min(2,E))):this.brushMode==="set"?E=this.brushTargetHeight:this.brushMode==="plateau"&&c!=null&&(E=E+(c-E)*this.brushStrength*8,E=Math.max(0,Math.min(2,E))),(this.elevMin>0||this.elevMax<1)&&(E=Math.max(this.elevMin>0?this.elevMin:0,Math.min(this.elevMax<1?this.elevMax:2,E))),this.heightMap[v][M]=E,x=!0}x&&(this.visualizer.updateFromHeightMap(this.heightMap),this.onAfterBrush&&this.onAfterBrush())}}class zm{constructor(e){this.visualizer=e,this.raycaster=new Kr,this.mouse=new Ue,this.buildings=[],this.heightMap=null,this.gridSize=0,this.tileSize=8,this.tilesX=0,this.tilesY=0,this.seaLevel=.12,this.selectedType="tavern",this.isPlacing=!1,this.domElement=null,this._boundHandleMouse=this._handleMouse.bind(this),this.onBuildingsChange=null,this.onHeightMapChange=null,this.onPlacementHover=null,this.onBuildingHover=null,this.onBuildingSelect=null,this._boundHandleMouseMove=this._handleMouseMove.bind(this)}setHeightMap(e){this.heightMap=e?e.map(t=>[...t]):null,this.gridSize=this.heightMap?this.heightMap.length-1:0}setTileConfig(e,t,n){this.tileSize=e||8,this.tilesX=t??Math.floor(this.gridSize/this.tileSize),this.tilesY=n??Math.floor(this.gridSize/this.tileSize)}setSeaLevel(e){this.seaLevel=e??.12}setBuildings(e,t={}){this.buildings=Array.isArray(e)?t.shared?e:e.map(n=>({...n})):[]}getBuildings(){return this.buildings.map(e=>({...e}))}setSelectedType(e){Zl[e]&&(this.selectedType=e)}enable(e,t={}){this.domElement=e,this._selectionOnly=!!t.selectionOnly,e.addEventListener("mousedown",this._boundHandleMouse),e.addEventListener("mousemove",this._boundHandleMouseMove),this.isPlacing=!this._selectionOnly}disable(){this.domElement&&(this.domElement.removeEventListener("mousedown",this._boundHandleMouse),this.domElement.removeEventListener("mousemove",this._boundHandleMouseMove)),this.isPlacing=!1,this._selectionOnly=!1,this.onPlacementHover&&this.onPlacementHover(null,null,!1),this.onBuildingHover&&this.onBuildingHover(null)}_updateMouseFromEvent(e){if(!this.domElement)return;const t=this.domElement.getBoundingClientRect();this.mouse.x=(e.clientX-t.left)/t.width*2-1,this.mouse.y=-((e.clientY-t.top)/t.height)*2+1}_handleMouseMove(e){if(!this.heightMap||!this.visualizer.getMesh()||!this.domElement)return;this._updateMouseFromEvent(e);const t=this._getTileAtCursor();if(!t){this.onPlacementHover&&this.onPlacementHover(null,null,!1),this.onBuildingHover&&this.onBuildingHover(null);return}const{tx:n,ty:s}=t,r=this._getBuildingAtTile(n,s);if(r)this.onPlacementHover&&this.onPlacementHover(null,null,!1),this.onBuildingHover&&this.onBuildingHover(r);else{if(this._selectionOnly)this.onPlacementHover&&this.onPlacementHover(null,null,!1);else{const a=this._canPlace(this.selectedType,n,s);this.onPlacementHover&&this.onPlacementHover(n,s,a)}this.onBuildingHover&&this.onBuildingHover(null)}}_getTileAtCursor(){const e=this.visualizer.getMesh();if(!e||!this.heightMap)return null;this.raycaster.setFromCamera(this.mouse,this.visualizer.getCamera()),this.raycaster.layers.set(0);const t=this.raycaster.intersectObject(e,!1);if(t.length===0)return null;const n=t[0];let s,r;if(n.uv)s=Math.max(0,Math.min(1,n.uv.x)),r=Math.max(0,Math.min(1,1-n.uv.y));else{const l=n.point.clone();e.worldToLocal(l),s=Math.max(0,Math.min(1,l.x+.5)),r=Math.max(0,Math.min(1,.5-l.y))}if(this.tilesX<=0||this.tilesY<=0)return null;const a=Math.min(this.tilesX-1,Math.max(0,Math.floor(s*this.tilesX))),o=Math.min(this.tilesY-1,Math.max(0,Math.floor(r*this.tilesY)));return{tx:a,ty:o}}_getBuildingAtTile(e,t){for(const n of this.buildings){const s=Fn(n.type),r=s.width,a=s.height;if(e>=n.chunkX&&e<n.chunkX+r&&t>=n.chunkY&&t<n.chunkY+a)return n}return null}flattenRegion(e,t,n,s,r){var c;if(!Ft(r)||!this.heightMap)return;const o=this.tileSize,l=this.heightMap.length-1,u=Math.max(0,e*o),d=Math.max(0,t*o),f=Math.min(l,(e+n)*o),h=Math.min(l,(t+s)*o);let m=0,g=0;for(let x=d;x<=h;x++)for(let v=u;v<=f;v++){const M=((c=this.heightMap[x])==null?void 0:c[v])??0;M>this.seaLevel&&(m+=M,g++)}const _=g>0?m/g:this.seaLevel+.02,p=this.seaLevel+.02;for(let x=d;x<=h;x++)for(let v=u;v<=f;v++){if(!this.heightMap[x])continue;const M=this.heightMap[x][v]??0;Ar(r)&&M<=this.seaLevel?this.heightMap[x][v]=p:this.heightMap[x][v]=_}this.onHeightMapChange&&this.onHeightMapChange(this.heightMap.map(x=>[...x]))}_flattenUnderBuilding(e,t,n){const s=Fn(e);this.flattenRegion(t,n,s.width,s.height,e)}canPlaceAtFootprint(e,t,n,s,r,a=null){var d;const o=Ar(r);if(!o&&(e+n>this.tilesX||t+s>this.tilesY||e<0||t<0))return!1;const l=this.tileSize;let u=0;for(let f=0;f<s;f++)for(let h=0;h<n;h++){const m=e+h,g=t+f;if(m<0||m>=this.tilesX||g<0||g>=this.tilesY)continue;const _=Math.min(this.gridSize,m*l),p=Math.min(this.gridSize,g*l);if((((d=this.heightMap[p])==null?void 0:d[_])??0)>this.seaLevel)u++;else if(!o)return!1}if(u===0||o&&(e+n<=0||t+s<=0||e>=this.tilesX||t>=this.tilesY))return!1;for(const f of this.buildings){if(a&&f.chunkX===a.chunkX&&f.chunkY===a.chunkY)continue;const h=en(f),m=f.chunkX+h.width,g=f.chunkY+h.height;if(e<m&&e+n>f.chunkX&&t<g&&t+s>f.chunkY)return!1}return!0}_canPlace(e,t,n){var f;if(!Ft(e))return!1;const r=Fn(e),a=r.width,o=r.height,l=Ar(e);if(!l&&(t+a>this.tilesX||n+o>this.tilesY||t<0||n<0))return!1;const u=this.tileSize;let d=0;for(let h=0;h<o;h++)for(let m=0;m<a;m++){const g=t+m,_=n+h;if(g<0||g>=this.tilesX||_<0||_>=this.tilesY)continue;const p=Math.min(this.gridSize,g*u),c=Math.min(this.gridSize,_*u);if((((f=this.heightMap[c])==null?void 0:f[p])??0)>this.seaLevel)d++;else if(!l)return!1}if(d===0||l&&(t+a<=0||n+o<=0||t>=this.tilesX||n>=this.tilesY))return!1;for(const h of this.buildings){const m=en(h),g=h.chunkX+m.width,_=h.chunkY+m.height;if(t<g&&t+a>h.chunkX&&n<_&&n+o>h.chunkY)return!1}return!0}_handleMouse(e){if(e.type!=="mousedown"||e.buttons!==1||!this.heightMap||!this.visualizer.getMesh()||!this.domElement)return;this._updateMouseFromEvent(e);const t=this._getTileAtCursor();if(!t)return;const{tx:n,ty:s}=t,r=this._getBuildingAtTile(n,s);if(r)if(e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation(),this._selectionOnly)this.onBuildingSelect&&this.onBuildingSelect(r);else if(e.shiftKey)this.buildings=this.buildings.filter(a=>a!==r);else{if(Ft(r.type)){const o=[0,90,180,270],l=o.indexOf(r.rotation??0);r.rotation=o[(l+1)%4]}this.onBuildingSelect&&this.onBuildingSelect(r)}else if(!this._selectionOnly&&Ft(this.selectedType)&&this._canPlace(this.selectedType,n,s)){this._flattenUnderBuilding(this.selectedType,n,s);const o=Fn(this.selectedType),l=o.width*o.height*10;this.buildings.push({id:"b"+Date.now(),type:this.selectedType,chunkX:n,chunkY:s,rotation:0,width:o.width,height:o.height,cargoSize:l})}this._selectionOnly||(this.visualizer.renderBuildings(this.buildings,this.heightMap,this.tileSize,this.tilesX,this.tilesY),this.onBuildingsChange&&this.onBuildingsChange(this.getBuildings()))}}class Hm{constructor(e){this.visualizer=e,this.raycaster=new Kr,this.mouse=new Ue,this.props=[],this.buildings=[],this.heightMap=null,this.gridSize=0,this.tileSize=8,this.tilesX=0,this.tilesY=0,this.seaLevel=.12,this.selectedType="rock_01",this.domElement=null,this._boundHandleMouse=this._handleMouse.bind(this),this._boundHandleMouseMove=this._handleMouseMove.bind(this),this.onPropsChange=null,this.onPlacementHover=null,this.onPropHover=null,this.onPropSelect=null}setHeightMap(e){this.heightMap=e?e.map(t=>[...t]):null,this.gridSize=this.heightMap?this.heightMap.length-1:0}setTileConfig(e,t,n){this.tileSize=e||8,this.tilesX=t??Math.floor(this.gridSize/this.tileSize),this.tilesY=n??Math.floor(this.gridSize/this.tileSize)}setSeaLevel(e){this.seaLevel=e??.12}setProps(e){this.props=Array.isArray(e)?e.map(t=>({...t})):[]}setBuildings(e){this.buildings=Array.isArray(e)?e:[]}getProps(){return this.props.map(e=>({...e}))}setSelectedType(e){Ql[e]&&(this.selectedType=e)}enable(e,t={}){this.domElement=e,this._selectionOnly=!!t.selectionOnly,e.addEventListener("mousedown",this._boundHandleMouse),e.addEventListener("mousemove",this._boundHandleMouseMove)}disable(){this.domElement&&(this.domElement.removeEventListener("mousedown",this._boundHandleMouse),this.domElement.removeEventListener("mousemove",this._boundHandleMouseMove)),this.onPlacementHover&&this.onPlacementHover(null,null,!1),this.onPropHover&&this.onPropHover(null)}_updateMouseFromEvent(e){if(!this.domElement)return;const t=this.domElement.getBoundingClientRect();this.mouse.x=(e.clientX-t.left)/t.width*2-1,this.mouse.y=-((e.clientY-t.top)/t.height)*2+1}_getTileAtCursor(){const e=this.visualizer.getMesh();if(!e||!this.heightMap)return null;this.raycaster.setFromCamera(this.mouse,this.visualizer.getCamera()),this.raycaster.layers.set(0);const t=this.raycaster.intersectObject(e,!1);if(t.length===0)return null;const n=t[0];let s,r;if(n.uv)s=Math.max(0,Math.min(1,n.uv.x)),r=Math.max(0,Math.min(1,1-n.uv.y));else{const l=n.point.clone();e.worldToLocal(l),s=Math.max(0,Math.min(1,l.x+.5)),r=Math.max(0,Math.min(1,.5-l.y))}if(this.tilesX<=0||this.tilesY<=0)return null;const a=Math.min(this.tilesX-1,Math.max(0,Math.floor(s*this.tilesX))),o=Math.min(this.tilesY-1,Math.max(0,Math.floor(r*this.tilesY)));return{tx:a,ty:o}}_getPropAtTile(e,t){for(const n of this.props)if(n.chunkX===e&&n.chunkY===t)return n;return null}_isBuildingTile(e,t){for(const n of this.buildings){const s=en(n),r=s.width,a=s.height;if(e>=n.chunkX&&e<n.chunkX+r&&t>=n.chunkY&&t<n.chunkY+a)return!0}return!1}_canPlaceProp(e,t){var a;if(e<0||e>=this.tilesX||t<0||t>=this.tilesY||this._isBuildingTile(e,t))return!1;const n=Math.min(this.gridSize,e*this.tileSize),s=Math.min(this.gridSize,t*this.tileSize);return(((a=this.heightMap[s])==null?void 0:a[n])??0)>this.seaLevel}_handleMouseMove(e){if(!this.heightMap||!this.visualizer.getMesh()||!this.domElement)return;this._updateMouseFromEvent(e);const t=this._getTileAtCursor();if(!t){this.onPlacementHover&&this.onPlacementHover(null,null,!1),this.onPropHover&&this.onPropHover(null);return}const{tx:n,ty:s}=t,r=this._getPropAtTile(n,s);if(r)this.onPlacementHover&&this.onPlacementHover(null,null,!1),this.onPropHover&&this.onPropHover(r);else{const a=this._canPlaceProp(n,s);this.onPlacementHover&&this.onPlacementHover(n,s,a),this.onPropHover&&this.onPropHover(null)}}_handleMouse(e){if(e.type!=="mousedown"||e.buttons!==1||!this.heightMap||!this.visualizer.getMesh()||!this.domElement)return;this._updateMouseFromEvent(e);const t=this._getTileAtCursor();if(!t)return;const{tx:n,ty:s}=t,r=this._getPropAtTile(n,s);r?(e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation(),e.shiftKey?this.props=this.props.filter(a=>a!==r):this.onPropSelect&&this.onPropSelect(r)):this._selectionOnly||yi(this.selectedType)&&this._canPlaceProp(n,s)&&this.props.push({id:"p"+Date.now(),type:this.selectedType,chunkX:n,chunkY:s,rotation:0}),this.visualizer.renderProps(this.props,this.heightMap,this.tileSize,this.tilesX,this.tilesY),this.onPropsChange&&this.onPropsChange(this.getProps())}}function Gm(i){const e={version:1,config:i.config,display:i.display??{},buildings:i.buildings??[],props:i.props??[],seed:i.seed,name:i.name??"",description:i.description??"",dangerous:i.dangerous??!1,appealing:i.appealing??!1,treasureLevel:i.treasureLevel??0,portType:i.portType??"none",hazard:i.hazard??"none",faction:i.faction??"neutral",rumors:i.rumors??""};return i.heightMap!=null&&(e.heightMap=i.heightMap),JSON.stringify(e)}function ec(i){const e=JSON.parse(i);if(!e.config||typeof e.config!="object")throw new Error("Invalid island file: missing config");return{heightMap:Array.isArray(e.heightMap)?e.heightMap:null,config:e.config,display:e.display??{},buildings:Array.isArray(e.buildings)?e.buildings:[],props:Array.isArray(e.props)?e.props:[],seed:e.seed??null,name:e.name??"",description:e.description??"",dangerous:e.dangerous??!1,appealing:e.appealing??!1,treasureLevel:e.treasureLevel??0,portType:e.portType??"none",hazard:e.hazard??"none",faction:e.faction??"neutral",rumors:e.rumors??""}}const Gn=document.getElementById("canvas-container"),km=document.getElementById("regenerate"),Vm=document.getElementById("stats"),fi=document.getElementById("elevation-hud"),Mi=document.getElementById("build-mode-hud"),le=new Om(Gn);le.init();le.animate();const Ae=new Bm(le),ae=new zm(le),ze=new Hm(le);let P=null,kn=!1,ot=!1,Ei="buildings",ke=null,St=null;const Wm=20;let Vn=[],Wi=[];function Xm(i){const e=String(i).trim();if(!e)return null;const t=parseInt(e,10);return isNaN(t)?null:t}function $r(){var _;const i=Math.max(4,Math.min(32,parseInt(document.getElementById("tile-size").value,10)||8));let e=Math.max(16,Math.min(2048,parseInt(document.getElementById("grid-size").value,10)||1080));e=Math.floor(e/i)*i||i;const t=(parseInt(document.getElementById("elevation-scale").value,10)||80)/100,n=(parseInt(document.getElementById("island-radius").value,10)||70)/100,s=(parseInt(document.getElementById("coast-falloff").value,10)||35)/10,r=(parseInt(document.getElementById("coast-irregularity").value,10)||25)/100,a=(parseInt(document.getElementById("elongation").value,10)||80)/100,o=(parseInt(document.getElementById("sea-level").value,10)||12)/100,l=(parseInt(document.getElementById("terrain-roughness").value,10)||70)/100,u=(parseInt(document.getElementById("tile-variation").value,10)||0)/100,d=Math.max(1,Math.min(8,parseInt(document.getElementById("noise-octaves").value,10)||3)),f=(parseInt(document.getElementById("noise-frequency").value,10)||10)/10,h=(parseInt(document.getElementById("noise-persistence").value,10)||75)/100,m=(parseInt(document.getElementById("noise-lacunarity").value,10)||26)/10,g=Math.max(1,Math.min(5,parseInt((_=document.getElementById("path-width"))==null?void 0:_.value,10)||1));return{gridSize:e,tileSize:i,elevationScale:1.2*t,islandRadius:.2+n*.6,coastFalloff:s,coastIrregularity:r,elongation:a,seaLevel:o,terrainRoughness:l,tileVariation:u,chunkSize:i,noiseOctaves:d,frequency:f,persistence:h,lacunarity:m,pathWidth:g,seed:Xm(document.getElementById("seed").value)}}function Zr(i){var p;if(!i)return;const{heightMap:e,config:t,seed:n}=i,s=e.length,r=((p=e[0])==null?void 0:p.length)??0;let a=1/0,o=-1/0,l=0,u=0;for(let c=0;c<s;c++)for(let x=0;x<r;x++){const v=e[c][x];v>0&&(a=Math.min(a,v),o=Math.max(o,v),l+=v,u++)}const d=u?(l/u).toFixed(3):"—",f=n!=null?` Seed: ${n}`:"",h=(t==null?void 0:t.tileSize)??(t==null?void 0:t.chunkSize)??8,m=s-1,g=h>0?Math.floor(m/h)**2:0,_=g>0?` ${g} tiles`:"";Vm.textContent=`${s}×${r} vertices. Min: ${a.toFixed(2)} Max: ${o.toFixed(2)} Avg: ${d}.${_}${f}`}function Jr(){var r,a,o,l,u,d,f;const i=document.getElementById("seed"),e=String(i.value).trim()!=="",t=$r(),n=Hr(t);if(n.config={...n.config,pathWidth:t.pathWidth},n.props=n.props??[],P=n,Ae.setHeightMap(n.heightMap),le.setConfig({heightScale:(parseInt(document.getElementById("height-scale").value,10)||100)/100,wireframe:document.getElementById("wireframe").checked,showWater:!0}),((r=n.buildings)==null?void 0:r.length)>=2){const{pathTiles:h,heightMap:m}=jn(n.buildings,n.heightMap,n.config);n.heightMap=m,n.pathTiles=[...h]}else n.pathTiles=[];if(le.render(n),(a=n.buildings)!=null&&a.length){const h=n.config,m=(h==null?void 0:h.tileSize)??(h==null?void 0:h.chunkSize)??8,g=Math.floor((n.heightMap.length-1)/m),_=g;le.renderBuildings(n.buildings,n.heightMap,m,g,_)}if(((o=document.getElementById("show-grid-overlay"))==null?void 0:o.checked)&&(n!=null&&n.heightMap)){const h=n.config,m=(h==null?void 0:h.tileSize)??(h==null?void 0:h.chunkSize)??8,g=(h==null?void 0:h.tilesX)??Math.floor((n.heightMap.length-1)/m),_=(h==null?void 0:h.tilesY)??g;le.setTileGridOverlay(!0,g,_,n.heightMap.length-1)}if(e&&(i.value=n.seed),Zr(n),Qr(),ke=null,St=null,Xt(),bn(),Kn(),ot||(ae.disable(),ae.onBuildingsChange=null,ae.onHeightMapChange=null,ae.onPlacementHover=null,ae.onBuildingHover=null,ae.onBuildingSelect=null,ze.disable(),ze.onPropsChange=null,ze.onPlacementHover=null,ze.onPropHover=null,ze.onPropSelect=null),!ot&&(((l=n.buildings)==null?void 0:l.length)??0)>0){ae.setHeightMap(n.heightMap);const h=n.config,m=(h==null?void 0:h.tileSize)??(h==null?void 0:h.chunkSize)??8,g=(h==null?void 0:h.tilesX)??Math.floor((((u=n.heightMap)==null?void 0:u.length)-1)/m),_=(h==null?void 0:h.tilesY)??g;ae.setTileConfig(m,g,_),ae.setSeaLevel((h==null?void 0:h.seaLevel)??.12),ae.setBuildings(n.buildings,{shared:!0}),ae.onBuildingHover=p=>{const c=P==null?void 0:P.heightMap,x=P==null?void 0:P.config,v=(x==null?void 0:x.tileSize)??(x==null?void 0:x.chunkSize)??8,M=(x==null?void 0:x.tilesX)??Math.floor(((c==null?void 0:c.length)-1)/v),E=(x==null?void 0:x.tilesY)??M;p&&c?le.setBuildingHighlight(p,c,v,M,E):le.clearBuildingHighlight()},ae.onBuildingSelect=p=>{ke=p,Xt()},ae.onPlacementHover=()=>le.clearPlacementPreview(),ae.enable(Gn,{selectionOnly:!0})}if(!ot&&(((d=n.props)==null?void 0:d.length)??0)>0){ze.setHeightMap(n.heightMap);const h=n.config,m=(h==null?void 0:h.tileSize)??(h==null?void 0:h.chunkSize)??8,g=(h==null?void 0:h.tilesX)??Math.floor((((f=n.heightMap)==null?void 0:f.length)-1)/m),_=(h==null?void 0:h.tilesY)??g;ze.setTileConfig(m,g,_),ze.setSeaLevel((h==null?void 0:h.seaLevel)??.12),ze.setProps(n.props),ze.setBuildings(n.buildings??[]),ze.onPropHover=p=>{const c=P==null?void 0:P.heightMap,x=P==null?void 0:P.config,v=(x==null?void 0:x.tileSize)??(x==null?void 0:x.chunkSize)??8,M=(x==null?void 0:x.tilesX)??Math.floor(((c==null?void 0:c.length)-1)/v),E=(x==null?void 0:x.tilesY)??M;p&&c?le.setPropHighlight(p,c,v,M,E):le.clearPropHighlight()},ze.onPropSelect=p=>{St=p,ke=null,bn(),Xt()},ze.onPlacementHover=()=>le.clearPropPlacementPreview(),ze.enable(Gn,{selectionOnly:!0})}ot&&Gs(!0)}function Li(i){var s,r,a,o,l,u,d,f;i&&ot&&Gs(!1),kn=i;const e=document.getElementById("edit-panel"),t=document.getElementById("edit-mode-btn");e&&(e.style.display=i?"block":"none"),t&&(t.textContent=i?"Edit Mode (On)":"Edit Mode (Off)",t.classList.toggle("active",i)),le.setInputMode(i?"edit":"view");const n=document.getElementById("input-hint");if(n&&(n.textContent=i?"Left=paint · Right=orbit · Space+Left=orbit · Scroll=zoom":"Left=orbit · Right=pan · Scroll=zoom"),i){Ae.setHeightMap(P==null?void 0:P.heightMap);const h=P==null?void 0:P.config;Ae.setTileConfig((h==null?void 0:h.tileSize)??(h==null?void 0:h.chunkSize)??8,h==null?void 0:h.tilesX,h==null?void 0:h.tilesY),Ae.enable(Gn),Ae.setBrushSizeInTiles(parseInt((s=document.getElementById("brush-size-tiles"))==null?void 0:s.value,10)||1),Ae.setBrushStrength((parseInt(document.getElementById("brush-strength").value,10)||16)/40*.2),Ae.setBrushMode(document.getElementById("brush-mode").value),Ae.setApplyOnClickOnly(((r=document.getElementById("brush-apply-mode"))==null?void 0:r.value)==="click"),Ae.setCanPaint(()=>!le.isSpaceHeld()),Ae.setBrushTargetHeight(parseFloat(document.getElementById("brush-target").value)||.35),Ae.setSeaLevel(((a=P==null?void 0:P.config)==null?void 0:a.seaLevel)??.12);const m=((o=P==null?void 0:P.config)==null?void 0:o.seaLevel)??.12,g=parseFloat((l=document.getElementById("elev-min"))==null?void 0:l.value)||0,_=parseFloat((u=document.getElementById("elev-max"))==null?void 0:u.value)??1;Ae.setElevationClamp(g,_),Ae.onHeightAtCursor=(c,x)=>{if(fi)if(fi.style.display=c!=null?"block":"none",c!=null){const v=c<=m?"Water":c<.2?"Beach":c<.45?"Grass":c<.7?"Rock":"Snow",M=x?` | Tile: (${x.tx},${x.ty})`:"";fi.textContent=`Elev: ${c.toFixed(3)} | ${v}${M}`}else fi.textContent="Elev: —"},Ae.onHoverTile=c=>{if(c){const x=Ae.getHeightMap();x?le.setHoverOverlay({x0:c.x0,y0:c.y0,x1:c.x1,y1:c.y1},x):le.setHoverOverlay(null)}else le.setHoverOverlay(null)},Ae.onBeforeBrush=Ym,Ae.onAfterBrush=Kn,Ae.onRampPreview=(c,x)=>{var M,E;const v=((M=P==null?void 0:P.heightMap)==null?void 0:M.length)-1;c&&x&&v>0?le.setRampPreview(c,x,v):(E=le._clearRampPreview)==null||E.call(le)},Vn=[],Wi=[];const p=((d=document.getElementById("brush-mode"))==null?void 0:d.value)||"raise";document.querySelectorAll(".brush-tool-btn").forEach(c=>c.setAttribute("aria-pressed",c.dataset.mode===p?"true":"false"))}else Ae.setCanPaint(null),Ae.onRampPreview=null,Ae.disable(),le.setHoverOverlay(null),(f=le._clearRampPreview)==null||f.call(le),fi&&(fi.style.display="none")}function Gs(i){var s,r,a,o,l,u,d,f;i&&kn&&Li(!1),ot=i;const e=document.getElementById("build-panel"),t=document.getElementById("build-mode-btn");e&&(e.style.display=i?"block":"none"),t&&(t.textContent=i?"Build Mode (On)":"Build Mode (Off)",t.classList.toggle("active",i)),le.setInputMode(i||kn?"edit":"view");const n=document.getElementById("input-hint");if(n&&(n.textContent=i?"Left=place · Right=orbit · Shift+Left=remove · Scroll=zoom":kn?"Left=paint · Right=orbit · Space+Left=orbit · Scroll=zoom":"Left=orbit · Right=pan · Scroll=zoom"),i){Ei=((s=document.querySelector('input[name="place-mode"]:checked'))==null?void 0:s.value)||"buildings";const h=P==null?void 0:P.config,m=(h==null?void 0:h.tileSize)??(h==null?void 0:h.chunkSize)??8,g=(h==null?void 0:h.tilesX)??Math.floor((((r=P==null?void 0:P.heightMap)==null?void 0:r.length)-1)/m),_=(h==null?void 0:h.tilesY)??g;ae.setHeightMap(P==null?void 0:P.heightMap),ae.setTileConfig(m,g,_),ae.setSeaLevel((h==null?void 0:h.seaLevel)??.12),ae.setBuildings((P==null?void 0:P.buildings)??[]),ae.setSelectedType(((a=document.getElementById("building-type"))==null?void 0:a.value)||"tavern"),ze.setHeightMap(P==null?void 0:P.heightMap),ze.setTileConfig(m,g,_),ze.setSeaLevel((h==null?void 0:h.seaLevel)??.12),ze.setProps((P==null?void 0:P.props)??[]),ze.setBuildings((P==null?void 0:P.buildings)??[]),ze.setSelectedType(((l=(o=document.querySelector("#prop-palette .prop-palette-btn.selected"))==null?void 0:o.dataset)==null?void 0:l.type)||"rock_01"),ae.onBuildingsChange=v=>{var N;P={...P,buildings:v};const M=P==null?void 0:P.config,E=(M==null?void 0:M.tileSize)??(M==null?void 0:M.chunkSize)??8,T=(M==null?void 0:M.tilesX)??Math.floor((((N=P==null?void 0:P.heightMap)==null?void 0:N.length)-1)/E),b=(M==null?void 0:M.tilesY)??T;if(v.length>=2&&(P!=null&&P.heightMap)){const{pathTiles:y,heightMap:w}=jn(v,P.heightMap,{...M,tilesX:T,tilesY:b});P={...P,heightMap:w,pathTiles:[...y]},ae.setHeightMap(w),Ae.setHeightMap(w),le.updateFromHeightMap(w,y,E)}else P={...P,pathTiles:[]},le.updateFromHeightMap(P.heightMap,new Set,E);Ri(),Za()},ae.onHeightMapChange=v=>{P={...P,heightMap:v},Ae.setHeightMap(v);const M=P==null?void 0:P.config,E=(M==null?void 0:M.tileSize)??(M==null?void 0:M.chunkSize)??8,T=P!=null&&P.pathTiles?new Set(P.pathTiles):new Set;le.updateFromHeightMap(v,T,E)},ae.onPlacementHover=(v,M,E)=>{const T=P==null?void 0:P.heightMap,b=P==null?void 0:P.config,N=(b==null?void 0:b.tileSize)??(b==null?void 0:b.chunkSize)??8,y=(b==null?void 0:b.tilesX)??Math.floor(((T==null?void 0:T.length)-1)/N),w=(b==null?void 0:b.tilesY)??y;v!=null&&M!=null&&T?le.setPlacementPreview(v,M,ae.selectedType,E,T,N,y,w):le.clearPlacementPreview()},ae.onBuildingHover=v=>{const M=P==null?void 0:P.heightMap,E=P==null?void 0:P.config,T=(E==null?void 0:E.tileSize)??(E==null?void 0:E.chunkSize)??8,b=(E==null?void 0:E.tilesX)??Math.floor(((M==null?void 0:M.length)-1)/T),N=(E==null?void 0:E.tilesY)??b;v&&M?le.setBuildingHighlight(v,M,T,b,N):le.clearBuildingHighlight()},ae.onBuildingSelect=v=>{ke=v,St=null,Xt(),bn()},ze.onPropsChange=v=>{P={...P,props:v},le.renderProps(v,(P==null?void 0:P.heightMap)??[],m,g,_),typeof $a=="function"&&$a()},ze.onPlacementHover=(v,M,E)=>{const T=P==null?void 0:P.heightMap;v!=null&&M!=null&&T?le.setPropPlacementPreview(v,M,ze.selectedType,E,T,m,g,_):le.clearPropPlacementPreview()},ze.onPropHover=v=>{const M=P==null?void 0:P.heightMap;v&&M?le.setPropHighlight(v,M,m,g,_):le.clearPropHighlight()},ze.onPropSelect=v=>{St=v,ke=null,bn(),Xt()},Ei==="buildings"?(ae.enable(Gn),ze.disable()):(ze.enable(Gn),ae.disable());const p=(u=document.getElementById("show-grid-overlay"))==null?void 0:u.checked;le.setTileGridOverlay(p,g,_,((d=P==null?void 0:P.heightMap)==null?void 0:d.length)-1),io(ae.selectedType),no(ae.selectedType),ic(ze.selectedType);const c=document.getElementById("place-buildings-panel"),x=document.getElementById("place-props-panel");Ei==="buildings"?(c&&(c.style.display="block"),x&&(x.style.display="none")):(c&&(c.style.display="none"),x&&(x.style.display="block")),Za(),Xt(),bn()}else{ae.disable(),ze.disable(),ae.onBuildingsChange=null,ae.onHeightMapChange=null,ae.onPlacementHover=null,ae.onBuildingHover=null,ae.onBuildingSelect=null,ze.onPropsChange=null,ze.onPlacementHover=null,ze.onPropHover=null,ze.onPropSelect=null,le.setTileGridOverlay(!1),le.clearPlacementPreview(),le.clearBuildingHighlight(),le.clearPropPlacementPreview(),le.clearPropHighlight(),Mi&&(Mi.style.display="none");const h=(P==null?void 0:P.buildings)??[];if(h.length>0){ae.setHeightMap(P.heightMap);const m=P.config,g=(m==null?void 0:m.tileSize)??(m==null?void 0:m.chunkSize)??8,_=(m==null?void 0:m.tilesX)??Math.floor((((f=P.heightMap)==null?void 0:f.length)-1)/g),p=(m==null?void 0:m.tilesY)??_;ae.setTileConfig(g,_,p),ae.setSeaLevel((m==null?void 0:m.seaLevel)??.12),ae.setBuildings(h,{shared:!0}),ae.onBuildingHover=c=>{const x=P==null?void 0:P.heightMap,v=P==null?void 0:P.config,M=(v==null?void 0:v.tileSize)??(v==null?void 0:v.chunkSize)??8,E=(v==null?void 0:v.tilesX)??Math.floor(((x==null?void 0:x.length)-1)/M),T=(v==null?void 0:v.tilesY)??E;c&&x?le.setBuildingHighlight(c,x,M,E,T):le.clearBuildingHighlight()},ae.onBuildingSelect=c=>{ke=c,Xt()},ae.onPlacementHover=()=>le.clearPlacementPreview(),ae.enable(Gn,{selectionOnly:!0})}else ke=null;Xt()}Ri()}function Ri(){if(Mi&&ot){if(Ei==="props"){const i=yi(ze.selectedType),e=(i==null?void 0:i.name)??ze.selectedType??"—",t=ze.getProps().length;Mi.textContent=`Prop: ${e} · ${t} placed`}else{const i=Ft(ae.selectedType),e=(i==null?void 0:i.name)??ae.selectedType??"—",t=ae.getBuildings().length;Mi.textContent=`Building: ${e} · ${t} placed`}Mi.style.display="block"}}function $a(){Ri()}function Za(){const i=document.getElementById("buildings-list"),e=document.getElementById("buildings-list-items");if(!i||!e)return;const t=(ae==null?void 0:ae.getBuildings())??(P==null?void 0:P.buildings)??[];if(t.length===0){i.style.display="none";return}i.style.display="block";const n=i.querySelector(".control-section-title");n&&(n.textContent=`Placed (${t.length})`),e.innerHTML=t.map((s,r)=>{const a=Ft(s.type),o=(a==null?void 0:a.name)??s.type;return`${r+1}. ${o} @ (${s.chunkX},${s.chunkY})`}).join("<br>")}function Qr(){if(!P)return;const i=(t,n)=>{const s=document.getElementById(t);s&&(s.value=String(n??""))};i("island-prop-name",P.name??""),i("island-prop-description",P.description??"");const e=document.getElementById("island-prop-trait");e&&(e.value=P.dangerous?"dangerous":P.appealing?"appealing":"normal"),i("island-prop-treasure",P.treasureLevel??0),i("island-prop-port",P.portType??"none"),i("island-prop-hazard",P.hazard??"none"),i("island-prop-faction",P.faction??"neutral"),i("island-prop-rumors",P.rumors??"")}function tc(){if(!P)return;const i=t=>{const n=document.getElementById(t);return n?n.value:""};P.name=i("island-prop-name")||"",P.description=i("island-prop-description")||"";const e=i("island-prop-trait");P.dangerous=e==="dangerous",P.appealing=e==="appealing",P.treasureLevel=parseInt(i("island-prop-treasure"),10)||0,P.portType=i("island-prop-port")||"none",P.hazard=i("island-prop-hazard")||"none",P.faction=i("island-prop-faction")||"neutral",P.rumors=i("island-prop-rumors")||""}function nc(i){const e=(i>>16&255).toString(16).padStart(2,"0"),t=(i>>8&255).toString(16).padStart(2,"0"),n=(i&255).toString(16).padStart(2,"0");return`#${e}${t}${n}`}function Xt(){const i=document.getElementById("building-properties-empty"),e=document.getElementById("building-properties-content"),t=document.getElementById("building-prop-type"),n=document.getElementById("building-prop-id"),s=document.getElementById("building-prop-swatch"),r=document.getElementById("building-prop-position"),a=document.getElementById("building-prop-width"),o=document.getElementById("building-prop-height"),l=document.getElementById("building-prop-rotation"),u=document.getElementById("building-prop-cargo"),d=document.getElementById("building-prop-cargo-formula");if(!i||!e)return;if(!ke){i.style.display="block",e&&(e.style.display="none");return}i.style.display="none",e&&(e.style.display="block");const f=Ft(ke.type),h=en(ke),m=ke.cargoSize??h.width*h.height*10,g=ke.rotation??0;t&&(t.textContent=(f==null?void 0:f.name)??ke.type??"—"),n&&(n.textContent=ke.id??"—"),s&&f&&(s.style.backgroundColor=nc(f.color)),r&&(r.textContent=`Tile (${ke.chunkX}, ${ke.chunkY})`),a&&(a.value=h.width),o&&(o.value=h.height),l&&(l.textContent=`${g}°`),u&&(u.value=m),d&&(d.textContent=`${h.width}×${h.height} × 10 = ${h.width*h.height*10} units`)}function bn(){const i=document.getElementById("prop-properties-empty"),e=document.getElementById("prop-properties-content"),t=document.getElementById("prop-prop-type"),n=document.getElementById("prop-prop-id"),s=document.getElementById("prop-prop-swatch"),r=document.getElementById("prop-prop-position"),a=document.getElementById("prop-prop-rotation");if(!i||!e)return;if(!St){i.style.display="block",e.style.display="none";return}i.style.display="none",e.style.display="block";const o=yi(St.type),l=St.rotation??0;t&&(t.textContent=(o==null?void 0:o.name)??St.type??"—"),n&&(n.textContent=St.id??"—"),s&&o&&(s.style.backgroundColor=nc(o.color)),r&&(r.textContent=`Tile (${St.chunkX}, ${St.chunkY})`),a&&(a.textContent=`${l}°`)}function ic(i){document.querySelectorAll("#prop-palette .prop-palette-btn").forEach(e=>{e.classList.toggle("selected",e.dataset.type===i)})}function sc(i){return Array.isArray(i)?i.map(e=>{const t=en(e),n={};return(e.width==null||e.height==null)&&(n.width=t.width,n.height=t.height),e.cargoSize==null&&(n.cargoSize=t.width*t.height*10),Object.keys(n).length?{...e,...n}:e}):i}function Kn(){var t;const i=(t=document.getElementById("contour-overlay"))==null?void 0:t.checked,e=Ae.getHeightMap()??(P==null?void 0:P.heightMap);e&&le.setContourOverlay(!!i,e,.1)}function Ym(){const i=Ae.getHeightMap();i&&(Vn.push(i.map(e=>[...e])),Vn.length>Wm&&Vn.shift(),Wi=[])}function rc(){if(Vn.length===0)return;Wi.push(Ae.getHeightMap().map(s=>[...s]));const i=Vn.pop();Ae.setHeightMap(i);const e=P==null?void 0:P.config,t=(e==null?void 0:e.tileSize)??(e==null?void 0:e.chunkSize)??8,n=P!=null&&P.pathTiles?new Set(P.pathTiles):new Set;le.updateFromHeightMap(i,n,t),Kn()}function oc(){if(Wi.length===0)return;Vn.push(Ae.getHeightMap().map(s=>[...s]));const i=Wi.pop();Ae.setHeightMap(i);const e=P==null?void 0:P.config,t=(e==null?void 0:e.tileSize)??(e==null?void 0:e.chunkSize)??8,n=P!=null&&P.pathTiles?new Set(P.pathTiles):new Set;le.updateFromHeightMap(i,n,t),Kn()}function qm(i){return Array.isArray(i)?i.map(e=>{const t=en(e),n=e.cargoSize??t.width*t.height*10;return{...e,width:t.width,height:t.height,cargoSize:n}}):i}function jm(){var u;if(!P)return;tc();const i=((u=document.getElementById("save-mode"))==null?void 0:u.value)||"full",e=ot?ae.getBuildings():P.buildings??[],t=qm(e),n=ot?ze.getProps():P.props??[],s={...P,heightMap:i==="full"?Ae.getHeightMap()??P.heightMap:void 0,display:{heightScale:(parseInt(document.getElementById("height-scale").value,10)||100)/100,wireframe:document.getElementById("wireframe").checked},buildings:i==="full"?t:[],props:i==="full"?n:[]},r=Gm(s),a=new Blob([r],{type:"application/json"}),o=URL.createObjectURL(a),l=document.createElement("a");l.href=o,l.download=i==="config"?`yohoh-config-${Date.now()}.json`:`yohoh-island-${Date.now()}.json`,l.click(),URL.revokeObjectURL(o)}function ac(i,e={},t=null){if(!i)return;const n=(a,o)=>{const l=document.getElementById(a);l&&(l.value=String(o))};n("grid-size",i.gridSize??1080),n("elevation-scale",Math.round((i.elevationScale??.96)/1.2*100)),n("terrain-roughness",Math.round((i.terrainRoughness??.7)*100)),n("island-radius",Math.round(((i.islandRadius??.62)-.2)/.6*100)),n("coast-falloff",Math.round((i.coastFalloff??3.5)*10)),n("coast-irregularity",Math.round((i.coastIrregularity??.25)*100)),n("elongation",Math.round((i.elongation??.8)*100)),n("sea-level",Math.round((i.seaLevel??.12)*100)),n("tile-size",i.tileSize??i.chunkSize??16),n("tile-variation",Math.round((i.tileVariation??0)*100)),n("noise-octaves",i.noiseOctaves??3),n("noise-frequency",Math.round((i.frequency??1)*10)),n("noise-persistence",Math.round((i.persistence??.75)*100)),n("noise-lacunarity",Math.round((i.lacunarity??2.6)*10)),n("path-width",Math.max(1,Math.min(5,i.pathWidth??1))),n("height-scale",Math.round((e.heightScale??.5)*100));const s=document.getElementById("wireframe");s&&(s.checked=!!e.wireframe);const r=document.getElementById("seed");r&&(r.value=t!=null?String(t):""),lc()}function lc(){const i=(e,t,n=s=>s)=>{const s=document.getElementById(e),r=document.getElementById(t);s&&r&&(r.textContent=n(s.value))};i("grid-size","val-grid"),i("elevation-scale","val-elevation",e=>`${e}%`),i("terrain-roughness","val-roughness",e=>`${e}%`),i("island-radius","val-radius",e=>`${e}%`),i("coast-falloff","val-coast",e=>(parseInt(e,10)/10).toFixed(1)),i("coast-irregularity","val-coast-irreg",e=>`${e}%`),i("elongation","val-elongation",e=>`${e}%`),i("sea-level","val-sea",e=>(parseInt(e,10)/100).toFixed(2)),i("tile-size","val-tile"),i("tile-variation","val-tile-var",e=>`${e}%`),i("noise-octaves","val-octaves"),i("noise-frequency","val-freq",e=>(parseInt(e,10)/10).toFixed(1)),i("noise-persistence","val-persist",e=>(parseInt(e,10)/100).toFixed(2)),i("noise-lacunarity","val-lac",e=>(parseInt(e,10)/10).toFixed(1)),i("height-scale","val-height-scale",e=>`${e}%`),i("path-width","val-path-width"),i("brush-target","val-brush-target"),i("brush-strength","val-brush-strength",e=>`${((parseInt(e,10)||16)/40*20).toFixed(0)}%`)}function Km(){const i=document.createElement("input");i.type="file",i.accept=".json,application/json",i.onchange=e=>{var s;const t=(s=e.target.files)==null?void 0:s[0];if(!t)return;const n=new FileReader;n.onload=()=>{var r,a,o,l,u,d,f,h,m,g,_,p;try{const c=ec(n.result);ac(c.config,c.display,c.seed);const x={...c.config,pathWidth:((r=c.config)==null?void 0:r.pathWidth)??1},v=sc(c.buildings??[]);let M;if(c.heightMap?M={heightMap:c.heightMap,config:x,buildings:v,seed:c.seed,name:c.name??"",description:c.description??"",dangerous:c.dangerous??!1,appealing:c.appealing??!1,treasureLevel:c.treasureLevel??0,portType:c.portType??"none",hazard:c.hazard??"none",faction:c.faction??"neutral",rumors:c.rumors??""}:(M=Hr($r()),M.buildings=v,M.props=props,M.config={...M.config,pathWidth:x.pathWidth},M.name=c.name??M.name??"",M.description=c.description??M.description??"",M.dangerous=c.dangerous??M.dangerous??!1,M.appealing=c.appealing??M.appealing??!1,M.treasureLevel=c.treasureLevel??M.treasureLevel??0,M.portType=c.portType??M.portType??"none",M.hazard=c.hazard??M.hazard??"none",M.faction=c.faction??M.faction??"neutral",M.rumors=c.rumors??M.rumors??""),P=M,((a=M.buildings)==null?void 0:a.length)>=2){const{pathTiles:E,heightMap:T}=jn(M.buildings,M.heightMap,M.config);M.heightMap=T,M.pathTiles=[...E]}else M.pathTiles=[];if(Ae.setHeightMap(M.heightMap),le.setConfig({heightScale:((o=c.display)==null?void 0:o.heightScale)??.5,wireframe:!!((l=c.display)!=null&&l.wireframe)}),le.render(M),(u=M.buildings)!=null&&u.length){const E=((d=M.config)==null?void 0:d.tileSize)??((f=M.config)==null?void 0:f.chunkSize)??8,T=Math.floor((((h=M.heightMap)==null?void 0:h.length)-1)/E);le.renderBuildings(M.buildings,M.heightMap,E,T,T)}if((m=M.props)!=null&&m.length){const E=((g=M.config)==null?void 0:g.tileSize)??((_=M.config)==null?void 0:_.chunkSize)??8,T=Math.floor((((p=M.heightMap)==null?void 0:p.length)-1)/E);le.renderProps(M.props,M.heightMap,E,T,T)}Zr(M),Qr(),ke=null,Xt(),document.getElementById("seed").value=M.seed??"",Li(!0),Kn()}catch(c){alert("Invalid island file: "+c.message)}},n.readAsText(t),i.value=""},i.click()}function Mt(i,e,t=n=>n){const n=document.getElementById(i),s=document.getElementById(e);if(!n||!s)return;const r=()=>{s.textContent=t(n.value)};n.addEventListener("input",r),n.addEventListener("change",r),r()}const Jt=document.getElementById("settings-modal"),wr=document.getElementById("settings-btn"),Rr=document.getElementById("settings-close-btn");function $m(){Jt&&Jt.classList.add("open")}function eo(){Jt&&Jt.classList.remove("open")}wr==null||wr.addEventListener("click",$m);Rr==null||Rr.addEventListener("click",eo);Jt==null||Jt.addEventListener("click",i=>{i.target===Jt&&eo()});document.addEventListener("keydown",i=>{i.key==="Escape"&&(Jt!=null&&Jt.classList.contains("open"))&&eo()});km.addEventListener("click",Jr);document.getElementById("randomize").addEventListener("click",()=>{document.getElementById("seed").value="",Li(!1),Jr()});document.getElementById("save-btn").addEventListener("click",jm);document.getElementById("load-btn").addEventListener("click",Km);async function Zm(){var t,n,s,r,a,o,l,u;const i=document.getElementById("preset-select"),e=i==null?void 0:i.value;if(e)try{const d=await fetch(e);if(!d.ok)throw new Error(d.statusText);const f=ec(await d.text());ac(f.config,f.display,f.seed);const h={...f.config,pathWidth:((t=f.config)==null?void 0:t.pathWidth)??1},m=sc(f.buildings??[]);let g;if(f.heightMap?g={heightMap:f.heightMap,config:h,buildings:m,seed:f.seed,name:f.name??"",description:f.description??"",dangerous:f.dangerous??!1,appealing:f.appealing??!1,treasureLevel:f.treasureLevel??0,portType:f.portType??"none",hazard:f.hazard??"none",faction:f.faction??"neutral",rumors:f.rumors??""}:(g=Hr($r()),g.buildings=m,g.config={...g.config,pathWidth:h.pathWidth},g.name=f.name??g.name??"",g.description=f.description??g.description??"",g.dangerous=f.dangerous??g.dangerous??!1,g.appealing=f.appealing??g.appealing??!1,g.treasureLevel=f.treasureLevel??g.treasureLevel??0,g.portType=f.portType??g.portType??"none",g.hazard=f.hazard??g.hazard??"none",g.faction=f.faction??g.faction??"neutral",g.rumors=f.rumors??g.rumors??""),P=g,((n=g.buildings)==null?void 0:n.length)>=2){const{pathTiles:_,heightMap:p}=jn(g.buildings,g.heightMap,g.config);g.heightMap=p,g.pathTiles=[..._]}else g.pathTiles=[];if(Ae.setHeightMap(g.heightMap),le.setConfig({heightScale:((s=f.display)==null?void 0:s.heightScale)??.5,wireframe:!!((r=f.display)!=null&&r.wireframe)}),le.render(g),(a=g.buildings)!=null&&a.length){const _=((o=g.config)==null?void 0:o.tileSize)??((l=g.config)==null?void 0:l.chunkSize)??8,p=Math.floor((((u=g.heightMap)==null?void 0:u.length)-1)/_);le.renderBuildings(g.buildings,g.heightMap,_,p,p)}Zr(g),Qr(),ke=null,Xt(),Li(!0),Kn(),i.value=""}catch(d){alert("Failed to load preset: "+d.message)}}document.getElementById("load-preset-btn").addEventListener("click",Zm);["island-prop-name","island-prop-description","island-prop-trait","island-prop-treasure","island-prop-port","island-prop-hazard","island-prop-faction","island-prop-rumors"].forEach(i=>{var e;(e=document.getElementById(i))==null||e.addEventListener("change",tc)});function to(){var g,_;if(!ke||!P)return;const i=document.getElementById("building-prop-width"),e=document.getElementById("building-prop-height"),t=document.getElementById("building-prop-cargo");if(!i||!e||!t)return;const n=Math.max(1,Math.min(5,parseInt(i.value,10)||1)),s=Math.max(1,Math.min(5,parseInt(e.value,10)||1)),r=Math.max(10,parseInt(t.value,10)||10),a=ot?ae.getBuildings():P.buildings??[];if(!ae.canPlaceAtFootprint(ke.chunkX,ke.chunkY,n,s,ke.type,{chunkX:ke.chunkX,chunkY:ke.chunkY})){Xt();return}const l=ke.width??en(ke).width,u=ke.height??en(ke).height;if(ke.width=n,ke.height=s,ke.cargoSize=r,n>l||s>u){ae.flattenRegion(ke.chunkX,ke.chunkY,n,s,ke.type);const p=ae.heightMap;p&&(P.heightMap=p.map(c=>[...c]),Ae.setHeightMap(P.heightMap),ae.onHeightMapChange&&ae.onHeightMapChange(P.heightMap))}const d=P.config,f=(d==null?void 0:d.tileSize)??(d==null?void 0:d.chunkSize)??8,h=(d==null?void 0:d.tilesX)??Math.floor((((g=P.heightMap)==null?void 0:g.length)-1)/f),m=(d==null?void 0:d.tilesY)??h;if(a.length>=2&&P.heightMap){const{pathTiles:p,heightMap:c}=jn(a,P.heightMap,{...d,tilesX:h,tilesY:m});P.heightMap=c,P.pathTiles=[...p],Ae.setHeightMap(c),(_=ae.setHeightMap)==null||_.call(ae,c),le.updateFromHeightMap(c,p,f)}else le.updateFromHeightMap(P.heightMap,P.pathTiles?new Set(P.pathTiles):new Set,f);le.renderBuildings(a,P.heightMap,f,h,m),ot&&ae.onBuildingsChange&&ae.onBuildingsChange(a)}var Ja;(Ja=document.getElementById("building-prop-width"))==null||Ja.addEventListener("change",to);var Qa;(Qa=document.getElementById("building-prop-height"))==null||Qa.addEventListener("change",to);var el;(el=document.getElementById("building-prop-cargo"))==null||el.addEventListener("change",to);var tl;(tl=document.getElementById("building-rotate-btn"))==null||tl.addEventListener("click",()=>{var l;if(!ke||!P||!Ft(ke.type))return;const e=[0,90,180,270],t=e.indexOf(ke.rotation??0);ke.rotation=e[(t+1)%4];const n=ot?ae.getBuildings():P.buildings??[],s=P.config,r=(s==null?void 0:s.tileSize)??(s==null?void 0:s.chunkSize)??8,a=(s==null?void 0:s.tilesX)??Math.floor((((l=P.heightMap)==null?void 0:l.length)-1)/r),o=(s==null?void 0:s.tilesY)??a;le.renderBuildings(n,P.heightMap,r,a,o),ot&&ae.onBuildingsChange&&ae.onBuildingsChange(n)});var nl;(nl=document.getElementById("building-remove-btn"))==null||nl.addEventListener("click",()=>{var r;if(!ke||!P)return;const i=(P.buildings??[]).filter(a=>a!==ke);P.buildings=i,ot?ae.setBuildings(i):ae.setBuildings(i,{shared:!0}),ke=null,Xt(),bn();const e=P.config,t=(e==null?void 0:e.tileSize)??(e==null?void 0:e.chunkSize)??8,n=(e==null?void 0:e.tilesX)??Math.floor((((r=P.heightMap)==null?void 0:r.length)-1)/t),s=(e==null?void 0:e.tilesY)??n;if(i.length>=2&&P.heightMap){const{pathTiles:a,heightMap:o}=jn(i,P.heightMap,{...e,tilesX:n,tilesY:s});P.heightMap=o,P.pathTiles=[...a],Ae.setHeightMap(o),le.updateFromHeightMap(o,a,t)}else P.pathTiles=[],le.updateFromHeightMap(P.heightMap,new Set,t);le.renderBuildings(i,P.heightMap,t,n,s),ot&&ae.onBuildingsChange&&ae.onBuildingsChange(i)});document.getElementById("edit-mode-btn").addEventListener("click",()=>{Li(!kn)});var il;(il=document.getElementById("build-mode-btn"))==null||il.addEventListener("click",()=>{Gs(!ot)});document.querySelectorAll('input[name="place-mode"]').forEach(i=>{i.addEventListener("change",e=>{Ei=e.target.value,ot&&Gs(!0);const t=document.getElementById("place-buildings-panel"),n=document.getElementById("place-props-panel");Ei==="buildings"?(t&&(t.style.display="block"),n&&(n.style.display="none")):(t&&(t.style.display="none"),n&&(n.style.display="block"))})});document.querySelectorAll("#prop-palette .prop-palette-btn").forEach(i=>{i.addEventListener("click",()=>{const e=i.dataset.type;e&&(ze.setSelectedType(e),ic(e),Ri())})});var sl;(sl=document.getElementById("prop-rotate-btn"))==null||sl.addEventListener("click",()=>{var o;if(!St||!P)return;const i=[0,90,180,270],e=i.indexOf(St.rotation??0);St.rotation=i[(e+1)%4];const t=ot?ze.getProps():P.props??[],n=P.config,s=(n==null?void 0:n.tileSize)??(n==null?void 0:n.chunkSize)??8,r=(n==null?void 0:n.tilesX)??Math.floor((((o=P.heightMap)==null?void 0:o.length)-1)/s),a=(n==null?void 0:n.tilesY)??r;le.renderProps(t,P.heightMap,s,r,a),ot&&ze.onPropsChange&&ze.onPropsChange(t),P={...P,props:t},bn()});var rl;(rl=document.getElementById("prop-remove-btn"))==null||rl.addEventListener("click",()=>{var r;if(!St||!P)return;const i=(P.props??[]).filter(a=>a!==St);P={...P,props:i},ot&&ze.setProps(i),St=null,bn();const e=P.config,t=(e==null?void 0:e.tileSize)??(e==null?void 0:e.chunkSize)??8,n=(e==null?void 0:e.tilesX)??Math.floor((((r=P.heightMap)==null?void 0:r.length)-1)/t),s=(e==null?void 0:e.tilesY)??n;le.renderProps(i,P.heightMap,t,n,s)});var ol;(ol=document.getElementById("building-type"))==null||ol.addEventListener("change",i=>{ae.setSelectedType(i.target.value),io(i.target.value),no(i.target.value),Ri()});document.querySelectorAll("#building-palette .building-palette-btn").forEach(i=>{i.addEventListener("click",()=>{const e=i.dataset.type;if(!e)return;ae.setSelectedType(e);const t=document.getElementById("building-type");t&&(t.value=e),io(e),no(e),Ri()})});function no(i){const e=Fn(i),t=document.getElementById("building-width"),n=document.getElementById("building-height");t&&(t.value=e.width),n&&(n.value=e.height)}var al;(al=document.getElementById("building-width"))==null||al.addEventListener("change",i=>{var n;const e=ae==null?void 0:ae.selectedType;if(!e)return;const t=Math.max(1,Math.min(5,parseInt(i.target.value,10)||1));if(Jl(e,t,void 0),P&&ot){const s=P.config,r=(s==null?void 0:s.tileSize)??(s==null?void 0:s.chunkSize)??8,a=(s==null?void 0:s.tilesX)??Math.floor((((n=P.heightMap)==null?void 0:n.length)-1)/r),o=(s==null?void 0:s.tilesY)??a;le.renderBuildings(ae.getBuildings(),P.heightMap,r,a,o)}});var ll;(ll=document.getElementById("building-height"))==null||ll.addEventListener("change",i=>{var n;const e=ae==null?void 0:ae.selectedType;if(!e)return;const t=Math.max(1,Math.min(5,parseInt(i.target.value,10)||1));if(Jl(e,void 0,t),P&&ot){const s=P.config,r=(s==null?void 0:s.tileSize)??(s==null?void 0:s.chunkSize)??8,a=(s==null?void 0:s.tilesX)??Math.floor((((n=P.heightMap)==null?void 0:n.length)-1)/r),o=(s==null?void 0:s.tilesY)??a;le.renderBuildings(ae.getBuildings(),P.heightMap,r,a,o)}});function io(i){document.querySelectorAll("#building-palette .building-palette-btn").forEach(e=>{e.classList.toggle("selected",e.dataset.type===i)})}var cl;(cl=document.getElementById("show-grid-overlay"))==null||cl.addEventListener("change",i=>{var r,a;if(!P)return;const e=P.config,t=(e==null?void 0:e.tileSize)??(e==null?void 0:e.chunkSize)??8,n=(e==null?void 0:e.tilesX)??Math.floor((((r=P.heightMap)==null?void 0:r.length)-1)/t),s=(e==null?void 0:e.tilesY)??n;le.setTileGridOverlay(i.target.checked,n,s,((a=P.heightMap)==null?void 0:a.length)-1)});document.querySelectorAll(".brush-tool-btn").forEach(i=>{i.addEventListener("click",()=>{const e=i.dataset.mode;e&&(document.getElementById("brush-mode").value=e,Ae.setBrushMode(e),document.querySelectorAll(".brush-tool-btn").forEach(t=>t.setAttribute("aria-pressed",t.dataset.mode===e?"true":"false")))})});document.getElementById("brush-mode").addEventListener("change",i=>{const e=i.target.value;Ae.setBrushMode(e),document.querySelectorAll(".brush-tool-btn").forEach(t=>t.setAttribute("aria-pressed",t.dataset.mode===e?"true":"false"))});document.getElementById("brush-target").addEventListener("input",i=>{const e=parseFloat(i.target.value);isNaN(e)||Ae.setBrushTargetHeight(e)});document.getElementById("brush-target").addEventListener("change",i=>{const e=parseFloat(i.target.value);isNaN(e)||Ae.setBrushTargetHeight(e)});var hl;(hl=document.getElementById("brush-size-tiles"))==null||hl.addEventListener("change",i=>{Ae.setBrushSizeInTiles(parseInt(i.target.value,10)||1)});var ul;(ul=document.getElementById("brush-apply-mode"))==null||ul.addEventListener("change",i=>{Ae.setApplyOnClickOnly(i.target.value==="click")});document.getElementById("brush-strength").addEventListener("input",i=>{const e=parseInt(i.target.value,10)||16;Ae.setBrushStrength(e/40*.2)});document.querySelectorAll(".level-preset-btn").forEach(i=>{i.addEventListener("click",()=>{const e=i.dataset.level,t=Fm[e];if(t!=null){const n=document.getElementById("brush-target");n&&(n.value=t.toFixed(2),Ae.setBrushTargetHeight(t),lc())}})});document.getElementById("undo-btn").addEventListener("click",rc);document.getElementById("redo-btn").addEventListener("click",oc);var dl;(dl=document.getElementById("contour-overlay"))==null||dl.addEventListener("change",()=>{Kn()});var fl;(fl=document.getElementById("elev-min"))==null||fl.addEventListener("change",()=>{const i=parseFloat(document.getElementById("elev-min").value)||0,e=parseFloat(document.getElementById("elev-max").value)??1;Ae.setElevationClamp(i,e)});var pl;(pl=document.getElementById("elev-max"))==null||pl.addEventListener("change",()=>{const i=parseFloat(document.getElementById("elev-min").value)||0,e=parseFloat(document.getElementById("elev-max").value)??1;Ae.setElevationClamp(i,e)});document.addEventListener("keydown",i=>{var t,n,s;if((n=(t=document.activeElement)==null?void 0:t.closest)!=null&&n.call(t,"input, textarea, select"))return;const e=i.key.toLowerCase();if(e==="e"&&!i.ctrlKey&&!i.metaKey&&!i.altKey){i.preventDefault(),Li(!kn);return}if(kn){if(e==="z"&&!i.shiftKey&&(i.ctrlKey||i.metaKey)){i.preventDefault(),rc();return}if((e==="y"||e==="z"&&i.shiftKey)&&(i.ctrlKey||i.metaKey)){i.preventDefault(),oc();return}if(e==="b"&&!i.ctrlKey&&!i.metaKey){i.preventDefault();const r=document.getElementById("brush-size-tiles");if(r){const a=["1","2","3","4","5"],o=a.indexOf(r.value);r.value=a[(o+1)%a.length],Ae.setBrushSizeInTiles(parseInt(r.value,10)||1)}return}if(e==="Escape"){Ae.rampPointA&&(i.preventDefault(),Ae.rampPointA=null,Ae.setBrushMode(Ae.brushMode),(s=le._clearRampPreview)==null||s.call(le));return}if(e>="1"&&e<="8"){i.preventDefault();const a=["raise","lower","flatten","absolute","set","plateau","smooth","ramp"][parseInt(e,10)-1];document.getElementById("brush-mode").value=a,Ae.setBrushMode(a),document.querySelectorAll(".brush-tool-btn").forEach(o=>o.setAttribute("aria-pressed",o.dataset.mode===a?"true":"false"))}}});document.getElementById("height-scale").addEventListener("input",()=>{const i=(parseInt(document.getElementById("height-scale").value,10)||100)/100;if(le.setConfig({heightScale:i}),P){const e=P==null?void 0:P.config,t=(e==null?void 0:e.tileSize)??(e==null?void 0:e.chunkSize)??8,n=P!=null&&P.pathTiles?new Set(P.pathTiles):new Set;le.updateFromHeightMap(Ae.getHeightMap()??P.heightMap,n,t)}});var ml;(ml=document.getElementById("path-width"))==null||ml.addEventListener("change",()=>{var t,n,s;if(!P)return;const i=Math.max(1,Math.min(5,parseInt((t=document.getElementById("path-width"))==null?void 0:t.value,10)||1)),e={...P.config,pathWidth:i};if(P.config=e,((n=P.buildings)==null?void 0:n.length)>=2){const r=P.heightMap.map(u=>[...u]),{pathTiles:a,heightMap:o}=jn(P.buildings,r,e);P.heightMap=o,P.pathTiles=[...a],Ae.setHeightMap(o),(s=ae.setHeightMap)==null||s.call(ae,o);const l=(e==null?void 0:e.tileSize)??(e==null?void 0:e.chunkSize)??8;le.updateFromHeightMap(o,a,l)}});document.getElementById("wireframe").addEventListener("change",i=>{if(le.setConfig({wireframe:i.target.checked}),P){const e=le.getMesh();e&&(e.material.wireframe=i.target.checked)}});Mt("grid-size","val-grid");Mt("elevation-scale","val-elevation",i=>`${i}%`);Mt("terrain-roughness","val-roughness",i=>`${i}%`);Mt("island-radius","val-radius",i=>`${i}%`);Mt("coast-falloff","val-coast",i=>(parseInt(i,10)/10).toFixed(1));Mt("coast-irregularity","val-coast-irreg",i=>`${i}%`);Mt("elongation","val-elongation",i=>`${i}%`);Mt("sea-level","val-sea",i=>(parseInt(i,10)/100).toFixed(2));Mt("tile-size","val-tile");Mt("tile-variation","val-tile-var",i=>`${i}%`);Mt("noise-octaves","val-octaves");Mt("noise-frequency","val-freq",i=>(parseInt(i,10)/10).toFixed(1));Mt("noise-persistence","val-persist",i=>(parseInt(i,10)/100).toFixed(2));Mt("noise-lacunarity","val-lac",i=>(parseInt(i,10)/10).toFixed(1));Mt("height-scale","val-height-scale",i=>`${i}%`);Mt("path-width","val-path-width");Mt("brush-target","val-brush-target");Mt("brush-strength","val-brush-strength",i=>`${((parseInt(i,10)||16)/40*20).toFixed(0)}%`);Jr();
