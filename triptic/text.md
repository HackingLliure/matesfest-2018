# Text 4 triptic

## Comentaris
En les pagines de text caben aprox 150 caràcters a mida 12. Per tant, em restringiré a això.

L'odre de les pagines no ha de ser aquest, simplement és una idea.

## Text

### 1 - Portada


### Intro 2 BTC

El bitcoin (BTC), aka Shitcoin, és una criptomoneda descentralitzada proposada inicialment per Satoshi Nakamoto. És la criptomoneda més utilitzada actualment amb un mercat total actual de més de 110B d'euros. 

**Insertar img del QR al paper del Satoshi (img/QR_btc_paper)**



### Que és una blockchain?

Tots els nodes que formen part de la xarxa Bitcoin mantenen una llista col·lectiva de totes les transaccions conegudes, la cadena de blocs. Els nodes generadors (miners) creen els nous blocs, així com les noves transaccions publicades a la xarxa. 
Quan un miner troba (mina) un nou bloc, ho transmet a la resta dels nodes als quals està connectat. En el cas que resulti un bloc vàlid, aquests nodes s'afegeixen a la cadena i el tornen a retransmetre. Aquest procés es repeteix indefinidament fins que el bloc ha assolit tots els nodes de la xarxa. Eventualment, la cadena de blocs conté l'historial de possessió de totes les monedes des de la direcció-creadora a la direcció de l'actual propietari. Per tant, si un usuari intenta reutilitzar monedes que ja va usar, la xarxa rebutjarà la transacció.

**Insertar img ilus. blockchain (img/blockchain)**

La generació de blocs es coneix com a minar. Tots els nodes generadors de la xarxa competeixen per ser el primer a trobar la solució del problema criptogràfic del seu bloc-candidat actual, mitjançant un sistema de proves de treball, resolent un problema que requereix diversos intents repetitius, per força bruta, no determinista, de manera que s'evita que miners amb gran nivell de processament deixin fora els més petits. D'aquesta manera, la probabilitat que un miner trobi un bloc depèn del poder computacional amb el qual contribueix a la xarxa en relació al poder computacional de tots els nodes combinats, i això permet que el sistema funcioni de manera descentralitzada. Els nodes que reben el nou bloc solucionat el validen abans d'acceptar, i l'agreguen a la cadena. La validació de la solució proporcionada pel miner és trivial i es fa immediatament.

La xarxa reajusta la dificultat cada 2016 blocs, és a dir, aproximadament cada 2 setmanes, perquè un bloc sigui generat cada deu minuts. La quantitat de bitcoins creada per bloc mai és més de 50 BTC, i els premis estan programats per disminuir amb el pas del temps fins a arribar a zero, garantint que no hi pugui haver més de 21 milions de BTC.

Els miners no tenen l'obligació d'incloure transaccions en els blocs que generen, de manera que els remitents de bitcoins poden pagar voluntàriament una tarifa perquè tramitin les seves transaccions més ràpidament. Com que el premi per bloc disminueix amb el pas del temps, en el llarg termini totes les recompenses dels nodes generadors provindran únicament de les tarifes de transacció.



### Privacitat

Les transaccions se signen digitalment pel propietari de la direcció Bitcoin que conté originalment els fons. Aquest missatge signat es propaga per tota la xarxa i s'acaba emmagatzemant en la cadena de blocs. Com el nucli del protocol Bitcoin no encripta cap tipus d'informació, totes les transaccions són públiques i qualsevol observador extern pot analitzar en qualsevol moment el seu contingut, l'origen i la destinació de tots els missatges. Aquesta característica contrasta amb el model bancari tradicional que amaga les transaccions de l'escrutini públic.

Si un usuari vol funcionar de manera anònima a la xarxa, és condició indispensable que no faci pública la relació entre la seva identitat en la vida real i les seves adreces Bitcoin. D'altra banda, algunes organitzacions i individus poden associar de manera intencionada les seves identitats amb les seves adreces per proporcionar un cert grau de transparència.

### Ús de la criptomoneda

Els bitcoins contenen la direcció pública del seu amo actual. Quan un usuari A transfereix alguna cosa a un usuari B, A lliura la propietat agregant la clau pública de B i després signant amb la seva clau privada. A llavors inclou aquests bitcoins en una transacció, i la difon als nodes de la xarxa P2P als quals està connectat. Aquests nodes validen les signatures criptogràfiques i el valor de la transacció abans d'acceptar-la retransmetre. 


### 6 - HL
