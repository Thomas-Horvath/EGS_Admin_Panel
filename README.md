# Electric Guitar Shop - Admin Panel
 
## Weboldal: [electricguitarshop.eu/admin](https://thomas-horvath.github.io/EGS_Admin_Panel)


Teszt felhasználó:

    - felhasználónév: admin
    - jelszó: Password

 Az Electric Guitar Shop, fiktív hangszerbolt és webáruház full-stack megvalósításának adminisztációs felületének front-end project része. 
 
 
 A projektben megvalósított funkciók: 
 - felhasználók kezelését
    - felhasználó validálás, bejelentkeztetés
    - felhasználói profil megjelenítése
    - felhasználó adatainak kezelése, frissítése

 - rendelések kezelését
    - kosár funkció kivitelezése
    - rendelés kezelése és rögzítése az adatbázisban
    - felhasználó eddigi rendeléseinek a megtekintése

 - termékek kezelésé
    - termékek termékkártyákon való megjelenítése
    - termékek részleteinek megtekintése külön oldalon
    - termékek kategóriánként való megjelenítése amelyek a navigációs menükből érhetők el
    - termék szűrés és rendezés megvalósítása
    
- keresési funkció 
    - termékek keresése a terméknév, márka, vagy kategória név szerint


## Felhasznált technológiák:
 
 - React ( create-react-app)
    - függvény komponensek 
    - React Router V6
    - React hook-ok:
        - useEffect
        - useState
        - useParams
        - useNavigate
        - useLocaiton
    - Context API
    - session és local storage

 - HTML5 
 - CSS 


## Külső könytvtárak, modulok
- Swiper : https://swiperjs.com/react
- React-icons : https://react-icons.github.io/react-icons/
- React-Paginate : https://www.npmjs.com/package/react-paginate
- JWT-decode : https://www.npmjs.com/package/jwt-decode
- Libphonenumber-js : https://www.npmjs.com/package/libphonenumber-js