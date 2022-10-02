var devtools = false

//In this game, most numbers are treated as tuples [a,b] which is a compact representation for the potentially very large number
//  a*10^(3b), where in most cases, 1<=a<1000. So b tells us which group of numbers it belongs to. For example,
//  b=0: less than a thousand; b=1: thousands; b=2: millions; b=3: billions; etc.
//  For example, [2.4,3] = 2,400,000,000. [460,2]=460,000,000. [0.9,1] = 900
//  So the tuple notation is a way to keep floating point arithmetic happy. Generally a is limited to 15 significant digits.
var gameData = {
    knowledge: [0,0],
    cmKnowledge: [0,0],
    knowledgeCommas: 0,
    kps: [0,0],
    kpsCommas: 0,
    answer: 0,
    growthFactor: [1.2,0],
    typetag: 1,
    rubies: 0,
    rubyCost: 0,
    rubyBonus: 1,
    unitUnlocked: 0,
    streak: 0,
    streakHighest: 0
}
var z =                   0 //This is the tag defining whether we are working on a review problem or not.
var answerString =        0
var tolerance =           0.01
var costT =               [[0,0], [5,0], [35,0], [240,0], [1.7,1], [12,1], [84,1], [580,1], [4.1,2],
                            [28,2], [200,2], [1.4,3], [9.8,3], [69,3], [480,3],
                            [3.3,4], [23,4], [160,4], [1.1,5], [8.1,5], [56,5],
                            [390,5], [2.7,6], [19,6], [130,6], [950,6], [6.7,7],
                            [46,7], [320,7], [2.2,8],
                            [16,8], [110,8], [780,8], [5.5,9], [38,9],
                            [270,9], [1.8,10], [13,10], [92,10], [640,10], [4.5,11],
                            [31,11], [220,11], [1.5,12], [10,12], [76,12], [530,12], [3.7,13], [26,13],
                            [180,13], [1.2,14], [8.9,14], [62,14], [440,14], [3,15],
                            [21,15], [150,15], [1,16], [7.4,16], [51,16],
                            [360,16], [2.5,17], [17,17], [120,17], [870,17], [6,18], [42,18],
                            [290,18], [2,19], [14,19], [100,19],
                            [710,19], [5,20], [35,20], [240,20], [1.7,21], [12,21], [84,21]]
var kpsvector =           [[0,0], [1,0], [2,0], [8,0], [32,0], [64,0], [250,0], [1,1], [4,1],
                            [370,1], [1.5,2], [6,2], [24,2], [95,2], [380,2],
                            [45,3], [180,3], [700,3], [2.8,4], [11,4], [46,4],
                            [5,5], [20,5], [80,5], [320,5], [1.2,6], [5,6],
                            [600,6], [2.2,7], [8,7],
                            [210,7], [800,7], [3.4,8], [13,8], [55,8],
                            [3.6,9], [14,9], [55,9], [230,9], [900,9], [3.7,10],
                            [420,10], [1.7,11], [6.5,11], [27,11], [100,11], [430,11], [1.7,12], [7,12],
                            [2.4,13], [9.5,13], [38,13], [150,13], [600,13], [2.4,14],
                            [270,14], [1.1,15], [4.4,15], [17,15], [70,15],
                            [5,16], [20,16], [80,16], [320,16], [1.2,17], [5,17], [20,17],
                            [3.9,18], [15,18], [60,18], [250,18],
                            [9.5,19], [38,19], [150,19], [600,19], [2.4,20], [9.5,20], [38,20]]
var numberOfQ =           kpsvector.length - 1
var numberCorrect =       Array(costT.length).fill(0) //This just makes a zero vector with the same length as costT
var numberCorrectUnit =   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
var numberCorrectCommas = Array(costT.length).fill(0) //This just makes a zero vector with the same length as costT
var kpsFromT =            Array(costT.length).fill([0,0]) //This just makes a zero vector with the same length as costT
var kpsPctFromT =         Array(costT.length).fill(0) //This just makes a zero vector with the same length as costT
var levelT =              Array(costT.length).fill(0)
var abbr = ["","K","M","B","T","Qa","Qt","Sx","Sp","Oc","Nn","Dc","UDc","DDc","TDc","QaDc","QnDc","SxDc","SpDc","OcDc","NvDc","Vi",
            "UVi","DVi","TVi","QaVi","QnVi","SxVi","SpVi","OcVi","NvVi","Tg"]
var fullname = ["","thousand","million","billion","trillion","quadrillion","quintillion","sextillion","septillion","octillion",
                "nonillion","decillion","undecillion","duodecillion","tredecillion","quattuordecillion","quindecillion",
                "sexdecillion","septendecillion","octodecillion","novemdecillion","vigintillion","unvigintillion","duovigintillion",
                "trevigintillion","quattuorvigintillion","quinvigintillion","sexvigintillion","septenvigintillion",
                "octovigintillion","novemvigintillion","trigintillion"]
var greekNames = ["","Alpha","Beta","Gamma","Delta","Epsilon","Zeta","Eta","Theta","Iota","Kappa","Lambda","Mu","Nu","Xi",
                  "Omicron","Pi","Rho","Sigma","Tau","Upsilon","Phi","Chi","Psi","Omega"]
var gotGreek = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
var gotGreekTotal = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
var greekCurrent = ""
var greekTextInitial = ["","&alpha;","&beta;","&gamma;","&delta;","&epsilon;","&zeta;","&eta;","&theta;","&iota;","&kappa;",
  "&lambda;","&mu;","&nu;","&xi;","&omicron;","&pi;","&rho;","&sigma;","&tau;","&upsilon;","&straightphi;","&chi;","&psi;","&omega;"]
var greekText = ["","&alpha;","&beta;","&gamma;","&delta;","&epsilon;","&zeta;","&eta;","&theta;","&iota;","&kappa;",
  "&lambda;","&mu;","&nu;","&xi;","&omicron;","&pi;","&rho;","&sigma;","&tau;","&upsilon;","&straightphi;","&chi;","&psi;","&omega;"]
var purchasedMusicUpgrade = [true, false, false, false, false, false]
var musicButtonAppear = [0, 0, 0, 0, 0, 0]
var musicLevel = ["","Copper","Silver","Gold","Platinum","Diamond"]
var musicCheckName = ["","copperMusic","silverMusic","goldMusic","platinumMusic","diamondMusic"]
var musicUpgradeCost = [[0,0],[5,1],[5,5],[5,9],[5,13],[5,17]]
var addMusicButton = [0,document.createElement("button"),document.createElement("button"),document.createElement("button"),
                        document.createElement("button"),document.createElement("button")]
const iconmusic = ["","iconmusiccopper","iconmusicsilver","iconmusicgold","iconmusicplatinum","iconmusicdiamond"]
var rewardFactor =        [ [0,0], [0,0], [2,0], [5,0], [10,0], [1,1] ]
                          //Upgrade to:   silv   gold   plat    diamond
var upgradeArea = document.getElementById("upgradeArea")
var upgradePurchased = [ [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false],
                          [false, false, false, false, false, false] ]
var KNeededToUnlock =  [[0,0], [10,0], [240,2], [32,4], [3.2,6], [320,7], [110,8], [1.9,10], [220,11], [420,13],
                        [240,15], [2.4,17], [2.2,19], [5.6,20]]
var KPSNeededToUnlock = [[0,0], [1,0], [50,1], [6,3], [700,4], [80,6], [28,7], [480,8], [56,10], [50,12],
                         [42,14], [700,15], [520,17], [1.2,19]]
var correctNeededtoUnlock = [0, 0, 80, 60, 60, 60, 30, 50, 60, 80, 60, 50, 70, 40]
                          //Cost of nth   x20   x15   x200  x2
var upgradeCost =         [ [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]] ,

                            [[0,0],[0,0],[500,0],[20,1],[1,2],[1,3]] , //Unit 1
                            [[0,0],[0,0],[3.5,1],[140,1],[7,2],[7,3]] , 
                            [[0,0],[0,0],[24,1],[980,1],[49,2],[49,3]] , 
                            [[0,0],[0,0],[170,1],[6.8,2],[340,2],[340,3]] , 
                            [[0,0],[0,0],[1.2,2],[48,2],[2.4,3],[2.4,4]] ,
                            [[0,0],[0,0],[8.4,2],[330,2],[16,3],[16,4]] , 
                            [[0,0],[0,0],[58,2],[2.3,3],[110,3],[110,4]] , 
                            [[0,0],[0,0],[410,2],[16,3],[820,3],[820,4]] , 

                            [[0,0],[0,0],[2.8,3],[110,3],[5.7,4],[5.7,5]] , //Unit 2
                            [[0,0],[0,0],[20,3],[800,3],[40,4],[40,5]] , 
                            [[0,0],[0,0],[140,3],[5.6,4],[280,4],[280,5]] , 
                            [[0,0],[0,0],[980,3],[39,4],[1.9,5],[1.9,6]] , 
                            [[0,0],[0,0],[6.8,4],[270,4],[13,5],[13,6]] ,
                            [[0,0],[0,0],[48,4],[1.9,5],[96,5],[96,6]] , 

                            [[0,0],[0,0],[330,4],[13,5],[670,5],[670,6]] , //Unit 3
                            [[0,0],[0,0],[2.3,5],[94,5],[4.7,6],[4.7,7]] , 
                            [[0,0],[0,0],[16,5],[660,5],[33,6],[33,7]] , 
                            [[0,0],[0,0],[110,5],[4.6,6],[230,6],[230,7]] , 
                            [[0,0],[0,0],[800,5],[32,6],[1.6,7],[1.6,8]] ,
                            [[0,0],[0,0],[5.6,6],[220,6],[11,7],[11,8]] , 

                            [[0,0],[0,0],[39,6],[1.5,7],[79,7],[79,8]] , //Unit 4
                            [[0,0],[0,0],[270,6],[11,7],[550,7],[550,8]] , 
                            [[0,0],[0,0],[1.9,7],[78,7],[3.9,8],[3.9,9]] , 
                            [[0,0],[0,0],[13,7],[540,7],[27,8],[27,9]] , 
                            [[0,0],[0,0],[94,7],[3.8,8],[190,8],[190,9]] ,
                            [[0,0],[0,0],[660,7],[26,8],[1.3,9],[1.3,10]] , 

                            [[0,0],[0,0],[4.6,8],[180,8],[9.3,9],[9.3,10]] , //Unit 5
                            [[0,0],[0,0],[32,8],[1.3,9],[65,9],[65,10]] , 
                            [[0,0],[0,0],[220,8],[9.1,9],[450,9],[450,10]] , 

                            [[0,0],[0,0],[1.5,9],[64,9],[3.2,10],[3.2,11]] , //Unit 6
                            [[0,0],[0,0],[11,9],[450,9],[22,10],[22,11]] , 
                            [[0,0],[0,0],[78,9],[3.1,10],[150,10],[150,11]] , 
                            [[0,0],[0,0],[540,9],[22,10],[1.1,11],[1.1,12]] , 
                            [[0,0],[0,0],[3.8,10],[150,10],[7.7,11],[7.7,12]] , 

                            [[0,0],[0,0],[26,10],[1,11],[54,11],[54,12]] , //Unit 7
                            [[0,0],[0,0],[180,10],[7.5,11],[370,11],[370,12]] , 
                            [[0,0],[0,0],[1.3,11],[53,11],[2.6,12],[2.6,13]] , 
                            [[0,0],[0,0],[9.1,11],[370,11],[18,12],[18,13]] , 
                            [[0,0],[0,0],[64,11],[2.5,12],[120,12],[120,13]] ,
                            [[0,0],[0,0],[450,11],[18,12],[900,12],[900,13]] , 

                            [[0,0],[0,0],[3.1,12],[120,12],[6.3,13],[6.3,14]] , //Unit 8
                            [[0,0],[0,0],[22,12],[890,12],[44,13],[44,14]] , 
                            [[0,0],[0,0],[150,12],[6.2,13],[310,13],[310,14]] , 
                            [[0,0],[0,0],[1,13],[43,13],[2.1,14],[2.1,15]] , 
                            [[0,0],[0,0],[7.5,13],[300,13],[15,14],[15,15]] ,
                            [[0,0],[0,0],[53,13],[2.1,14],[100,14],[100,15]] , 
                            [[0,0],[0,0],[370,13],[14,14],[740,14],[740,15]] , 
                            [[0,0],[0,0],[2.5,14],[100,14],[5.2,15],[5.2,16]] , 

                            [[0,0],[0,0],[18,14],[730,14],[36,15],[36,16]] , //Unit 9
                            [[0,0],[0,0],[120,14],[5.1,15],[250,15],[250,16]] , 
                            [[0,0],[0,0],[890,14],[35,15],[1.7,16],[1.7,17]] , 
                            [[0,0],[0,0],[6.2,15],[250,15],[12,16],[12,17]] , 
                            [[0,0],[0,0],[43,15],[1.7,16],[88,16],[88,17]] , 
                            [[0,0],[0,0],[300,15],[12,16],[610,16],[610,17]] , 

                            [[0,0],[0,0],[2.1,16],[86,16],[4.3,17],[4.3,18]] , //Unit 10
                            [[0,0],[0,0],[14,16],[600,16],[30,17],[30,18]] , 
                            [[0,0],[0,0],[100,16],[4.2,17],[210,17],[210,18]] , 
                            [[0,0],[0,0],[730,16],[29,17],[1.4,18],[1.4,19]] , 
                            [[0,0],[0,0],[5.1,17],[200,17],[10,18],[10,19]] , 

                            [[0,0],[0,0],[35,17],[1.4,18],[72,18],[72,19]] , //Unit 11
                            [[0,0],[0,0],[250,17],[10,18],[500,18],[500,19]] , 
                            [[0,0],[0,0],[1.7,18],[71,18],[3.5,19],[3.5,20]] , 
                            [[0,0],[0,0],[12,18],[490,18],[24,19],[24,20]] , 
                            [[0,0],[0,0],[86,18],[3.4,19],[170,19],[170,20]] , 
                            [[0,0],[0,0],[600,18],[24,19],[1.2,20],[1.2,21]] , 
                            [[0,0],[0,0],[4.2,19],[170,19],[8.5,20],[8.5,21]] , 

                            [[0,0],[0,0],[29,19],[1.1,20],[59,20],[59,21]] , //Unit 12
                            [[0,0],[0,0],[200,19],[8.3,20],[410,20],[410,21]] , 
                            [[0,0],[0,0],[1.4,20],[58,20],[2.9,21],[2.9,22]] , 
                            [[0,0],[0,0],[10,20],[410,20],[20,21],[20,22]] , 

                            [[0,0],[0,0],[71,20],[2.8,21],[140,21],[140,22]] , //Unit 13
                            [[0,0],[0,0],[490,20],[20,21],[1,22],[1,23]] , 
                            [[0,0],[0,0],[7.4,21],[140,21],[7,22],[7,23]] , 
                            [[0,0],[0,0],[24,21],[980,21],[49,22],[49,23]] , 
                            [[0,0],[0,0],[170,21],[6.8,22],[340,22],[340,23]] , 
                            [[0,0],[0,0],[1.1,22],[48,22],[2.4,23],[2.4,24]] , 
                            [[0,0],[0,0],[8.3,22],[330,22],[16,23],[16,24]] ]
var canvasText = "<canvas id='xy-graph' width='428' height='240'>CANVAS NOT SUPPORTED IN THIS BROWSER!</canvas>"
var myString = ""
var numberAchievements = 0
var haveAchievement = Array(451).fill(0)
var initializeTime = Date.now
let achievementSound = new Audio('achievement.wav')
let unlockSound = new Audio('unlockunit.mp3')
let rightAnswer = new Audio('rightanswer.wav')
let wrongAnswer = new Audio('wrongAnswer.wav')
let greekKnowledge = new Audio('greekknowledge.mp3')
let greekRuby = new Audio('greekruby.mp3')
var slider = document.getElementById("soundVolume")
slider.oninput = function() {
  achievementSound.volume = 0.4 * this.value / 100
  unlockSound.volume = this.value / 100
  wrongAnswer.volume = this.value / 100
  greekRuby.volume = this.value / 100
}
var zi = [0,1001,1002,1003,1004,1005]
document.getElementById('aboutWindow').zIndex = 1001
document.getElementById('restoreWindow').zIndex = 1002
document.getElementById('achievementWindow').zIndex = 1003
document.getElementById('statsWindow').zIndex = 1004
document.getElementById('resetWindow').zIndex = 1005

addEventListener('unload', (event) => { }); 
onunload = (event) => {saveGame()}

let player = document.getElementById("player")
document.getElementById("playerSource").src = "Music/" + document.getElementById("musicSelect").value + ".mp3"
player.load()

document.getElementById("musicSelect").onchange = function() {playSelected()}
player.addEventListener('ended',function(){playNext()})
document.addEventListener('keypress', function (event) {
  if (event.key === " ") {
    event.preventDefault()
    if (purchasedMusicUpgrade[1] == true) {
      if (!player.paused) {
        player.pause()
      }
      else {
        player.play()
      }
    }
  }
})

const disableselect = (e) => {  
  return false  
}  
document.onselectstart = disableselect  

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function playSelected() {
  document.getElementById("playerSource").src = "Music/" + document.getElementById("musicSelect").value + ".mp3"
  player.load()
  player.play()
}

function playNext() {
  var x = document.getElementById("musicSelect").selectedIndex
  x++
  for (let i = 2; i < 6; i++) {
    if (x == 10 * (i-1) && purchasedMusicUpgrade[i] == false) {x = 0}
  }
  if (x == 50) {x = 0}
  document.getElementById("musicSelect").selectedIndex = x
  playSelected()
}

function about() {
  if (document.getElementById('aboutWindow').style.display == 'none') {
    document.getElementById('aboutWindow').style
      = 'position:absolute; display:block; left:4%; top: 4%; overflow-y: auto; height: 92%; width: 92%;'
    var div = document.getElementById('aboutWindow')
    reorderZ(zi,1)
    div.addEventListener("click",function(){reorderZ(zi,1)})
    window.onkeyup = function (event) {
      if (event.key === 'Escape') {
        escapeKey(zi)
        document.getElementById("aboutButton").blur()
      }
    }
  }
  else {
    document.getElementById('aboutWindow').style = 'display:none'
  }
  document.getElementById('aboutWindow').scrollTop = 0
  document.getElementById("aboutButton").blur()
}

function restore() {
  if (document.getElementById('restoreWindow').style.display == 'none') {
    document.getElementById('restoreWindow').style
      = 'position:absolute; display:block; left:22%; top: 12%; overflow-y: hidden; width: 27%'
    var div = document.getElementById('restoreWindow')
    reorderZ(zi,2)
    div.addEventListener("click",function(){reorderZ(zi,2)})
    window.onkeyup = function (event) {
      if (event.key === 'Escape') {
        escapeKey(zi)
        document.getElementById("openRestoreWindow").blur()
      }
    }
  }
  else {
    document.getElementById('restoreWindow').style = 'display:none'
  }
  document.getElementById("openRestoreWindow").blur()
}

function achievements() {
  if (document.getElementById('achievementWindow').style.display == 'none') {
    document.getElementById('achievementWindow').style
      = 'position:absolute; display:block; left:23.5%; top: 4%; overflow-y: auto; height: 75%;'
    var div = document.getElementById('achievementWindow')
    reorderZ(zi,3)
    div.addEventListener("click",function(){reorderZ(zi,3)})
    window.onkeyup = function (event) {
      if (event.key === 'Escape') {
        escapeKey(zi)
        document.getElementById("achieveButton").blur()
      }
    }
  }
  else {
    document.getElementById('achievementWindow').style = 'display:none'
  }
  document.getElementById('achievementWindow').scrollTop = 0
  document.getElementById("achieveButton").blur()
}

function stats() {
  if (document.getElementById('statsWindow').style.display == 'none') {
    document.getElementById('statsWindow').style
      = 'position:absolute; display:block; left:33%; top: 0.5%; overflow-y: auto; width: 25%'
    var div = document.getElementById('statsWindow')
    reorderZ(zi,4)
    div.addEventListener("click",function(){reorderZ(zi,4)})
    window.onkeyup = function (event) {
      if (event.key === 'Escape') {
        escapeKey(zi)
        document.getElementById("statsButton").blur()
      }
    }
  }
  else {
    document.getElementById('statsWindow').style = 'display:none'
  }
  document.getElementById('statsWindow').scrollTop = 0
  document.getElementById("statsButton").blur()
}

function reset() {
  if (document.getElementById('resetWindow').style.display == 'none') {
    document.getElementById('resetWindow').style
      = 'position:absolute; z-index:auto; display:block; left:74%; top: 4%; overflow-y: auto; width: 25%'
    var div = document.getElementById('resetWindow')
    reorderZ(zi,5)
    div.addEventListener("click",function(){reorderZ(zi,5); document.getElementById('confirmText').focus()})
    window.onkeyup = function (event) {
      if (event.key === 'Escape') {
        escapeKey(zi)
        document.getElementById("openResetWindow").blur()
      }
    }
  }
  else {
    document.getElementById('resetWindow').style = 'display:none'
    document.getElementById('confirmText').value = ''
  }
  document.getElementById("openResetWindow").blur()
}

function reorderZ(z,e) {
  z[e] = Math.max(z[1],z[2],z[3],z[4],z[5]) + 1
  for (let i = 1001; i < 1006; i++) {
    if ((z[1]-i)*(z[2]-i)*(z[3]-i)*(z[4]-i)*(z[5]-i) != 0) {
      var j = i //j is the index that is skipped, e.g. if z=[0,3,2,6,5,1], then j=3
    }
  }
  for (let i = j + 1; i < 1007; i++) {
    z[z.indexOf(i)] -= 1
  }
  document.getElementById('aboutWindow').style.zIndex = z[1]
  document.getElementById('restoreWindow').style.zIndex = z[2]
  document.getElementById('achievementWindow').style.zIndex = z[3]
  document.getElementById('statsWindow').style.zIndex = z[4]
  document.getElementById('resetWindow').style.zIndex = z[5]
}

function escapeKey(z) {
  var k = [0,1,2,3,4,5]
  for (let i = 1; i < 6; i++) {
    k[i] = z.indexOf(1000+i)
  }
  var div = [0, document.getElementById('aboutWindow'),
                document.getElementById('restoreWindow'),
                document.getElementById('achievementWindow'),
                document.getElementById('statsWindow'),
                document.getElementById('resetWindow')]
  if (div[k[5]].style.display == "none") {
    if (div[k[4]].style.display == "none") {
      if (div[k[3]].style.display == "none") {
        if (div[k[2]].style.display == "none") {
          if (div[k[1]].style.display == "none") {
          }
          else {
            div[k[1]].style = "display:none"
          }
        }
        else {
          div[k[2]].style = "display:none"
        }
      }
      else {
        div[k[3]].style = "display:none"
      }
    }
    else {
      div[k[4]].style = "display:none"
    }
  }
  else {
    div[k[5]].style = "display:none"
  }
}

function saveGame() {
  localStorage['gameData'] = encodeString(JSON.stringify(gameData));
  localStorage['costT'] = encodeString(JSON.stringify(costT));
  localStorage['kpsvector'] = encodeString(JSON.stringify(kpsvector));
  localStorage['numberCorrect'] = encodeString(JSON.stringify(numberCorrect));
  localStorage['numberCorrectCommas'] = encodeString(JSON.stringify(numberCorrectCommas));
  localStorage['numberCorrectUnit'] = encodeString(JSON.stringify(numberCorrectUnit));
  localStorage['kpsFromT'] = encodeString(JSON.stringify(kpsFromT));
  localStorage['levelT'] = encodeString(JSON.stringify(levelT));
  localStorage['purchasedMusicUpgrade'] = encodeString(JSON.stringify(purchasedMusicUpgrade));
  localStorage['upgradePurchased'] = encodeString(JSON.stringify(upgradePurchased));
  localStorage['gotGreek'] = encodeString(JSON.stringify(gotGreek));
  localStorage['gotGreekTotal'] = encodeString(JSON.stringify(gotGreekTotal));
}

function backup() {
  saveGame();
  var date = new Date();
  var dateYear = date.getFullYear();
  var dateMonth = date.getMonth() + 1;
  if (dateMonth < 10) {
    dateMonth = "0" + dateMonth
  }
  var dateDay = date.getDate();
  if (dateDay < 10) {
    dateDay = "0" + dateDay
  }
  var dateHour = date.getHours();
  if (dateHour < 10) {
    dateHour = "0" + dateHour
  }
  var dateMinute = date.getMinutes();
  if (dateMinute < 10) {
    dateMinute = "0" + dateMinute
  }
  var dateSecond = date.getSeconds();
  if (dateSecond < 10) {
    dateSecond = "0" + dateSecond
  }
  var dateMS = date.getMilliseconds();
  if (dateMS < 10) {
    dateMS = "00" + dateMS
  }
  else if (dateMS < 100) {
    dateMS = "0" + dateMS
  }
  var blob = new Blob([
    encodeString("mat101incrementalgamebackupfile" +
    JSON.stringify(gameData) + "_" +
    JSON.stringify(costT) + "_" +
    JSON.stringify(kpsvector) + "_" +
    JSON.stringify(numberCorrect) + "_" +
    JSON.stringify(numberCorrectCommas) + "_" +
    JSON.stringify(numberCorrectUnit) + "_" +
    JSON.stringify(kpsFromT) + "_" +
    JSON.stringify(levelT) + "_" +
    JSON.stringify(purchasedMusicUpgrade) + "_" +
    JSON.stringify(upgradePurchased) + "_" +
    JSON.stringify(gotGreek) + "_" +
    JSON.stringify(gotGreekTotal))
    ],{type: "text/plain;charset=utf-8"});
  saveAs(blob,"mat101backup" + dateYear + dateMonth + dateDay + "_" + dateHour + dateMinute + dateSecond + dateMS + ".txt");
    
}

function loadGame(input) {
  if (input.substring(0,31) != encodeString("mat101incrementalgamebackupfile")) {
    alert("This is not a valid save file.")
  }
  else {
    var string = input
    const sep = encodeOne("_")
    var thing1    = string.substring(31,string.indexOf(sep))
    var leftover1 = string.substring(string.indexOf(sep)+1)
    var thing2    = leftover1.substring(0,leftover1.indexOf(sep))
    var leftover2 = leftover1.substring(leftover1.indexOf(sep)+1)
    var thing3    = leftover2.substring(0,leftover2.indexOf(sep))
    var leftover3 = leftover2.substring(leftover2.indexOf(sep)+1)
    var thing4    = leftover3.substring(0,leftover3.indexOf(sep))
    var leftover4 = leftover3.substring(leftover3.indexOf(sep)+1)
    var thing5    = leftover4.substring(0,leftover4.indexOf(sep))
    var leftover5 = leftover4.substring(leftover4.indexOf(sep)+1)
    var thing6    = leftover5.substring(0,leftover5.indexOf(sep))
    var leftover6 = leftover5.substring(leftover5.indexOf(sep)+1)
    var thing7    = leftover6.substring(0,leftover6.indexOf(sep))
    var leftover7 = leftover6.substring(leftover6.indexOf(sep)+1)
    var thing8    = leftover7.substring(0,leftover7.indexOf(sep))
    var leftover8 = leftover7.substring(leftover7.indexOf(sep)+1)
    var thing9    = leftover8.substring(0,leftover8.indexOf(sep))
    var leftover9 = leftover8.substring(leftover8.indexOf(sep)+1)
    var thing10   = leftover9.substring(0,leftover9.indexOf(sep))
    var leftover10= leftover9.substring(leftover9.indexOf(sep)+1)
    var thing11   = leftover10.substring(0,leftover10.indexOf(sep))
    var leftover11= leftover10.substring(leftover10.indexOf(sep)+1)
    var thing12   = leftover11

    localStorage['gameData'] = thing1;
    localStorage['costT'] = thing2;
    localStorage['kpsvector'] = thing3;
    localStorage['numberCorrect'] = thing4;
    localStorage['numberCorrectCommas'] = thing5;
    localStorage['numberCorrectUnit'] = thing6;
    localStorage['kpsFromT'] = thing7;
    localStorage['levelT'] = thing8;
    localStorage['purchasedMusicUpgrade'] = thing9;
    localStorage['upgradePurchased'] = thing10;
    localStorage['gotGreek'] = thing11;
    localStorage['gotGreekTotal'] = thing12;
    for (let i = 1; i < 451; i++) {
      document.getElementById("achievement"+i).innerHTML = ""
      document.getElementById("achievement"+i).title = ""
      document.getElementById("achievement"+i).style.backgroundImage = "none"
      document.getElementById("achievement"+i).style.backgroundColor = "gray"
    }
    initialize();
    location.reload();
    document.getElementById('restoreWindow').style = 'position:absolute; z-index:1000; display:none'
  }
  document.getElementById("restoreFile").files[0] = "undefined"
}

function resetGame() {
  if (document.getElementById("confirmText").value == "confirm") {
    gameData = {
      knowledge: [0,0],
      cmKnowledge: [0,0],
      knowledgeCommas: 0,
      kps: [0,0],
      kpsCommas: 0,
      answer: 0,
      growthFactor: [1.2,0],
      typetag: 1,
      rubies: 0,
      rubyCost: 0,
      rubyBonus: 1,
      streak: 0,
      streakHighest: 0
    };
    costT = [[0,0], [5,0], [35,0], [240,0], [1.7,1], [12,1], [84,1], [580,1], [4.1,2],
              [28,2], [200,2], [1.4,3], [9.8,3], [69,3], [480,3],
              [3.3,4], [23,4], [160,4], [1.1,5], [8.1,5], [56,5],
              [390,5], [2.7,6], [19,6], [130,6], [950,6], [6.7,7],
              [46,7], [320,7], [2.2,8],
              [16,8], [110,8], [780,8], [5.5,9], [38,9],
              [270,9], [1.8,10], [13,10], [92,10], [640,10], [4.5,11],
              [31,11], [220,11], [1.5,12], [10,12], [76,12], [530,12], [3.7,13], [26,13],
              [180,13], [1.2,14], [8.9,14], [62,14], [440,14], [3,15],
              [21,15], [150,15], [1,16], [7.4,16], [51,16],
              [360,16], [2.5,17], [17,17], [120,17], [870,17], [6,18], [42,18],
              [290,18], [2,19], [14,19], [100,19],
              [710,19], [5,20], [35,20], [240,20], [1.7,21], [12,21], [84,21]];
    kpsvector = [[0,0], [1,0], [2,0], [8,0], [32,0], [64,0], [250,0], [1,1], [4,1],
              [370,1], [1.5,2], [6,2], [24,2], [95,2], [380,2],
              [45,3], [180,3], [700,3], [2.8,4], [11,4], [46,4],
              [5,5], [20,5], [80,5], [320,5], [1.2,6], [5,6],
              [600,6], [2.2,7], [8,7],
              [210,7], [800,7], [3.4,8], [13,8], [55,8],
              [3.6,9], [14,9], [55,9], [230,9], [900,9], [3.7,10],
              [420,10], [1.7,11], [6.5,11], [27,11], [100,11], [430,11], [1.7,12], [7,12],
              [2.4,13], [9.5,13], [38,13], [150,13], [600,13], [2.4,14],
              [270,14], [1.1,15], [4.4,15], [17,15], [70,15],
              [5,16], [20,16], [80,16], [320,16], [1.2,17], [5,17], [20,17],
              [3.9,18], [15,18], [60,18], [250,18],
              [9.5,19], [38,19], [150,19], [600,19], [2.4,20], [9.5,20], [38,20]]
    numberCorrect =       Array(costT.length).fill(0); //This just makes a zero vector with the same length as costT
    numberCorrectUnit =   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    numberCorrectCommas = Array(costT.length).fill(0); //This just makes a zero vector with the same length as costT
    kpsFromT =            Array(costT.length).fill([0,0]); //This just makes a zero vector with the same length as costT
    kpsPctFromT =         Array(costT.length).fill(0); //This just makes a zero vector with the same length as costT
    levelT =              Array(costT.length).fill(0);
    purchasedMusicUpgrade = [true,false,false,false,false,false];
    musicButtonAppear = [0, 0, 0, 0, 0, 0]
    upgradePurchased = [ [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false] ];
    gotGreek = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    gotGreekTotal = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    greekCurrent = ""
    haveAchievement = Array(451).fill(0)
    localStorage['gameData'] = "";
    localStorage['costT'] = "";
    localStorage['kpsvector'] = "";
    localStorage['numberCorrect'] = "";
    localStorage['numberCorrectCommas'] = "";
    localStorage['numberCorrectUnit'] = "";
    localStorage['kpsFromT'] = "";
    localStorage['levelT'] = "";
    localStorage['purchasedMusicUpgrade'] = "";
    localStorage['upgradePurchased'] = "";
    localStorage['gotGreek'] = "";
    localStorage['gotGreekTotal'] = "";
    upgradeArea.innerHTML = ""
    document.getElementById("mathProblem").innerHTML = ""
    document.getElementById("mathProblemType").innerHTML = ""
    document.getElementById("answerdiv").style.display = "none"
    for (let i = 1; i < 78; i++) {
      document.getElementById("buyT" + i + "cell").style.backgroundColor = ""
    }
    for (let i = 1; i < 451; i++) {
      document.getElementById("achievement"+i).innerHTML = ""
      document.getElementById("achievement"+i).title = ""
      document.getElementById("achievement"+i).style.backgroundImage = "none"
      document.getElementById("achievement"+i).style.backgroundColor = "gray"
    }
    initialize();
    document.getElementById('resetWindow').style = 'position:absolute; z-index:1000; display:none'
    document.getElementById("musicSelect").selectedIndex = 0
    player.pause()
  }
}

function makeDragable(dragHandle, dragTarget) {
  // used to prevent dragged object jumping to mouse location
  let xOffset = 0;
  let yOffset = 0;

  let handle = document.querySelector(dragHandle);
  handle.addEventListener("mousedown", startDrag, true);
  handle.addEventListener("touchstart", startDrag, true);

  /*sets offset parameters and starts listening for mouse-move*/
  function startDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    let dragObj = document.querySelector(dragTarget);
    
    // shadow element would take the original place of the dragged element, this is to make sure that every sibling will not reflow in the document
    let shadow = dragObj.cloneNode();
    shadow.id = ""
    // You can change the style of the shadow here
    shadow.style.opacity = 0.5
    dragObj.parentNode.insertBefore(shadow, dragObj.nextSibling);

    let rect = dragObj.getBoundingClientRect();
    dragObj.style.left = rect.left;
    dragObj.style.top = rect.top;
    dragObj.style.position = "absolute";
    dragObj.style.zIndex = 999999;

    /*Drag object*/
    function dragObject(e) {
      e.preventDefault();
      e.stopPropagation();
      if(e.type=="mousemove") {
        dragObj.style.left
        = e.clientX-xOffset + "px"; // adjust location of dragged object so doesn't jump to mouse position
        dragObj.style.top
        = e.clientY-yOffset + "px";
      } else if(e.type=="touchmove") {
        dragObj.style.left = e.targetTouches[0].clientX-xOffset +"px"; // adjust location of dragged object so doesn't jump to mouse position
        dragObj.style.top = e.targetTouches[0].clientY-yOffset +"px";
      }
    }
    /*End dragging*/
    document.addEventListener("mouseup", function() {
      // hide the shadow element, but still let it keep the room, you can delete the shadow element to let the siblings reflow if that is what you want
      shadow.style.opacity = 0
      shadow.style.zIndex = -999999
      window.removeEventListener('mousemove', dragObject, true);
      window.removeEventListener('touchmove', dragObject, true);
    }, true)

    if (e.type=="mousedown") {
      xOffset = e.clientX - rect.left; //clientX and getBoundingClientRect() both use viewable area adjusted when scrolling aka 'viewport'
      yOffset = e.clientY - rect.top;
      window.addEventListener('mousemove', dragObject, true);
    } else if(e.type=="touchstart") {
      xOffset = e.targetTouches[0].clientX - rect.left;
      yOffset = e.targetTouches[0].clientY - rect.top;
      window.addEventListener('touchmove', dragObject, true);
    }
  }
}

makeDragable('#handle1', '#restoreWindow')
makeDragable('#handle2', '#resetWindow')
makeDragable('#handle3', '#statsWindow')
makeDragable('#handle4', '#achievementWindow')
makeDragable('#handle5', '#aboutWindow')


function greek() {
  var i = Math.ceil(Math.random() * 24)
  greekCurrent = greekNames[i]
  var xp = 5 + Math.ceil(Math.random() * 83)
  var yp = 2 + Math.ceil(Math.random() * 86)
  var xpp = xp - 5
  document.getElementById("clickable").style.display = "block";
  document.getElementById("clickableButton").style.backgroundImage = "url('zgreek" + i + ".png')";
  document.getElementById("clickableButton").style.backgroundRepeat = "no-repeat";
  document.getElementById("clickableButton").style.backgroundSize = "2.08vw";
  document.getElementById("clickableButton").style.backgroundPosition = "center";
  document.getElementById("clickableButton").style.backgroundColor = "transparent";
  document.getElementById("clickable").style.left = xp + "%" //6 to 88
  document.getElementById("clickable").style.top =  yp + "%" //3 to 88
  document.getElementById("clickableRewardBox").style.left = xpp + "%" //1 to 83
  document.getElementById("clickableRewardBox").style.top =  yp + "%" //3 to 88
  setTimeout(function(){document.getElementById("clickable").style.display = "none"},60000)
}

function getGreek() {
  gotGreek[greekNames.indexOf(greekCurrent)] = 1
  gotGreekTotal[greekNames.indexOf(greekCurrent)] += 1
  document.getElementById("clickable").style.display = "none";
  type = Math.ceil(Math.random() * 25) //1 to 25
  document.getElementById("clickableRewardBox").style.display = "block"
  document.getElementById("clickableReward").style.textAlign = "center"
  document.getElementById("clickableReward").style.fontSize = "1.56vw"
  if (type == 1) {
    greekRuby.play()
    document.getElementById("clickableReward").innerHTML = "<b><font color=green>" + greekCurrent + "</font> has given you a ruby!<br>"
      + "<table style='margin:auto; background-color:rgba(0,0,0,0)'><tr><td>+1</td>" + 
      "<td><img src='ruby.png' style='width:2.08vw; height:1.56vw; display:inline-block; margin-top:0.52vw'></td></tr></table></font></b>"
    gameData.rubies++
    var oldFactor = gameData.rubyBonus;
    gameData.rubyBonus = Math.round((1 + gameData.rubies / 100) *100) / 100;
    var newFactor = gameData.rubyBonus / oldFactor;
    document.getElementById("rubies").style.fontSize = "2vw"
    document.getElementById("rubies").innerHTML = gameData.rubies;
    document.getElementById("totalKnowledge").innerHTML = convertKnowledge(gameData.knowledge);
    document.getElementById("rubyBonus").innerHTML = "(Base KPS x " + gameData.rubyBonus.toFixed(2) + ")";
    gameData.kps = multiply(gameData.kps,[newFactor,0]);
    document.getElementById("kps").innerHTML = "per second: " + convertNumber(gameData.kps) + " KPS"
    gameData.rubyCost = multiply(gameData.kps,[7.2,1]) //This is 2 hours of KPS
    document.getElementById("rubyCost").innerHTML = convertNumber(gameData.rubyCost)
    for (let i = 1; i < 78; i++) {
      kpsvector[i] = multiply(kpsvector[i],[newFactor,0])
      document.getElementById("kpsT"+i).innerHTML = "+" + convertNumber(kpsvector[i]) + " KPS"
      kpsFromT[i] = multiply([numberCorrect[i],0],kpsvector[i])
      document.getElementById("kpsFromT"+i).innerHTML = convertNumber(kpsFromT[i]) + " KPS"
    }
  }
  else {
    greekKnowledge.play()
    var minutes = Math.ceil(Math.random() * 5) //1-5 minutes
    var seconds = 60 * minutes
    var amt = multiply(gameData.kps,[seconds,0])
    document.getElementById("clickableReward").innerHTML = "<b><font color=green>" + greekCurrent
      + "</font> has blessed you with<br><font color=purple>"
      + convertNumber(amt) + " Knowledge!</font></b>"
    gameData.knowledge = add(gameData.knowledge,amt)
    document.getElementById("totalKnowledge").innerHTML = convertKnowledge(gameData.knowledge);
    gameData.cmKnowledge = add(gameData.cmKnowledge,amt)
  }
  setTimeout(function(){document.getElementById("clickableRewardBox").style.display = "none"},5000)
}

//This function will add two tuples [a[0],a[1]] and [b[0],b[1]]. A tuple [a[0],a[1]] is a representation of a large number
//  a[0] * 10^(3*a[1]). The a[1] tells you which multiple of 3 you are in. 
//  For example, [2.5,2] = 2,500,000 and [67.25,3] = 67,250,000,000.
//  So a[1] = 2 says you are in the millions, 3 in the billions, 4 in the trillions, etc.
function add(a,b) {
  var c = [0, 0]
  if (a[1] > b[1]) { //So a is the bigger number.
    //First we need to round a[0] off to have 14 sig figs. We wouldn't want a 15-sig-fig number to bump up to 16 after adding.
    if (a[0] < 10) { //So the integer part of a[0] has only 1 digit
      var ea = 13
    }
    else if (a[0] < 100) { //So the integer part of a[0] has 2 digits
      var ea = 12
    }
    else { //So the integer part of a[0] has 3 digits (Note: a[0] should never exceed 999.999999999999)
      var ea = 11
    }
    var a0 = Math.round(a[0] * 10 ** ea) / 10 ** ea
    //Now we need to round b[0] off so that when a and b are added, we end up with no more than 15 sig figs.
    //(Note: No matter how small b is, adding a and b could increase the number of sig figs of a by 1.)
    //We round b[0] so that when the decimal points of a and b are lined up, the last sig fig of b is not further to the right
    //  than the 14th digit (from L to R) of a.
    //Thus, when a and b are added, the result has no more than 15 sig figs.
    var eb = ea - 3 * (a[1] - b[1])
    var b0 = Math.round(b[0] * 10 ** eb) / 10 ** eb
    //Now we create the result.
    //First we add a[0] and the appropriately scaled b[0]
    c[0] = a0 + b0 / 10 ** (3 * (a[1] - b[1]))
    //Now we start with the assumption that c[1] = a[1].
    c[1] = a[1]
    //But in adding a and b, c[0] could be bigger than 1000, which would increase c[1] by 1.
    if (c[0] >= 1000) {
      c[0] /= 1000
      c[1] += 1
    }
    return c
  }
  else if (a[1] == b[1]) { //So a and b are of the same order of magnitude: both millions, both billions, etc.
    c[0] = a[0] + b[0]
    c[1] = a[1]
    if (c[0] >= 1000) {
      c[0] /= 1000
      c[1] += 1
    }
    return c
  }
  else { //So b is bigger than a. This is symmetric to first case.
    if (b[0] < 10) { //So the integer part of b[0] has only 1 digit
      var eb = 13
    }
    else if (b[0] < 100) { //So the integer part of b[0] has 2 digits
      var eb = 12
    }
    else { //So the integer part of b[0] has 3 digits (Note: b[0] should never exceed 999.999999999999)
      var eb = 11
    }
    var b0 = Math.round(b[0] * 10 ** eb) / 10 ** eb
    var ea = eb - 3 * (b[1] - a[1])
    var a0 = Math.round(a[0] * 10 ** ea) / 10 ** ea
    
    c[0] = b0 + a0 / 10 ** (3 * (b[1] - a[1]))
    c[1] = b[1]
    if (c[0] >= 1000) {
      c[0] /= 1000
      c[1] += 1
    }
    return c
  }
}

//To subtract two tuples, a must be larger than b. In this game, there is never a need to subtract a larger number from a smaller.
//Weird floating point errors can happen in certain examples of subtraction, so I'm sure there will be errors, but these will likely
//  be rounded out automatically.
function subtract(a,b) {
  var c = [0, 0]
  if (a[1] > b[1]) { //So a is the bigger number.
    if (a[0] < 10) { //So the integer part of a[0] has only 1 digit
      var ea = 14
    }
    else if (a[0] < 100) { //So the integer part of a[0] has 2 digits
      var ea = 13
    }
    else { //So the integer part of a[0] has 3 digits (Note: a[0] should never exceed 999.999999999999)
      var ea = 12
    }
    //We round b[0] so that when the decimal points of a and b are lined up, the last sig fig of b is not further to the right
    //  than the 15th digit (from L to R) of a.
    var eb = ea - 3 * (a[1] - b[1])
    b0new = Math.round(b[0] * 10 ** eb) / 10 ** eb
    //Now we create the result.
    //First we subtract the appropriately scaled b[0] from a[0].
    c[0] = a[0] - b0new / 10 ** (3 * (a[1] - b[1]))
    //Now we start with the assumption that c[1] = a[1].
    c[1] = a[1]
    //But in subtracting a and b, c[0] could be smaller than 1, which would decrease c[1].
    //For example, trillions minus trillions could be billions, millions, thousands, etc.
    while (c[0] < 1) {
      c[0] *= 1000
      c[1] -= 1
    }
    return c
  }
  else if (a[1] == b[1]) { //So a and b are of the same order of magnitude: both millions, both billions, etc.
    c[0] = a[0] - b[0]
    c[1] = a[1]
    if (a[0] < b[0]) {
      //console.log("You tried to subtract a larger from a smaller!")
      c = 0
    }
    else if (a[0] == b[0]) {
      c[0] = 0
      c[1] = 0
    }
    else {
      while (c[0] < 1) {
        c[0] *= 1000
        c[1] -= 1
      }
    }
    //c[0] = Math.round(c[0]) //Issue here. Starting with 20123 k and buying a T4 for 1000 k, you end up with 19000 k.
    return c
  }
  else {
    //console.log("You tried to subtract a larger from a smaller.")
    c = 0
    return c
  }
}

function multiply(a,b) {
  var c = [0, 0]
  c[0] = a[0] * b[0]
  c[1] = a[1] + b[1]
  while (c[0] < 1 && c[0] != 0) {
    c[0] *= 1000
    c[1] -= 1
  }
  while (c[0] >= 1000) {
    c[0] /= 1000
    c[1] += 1
  }
  c[0] = Math.round(c[0] * 10 ** 12) / 10 ** 12
  return c
}

function divide(a,b) {
  var c = [0, 0]
  var a0 = Math.round(a[0] * 10000) / 10000
  var b0 = Math.round(b[0] * 10000) / 10000
  c[0] = a0 / b0
  c[1] = a[1] - b[1]
  return c
}

//Now we need a way to convert a tuple into a readable number. For example [4.5869,2] = 4.587 M, [2,5] = 2.000 Qa
function convertNumber(a) {
  if (a[0] == 0) {
    return 0
  }
  else {
    if (abbr[a[1]] == "") {
      var x = Math.floor(a[0])
      return c = x
    }
    else if (abbr[a[1]] == "K") {
      var x = Math.floor(a[0] * 1000) / 1000
      var xf = x.toFixed(3).toString().replace(".",",")
      return c = xf
    }
    else {
      var x = Math.floor(a[0] * 1000) / 1000
      var xf = x//.toFixed(3)
      return c = xf + " " + abbr[a[1]]
    }
  }
}

function convertKnowledge(a) {
  if (a[1] < 0) {
    var x = Math.floor(a[0] / 1000)
    return c = x + " Knowledge"
  }
  else {
    if (abbr[a[1]] == "") {
      var x = Math.floor(a[0])
      return c = x + " Knowledge"
    }
    else if (abbr[a[1]] == "K") {
      var x = Math.floor(a[0] * 1000) / 1000
      var xf = x.toFixed(3).toString().replace(".",",")
      return c = xf + " Knowledge"
    }
    else {
      var x = Math.floor(a[0] * 1000) / 1000
      var xf = x.toFixed(3)
      return c = xf + " " + fullname[a[1]]
    }
  }
}

function encodeOne(symbol) {
  if (symbol == "a") {return "1"}
  if (symbol == "b") {return "S"}
  if (symbol == "c") {return "I"}
  if (symbol == "d") {return "+"}
  if (symbol == "e") {return ")"}
  if (symbol == "f") {return "w"}
  if (symbol == "g") {return "s"}
  if (symbol == "h") {return "x"}
  if (symbol == "i") {return "a"}
  if (symbol == "j") {return "Q"}
  if (symbol == "k") {return "p"}
  if (symbol == "l") {return "o"}
  if (symbol == "m") {return ";"}
  if (symbol == "n") {return "g"}
  if (symbol == "o") {return "Z"}
  if (symbol == "p") {return "k"}
  if (symbol == "q") {return "3"}
  if (symbol == "r") {return "c"}
  if (symbol == "s") {return "2"}
  if (symbol == "t") {return "|"}
  if (symbol == "u") {return ","}
  if (symbol == "v") {return "A"}
  if (symbol == "w") {return "!"}
  if (symbol == "x") {return "t"}
  if (symbol == "y") {return "%"}
  if (symbol == "z") {return "i"}
  if (symbol == "A") {return "0"}
  if (symbol == "B") {return "q"}
  if (symbol == "C") {return `"`}
  if (symbol == "D") {return ":"}
  if (symbol == "E") {return "9"}
  if (symbol == "F") {return "^"}
  if (symbol == "G") {return "L"}
  if (symbol == "H") {return "4"}
  if (symbol == "I") {return "v"}
  if (symbol == "J") {return "E"}
  if (symbol == "K") {return "6"}
  if (symbol == "L") {return "r"}
  if (symbol == "M") {return "j"}
  if (symbol == "N") {return "."}
  if (symbol == "O") {return "e"}
  if (symbol == "P") {return "@"}
  if (symbol == "Q") {return "O"}
  if (symbol == "R") {return "d"}
  if (symbol == "S") {return "W"}
  if (symbol == "T") {return "*"}
  if (symbol == "U") {return "]"}
  if (symbol == "V") {return "b"}
  if (symbol == "W") {return "P"}
  if (symbol == "X") {return "u"}
  if (symbol == "Y") {return "X"}
  if (symbol == "Z") {return "V"}
  if (symbol == "`") {return "8"}
  if (symbol == "1") {return "="}
  if (symbol == "2") {return "G"}
  if (symbol == "3") {return "Y"}
  if (symbol == "4") {return "'"}
  if (symbol == "5") {return "?"}
  if (symbol == "6") {return "N"}
  if (symbol == "7") {return "&"}
  if (symbol == "8") {return "`"}
  if (symbol == "9") {return "z"}
  if (symbol == "0") {return "{"}
  if (symbol == "-") {return "-"}
  if (symbol == "=") {return "F"}
  if (symbol == "~") {return "H"}
  if (symbol == "!") {return "M"}
  if (symbol == "@") {return ">"}
  if (symbol == "#") {return "U"}
  if (symbol == "$") {return "f"}
  if (symbol == "%") {return "$"}
  if (symbol == "^") {return "K"}
  if (symbol == "&") {return "R"}
  if (symbol == "*") {return "("}
  if (symbol == "(") {return "["}
  if (symbol == ")") {return "l"}
  if (symbol == "_") {return "5"}
  if (symbol == "+") {return "C"}
  if (symbol == "[") {return "#"}
  if (symbol == "]") {return "_"}
  if (symbol == ";") {return "m"}
  if (symbol == "'") {return "B"}
  if (symbol == ",") {return "7"}
  if (symbol == ".") {return "y"}
  if (symbol == "/") {return "~"}
  if (symbol == "{") {return "J"}
  if (symbol == "}") {return "h"}
  if (symbol == "|") {return "/"}
  if (symbol == ":") {return "}"}
  if (symbol == `"`) {return "D"}
  if (symbol == "<") {return "<"}
  if (symbol == ">") {return "T"}
  if (symbol == "?") {return "n"}
  else {return symbol}
}

function encodeString(string) {
  var myString = string
  var current = ""
  var suffix = ""
  for (let i = 0; i < string.length + 1; i++) {
    prefix = myString.substring(0,i)
    current = myString.substring(i,i+1)
    suffix = myString.substring(i+1)
    myString = prefix + encodeOne(current) + suffix
  }
  return myString
}

function decodeOne(symbol) {
  if (symbol == "a") {return "i"}
  if (symbol == "b") {return "V"}
  if (symbol == "c") {return "r"}
  if (symbol == "d") {return "R"}
  if (symbol == "e") {return "O"}
  if (symbol == "f") {return "$"}
  if (symbol == "g") {return "n"}
  if (symbol == "h") {return "}"}
  if (symbol == "i") {return "z"}
  if (symbol == "j") {return "M"}
  if (symbol == "k") {return "p"}
  if (symbol == "l") {return ")"}
  if (symbol == "m") {return ";"}
  if (symbol == "n") {return "?"}
  if (symbol == "o") {return "l"}
  if (symbol == "p") {return "k"}
  if (symbol == "q") {return "B"}
  if (symbol == "r") {return "L"}
  if (symbol == "s") {return "g"}
  if (symbol == "t") {return "x"}
  if (symbol == "u") {return "X"}
  if (symbol == "v") {return "I"}
  if (symbol == "w") {return "f"}
  if (symbol == "x") {return "h"}
  if (symbol == "y") {return "."}
  if (symbol == "z") {return "9"}
  if (symbol == "A") {return "v"}
  if (symbol == "B") {return "'"}
  if (symbol == "C") {return "+"}
  if (symbol == "D") {return `"`}
  if (symbol == "E") {return "J"}
  if (symbol == "F") {return "="}
  if (symbol == "G") {return "2"}
  if (symbol == "H") {return "~"}
  if (symbol == "I") {return "c"}
  if (symbol == "J") {return "{"}
  if (symbol == "K") {return "^"}
  if (symbol == "L") {return "G"}
  if (symbol == "M") {return "!"}
  if (symbol == "N") {return "6"}
  if (symbol == "O") {return "Q"}
  if (symbol == "P") {return "W"}
  if (symbol == "Q") {return "j"}
  if (symbol == "R") {return "&"}
  if (symbol == "S") {return "b"}
  if (symbol == "T") {return ">"}
  if (symbol == "U") {return "#"}
  if (symbol == "V") {return "Z"}
  if (symbol == "W") {return "S"}
  if (symbol == "X") {return "Y"}
  if (symbol == "Y") {return "3"}
  if (symbol == "Z") {return "o"}
  if (symbol == "`") {return "8"}
  if (symbol == "1") {return "a"}
  if (symbol == "2") {return "s"}
  if (symbol == "3") {return "q"}
  if (symbol == "4") {return "H"}
  if (symbol == "5") {return "_"}
  if (symbol == "6") {return "K"}
  if (symbol == "7") {return ","}
  if (symbol == "8") {return "`"}
  if (symbol == "9") {return "E"}
  if (symbol == "0") {return "A"}
  if (symbol == "-") {return "-"}
  if (symbol == "=") {return "1"}
  if (symbol == "~") {return "/"}
  if (symbol == "!") {return "w"}
  if (symbol == "@") {return "P"}
  if (symbol == "#") {return "["}
  if (symbol == "$") {return "%"}
  if (symbol == "%") {return "y"}
  if (symbol == "^") {return "F"}
  if (symbol == "&") {return "7"}
  if (symbol == "*") {return "T"}
  if (symbol == "(") {return "*"}
  if (symbol == ")") {return "e"}
  if (symbol == "_") {return "]"}
  if (symbol == "+") {return "d"}
  if (symbol == "[") {return "("}
  if (symbol == "]") {return "U"}
  if (symbol == ";") {return "m"}
  if (symbol == "'") {return "4"}
  if (symbol == ",") {return "u"}
  if (symbol == ".") {return "N"}
  if (symbol == "/") {return "|"}
  if (symbol == "{") {return "0"}
  if (symbol == "}") {return ":"}
  if (symbol == "|") {return "t"}
  if (symbol == ":") {return "D"}
  if (symbol == `"`) {return "C"}
  if (symbol == "<") {return "<"}
  if (symbol == ">") {return "@"}
  if (symbol == "?") {return "5"}
  else {return symbol}
}

function decodeString(string) {
  var myString = string
  var current = ""
  var suffix = ""
  for (let i = 0; i < string.length + 1; i++) {
    prefix = myString.substring(0,i)
    current = myString.substring(i,i+1)
    suffix = myString.substring(i+1)
    myString = prefix + decodeOne(current) + suffix
  }
  return myString
}

function reviewQuestion() {
  z = 0 //This lets the program know this is a review question.
  var j = Math.ceil(Math.random() * 5)
  if (j == 1) {
    var n = 2 + Math.ceil(Math.random() * 10)
    var m = 2 + Math.ceil(Math.random() * 10)
    document.getElementById("mathProblem").innerHTML = "Determine the missing exponent:<br>" + "`x^" + m + "/x^" + n + "=x^?`"
    answer = m - n
  }
  else if (j == 2) {
    var n = 2 + Math.ceil(Math.random() * 10)
    var m = 4 + Math.ceil(Math.random() * 5)
    document.getElementById("mathProblem").innerHTML = "Determine the missing exponent:<br>" + "`x^" + m + "*x^" + n + "=x^?`"
    answer = m + n
  }
  else if (j == 3) {
    var n = 2 + Math.ceil(Math.random() * 8)
    var m = 4 + Math.ceil(Math.random() * 5)
    document.getElementById("mathProblem").innerHTML = "Determine the missing exponent:<br>" + "`(x^" + m + ")^" + n + "=x^?`"
    answer = m * n
  }
  else if (j == 4) {
    var n = 1 + Math.ceil(Math.random() * 14)
    document.getElementById("mathProblem").innerHTML = "Determine the missing exponent:<br>" + "`1/x^" + n + "=x^?`"
    answer = -n
  }
  else if (j == 5) {
    var n = 1 + Math.ceil(Math.random() * 14)
    document.getElementById("mathProblem").innerHTML = "Determine the missing exponent:<br>" + "`1/x^-" + n + "=x^?`"
    answer = n
  }
  document.getElementById("mathProblemType").style.fontSize = "1.1vw"
  document.getElementById("mathProblemType").innerHTML = "<b>Basic Algebra Review Problem</b>"
  MathJax.Hub.Queue(["Typeset", MathJax.Hub, mathProblem]);
  document.getElementById("answerdiv").style.display = "inline-block"
  document.getElementById("checkButton").style.display = "block"
  document.getElementById("answer").focus()
  document.getElementById("answer").value = ""
  document.getElementById("feedback").innerHTML = ""
  document.getElementById("answer").readOnly = false
  document.getElementById("devAnswer").innerHTML = "Answer: " + answer
}

function buyQuestion(i) {
  z = 1 //This lets the program know this is not a review question.
  document.getElementById("beginningtip").innerHTML = "Reward: 1 Knowledge"
  if (subtract(gameData.knowledge,costT[i]) != 0) { //Remember we define the subtraction to be 0 if larger from smaller
    gameData.knowledge = subtract(gameData.knowledge,costT[i])
    document.getElementById("totalKnowledge").innerHTML = convertKnowledge(gameData.knowledge)
    document.getElementById("answerdiv").style.display = "inline-block"
    document.getElementById("checkButton").style = "display:block"
    if (i == 1) { //Evaluate function using graph
      var h = Math.ceil(Math.random() * 13) - 7
      var k = Math.ceil(Math.random() * 7) - 6
      var d = Math.ceil(Math.random() * 5) + h - 3
      var F = function(x) {return (x-h)**2 + k ;} ;
      document.getElementById("mathProblem").innerHTML =
        canvasText + "<br>Evaluate `f(" + d + ")`."
      plot(F);
      answer = eval((d-h)**2 + k)
    }
    else if (i == 2) { //Solve for x: mx+b=0
      var m = 1 + Math.ceil(Math.random() * 9)
      var b = Math.ceil(Math.random() * 10)
      document.getElementById("mathProblem").innerHTML = "Solve for `x`:<br>" + "`" + m + "x+" + b + "=0`"
      answer = eval(-b/m)
    }
    else if (i == 3) { //Solve for x:  ax-b=cx+d
      var a = 6 + Math.ceil(Math.random() * 5)
      var c = 2 + Math.ceil(Math.random() * 3)
      var b = Math.ceil(Math.random() * 10)
      var d = Math.ceil(Math.random() * 10)
      document.getElementById("mathProblem").innerHTML = "Solve for `x`:<br>" + "`" + a + "x-" + b + "=" + c + "x+" + d + "`"
      answer = eval((b+d)/(a-c))
    }
    else if (i == 4) { //Solve for x:  ax-b(c-x)=d+e(x+f)
      var a = 5 + Math.ceil(Math.random() * 5)
      var b = 5 + Math.ceil(Math.random() * 5)
      var e = 1 + Math.ceil(Math.random() * 7)
      var c = Math.ceil(Math.random() * 10)
      var d = Math.ceil(Math.random() * 10)
      var f = Math.ceil(Math.random() * 10)
      document.getElementById("mathProblem").innerHTML = "Solve for `x`:<br>" + "`" + a + "x-" + b + "(" + c + "-x)=" + d + "+" + e
        + "(x+" + f + ")`"
      answer = eval((d+e*f+b*c)/(a+b-e))
    }
    else if (i == 5) { //Given perimeter and relation between L and W, find L.
      var diff = 3 + Math.ceil(Math.random() * 7)
      var W = 3 + Math.ceil(Math.random() * 10)
      var L = W + diff
      var P = 2*L + 2*W
      document.getElementById("mathProblem").innerHTML = "Given that a rectangular pool is " + diff +
        " meters longer than it is wide, and its perimeter is " + P + " meters, find the length of the pool, in meters."
      answer = L
    }
    else if (i == 6) { //Evaluate f(d) if f(x)=ax+b
      var a = (2 * Math.ceil(Math.random() * 2) - 3) * (1 + Math.ceil(Math.random() * 6))
      var b = Math.ceil(Math.random() * 10)
      var d = Math.ceil(Math.random() * 11) - 6
      document.getElementById("mathProblem").innerHTML = "For the function<br>" + "`f(x)=" + a + "x+" + b + "`,<br>" +
        "evaluate `f(" + d + ")`."
      answer = eval(a*d+b)
    }
    else if (i == 7) { //Evaluate f(d) if f(x)=ax^2-bx+c
      var a = 1 + Math.ceil(Math.random() * 4)
      var b = 1 + Math.ceil(Math.random() * 6)
      var c = Math.ceil(Math.random() * 10)
      var d = Math.ceil(Math.random() * 7) - 4
      document.getElementById("mathProblem").innerHTML = "For the function<br>" + "`f(x)=" + a + "x^2-" + b + "x+" + c + "`,<br>" +
        "evaluate `f(" + d + ")`."
      answer = eval(a*d**2-b*d+c)
    }
    else if (i == 8) { //Find FV under simple interest
      var P = 1000*(4 + Math.ceil(Math.random() * 11))
      var r = Math.ceil(Math.random() * 5) * 0.005
      var R = 100*r
      var t = 3 + Math.ceil(Math.random() * 7)
      document.getElementById("mathProblem").innerHTML = "John invests $" + P + " at " + R + "% simple interest for " + t +
        " years. How much is in the account at the end of the " + t + "-year period?"
      answer = Math.round((P*(1+r*t)+Number.EPSILON)*100)/100
    }
    else if (i == 9) { //Identify slope from graph
      var b = Math.ceil(Math.random() * 11) - 6
      var N = Math.ceil(Math.random() * 11) - 6
      var D = Math.ceil(Math.random() * 10)
      var m = N/D
      var F = function(x) {return m*x + b ;} ;
      document.getElementById("mathProblem").innerHTML = "Determine the slope of the linear function:<br>" + canvasText
      plot(F);
      answer = m
    }
    else if (i == 10) { //Determine slope from standard form equation
      var A = 1 + Math.ceil(Math.random() * 8)
      var B = 1 + Math.ceil(Math.random() * 4)
      var C = Math.ceil(Math.random() * 11) - 6
      document.getElementById("mathProblem").innerHTML = "Determine the slope of the linear equation<br>" +
        "`" + A + "x+" + B + "y=" + C + "`"
      answer = -A/B
    }
    else if (i == 11) { //Determine slope of parallel/perpendicular line
      var type = Math.ceil(Math.random() * 3) //This can be 1, 2, or 3.
      var A = 1 + Math.ceil(Math.random() * 8)
      var B = 1 + Math.ceil(Math.random() * 4)
      var C = Math.ceil(Math.random() * 11) - 6
      if (type == 1) { // 33% chance of this happening
        document.getElementById("mathProblem").innerHTML = "Determine the slope of a line that is parallel to the line<br>" +
        "`" + A + "x+" + B + "y=" + C + "`"
        answer = -A/B
      } else { // 67% chance of this happening.
        document.getElementById("mathProblem").innerHTML = "Determine the slope of a line that is perpendicular to the line<br>" +
        "`" + A + "x+" + B + "y=" + C + "`"
        answer = B/A
      }
    }
    else if (i == 12) { //Determine y-intercept from slope and point
      var sgn = 2 * Math.ceil(Math.random() * 2) - 3 //This can be either 1 or -1.
      var D = 1 + Math.ceil(Math.random() * 3) //This can be either 2, 3, or 4.
      if (D == 4) {
        var N = sgn * (2 * Math.ceil(Math.random() * 2) - 1) //This can be -3, -1, 1, or 3.
      }
      else {
        var N = sgn * Math.ceil(Math.random() * (D-1)) //This lets N be smaller than D in magnitude, but not 0.
      }
      var m = N / D
      var x = D * Math.ceil(Math.random() * 3) //This lets x be D, 2D, or 3D so that no fractions appear in final answer.
      var y = Math.ceil(Math.random() * 19) - 10 //This lets y be from -9 to 9.
      document.getElementById("mathProblem").innerHTML = "The line having slope `" + N + "/" + D + "` and passing through the point `("
        + x + "," + y + ")` has an equation of the form `y=mx+b`. Determine the value for `b`."
      answer = y - m * x
    }
    else if (i == 13) { //Find the slope given two points
      var x1 = Math.ceil(Math.random() * 15) - 10
      var xdiff = Math.ceil(Math.random() * 7) - 1
      var x2 = x1 + xdiff
      var y1 = Math.ceil(Math.random() * 15) - 10
      var ydiff = Math.ceil(Math.random() * 15) - 8
      var y2 = y1 + ydiff
      document.getElementById("mathProblem").innerHTML = "Find the slope of the line passing through the points " +
        "`(" + x1 + "," + y1 + ")` and `(" + x2 + "," + y2 + ")`. If the slope is undefined, type DNE."
      if (x1 == x2) {
        answer = "DNE"
        answerString = 1
      } else {
        answer = (y2 - y1) / (x2 - x1)
      }
    }
    else if (i == 14) { //Find the y-intercept given two points
      var x1 = Math.ceil(Math.random() * 15) - 10
      var xdiff = Math.ceil(Math.random() * 6)
      var x2 = x1 + xdiff
      var y1 = Math.ceil(Math.random() * 15) - 10
      var ydiff = Math.ceil(Math.random() * 15) - 8
      var y2 = y1 + ydiff
      var m = (y2 - y1) / (x2 - x1)
      document.getElementById("mathProblem").innerHTML = "Find the `y`-intercept of the line passing through the points " +
        "`(" + x1 + "," + y1 + ")` and `(" + x2 + "," + y2 + ")`."
      answer = y1 - m * x1
    }
    else if (i == 15) { //Find solution of system graphically
      var x = Math.ceil(Math.random() * 19) - 10
      var y = Math.ceil(Math.random() * 9) - 5
      var N1 = Math.ceil(Math.random() * 5)
      var D1 = Math.ceil(Math.random() * 10)
      var m1 = N1/D1
      var b1 = y - m1 * x
      var N2 = - Math.ceil(Math.random() * 5)
      var D2 = Math.ceil(Math.random() * 10)
      var m2 = N2/D2
      var b2 = y - m2 * x
      var F1 = function(x) {return m1*x + b1 ;} ;
      var F2 = function(x) {return m2*x + b2 ;} ;
      document.getElementById("mathProblem").innerHTML = "Determine the solution to the graphed system of linear equations:<br>"
        + canvasText
      plot(F1);
      plot(F2);
      answer = "(" + x + "," + y + ")"
      answerString = 1
    }
    else if (i == 16) { //Simplify radical sqrt(2a^2) or sqrt(3a^2)
      var a = Math.ceil(Math.random() * 6) + 1
      var b = Math.ceil(Math.random() * 2) + 1
      var x = b * a ** 2
      document.getElementById("mathProblem").innerHTML = "Simplify `sqrt(" + x + ")`.<br>" +
        "<small> To enter a number like `6sqrt(7)`, you must type it as 6*sqrt(7).</small>"
      answer = a + "*sqrt(" + b + ")"
      answerString = 1
    }
    else if (i == 17) { //Simplify radical sqrt(-a^2)
      var a = Math.ceil(Math.random() * 11) + 1
      var x = - (a ** 2)
      document.getElementById("mathProblem").innerHTML = "Simplify `sqrt(" + x + ")`."
      answer = a + "i"
      answerString = 1
    }
    else if (i == 18) { //Solve ax^2 + b = c using square root property
      var a = Math.ceil(Math.random() * 4) + 1
      var b = Math.ceil(Math.random() * 21) + 10
      var x = Math.ceil(Math.random() * 9) + 1
      var c = a * x ** 2 + b
      document.getElementById("mathProblem").innerHTML = "Solve `" + a + "x^2+" + b + "=" + c + "` using the square root property.<br>"
        + "<small>You will get two answers. Enter both answers separated by a comma and no spaces.</small>"
      answer = [x + ",-" + x, "-" + x + "," + x]
      answerString = 2
    }
    else if (i == 19) { //Solve sqrt(x-a) + b = c
      var y = Math.ceil(Math.random() * 8) + 1
      var a = Math.ceil(Math.random() * 12) + 1
      var x = a + y ** 2 //Thus, sqrt(x-a) = y
      var b = Math.ceil(Math.random() * 21) + 10
      var c = y + b
      document.getElementById("mathProblem").innerHTML = "Solve `sqrt(x-" + a + ")+" + b + "=" + c + "`"
      answer = x
    }
    else if (i == 20) { //Solve |-2x+a|=b
      var a = 2 * Math.ceil(Math.random() * 5) - 1
      var diff = 2 * Math.ceil(Math.random() * 5)
      var b = a + diff
      var x1 = (a - b) / 2
      var x2 = (a + b) / 2
      document.getElementById("mathProblem").innerHTML = "Solve `|-2x+" + a + "|=" + b + "`<br>"
        + "<small>You will get two answers. Enter both answers separated by a comma and no spaces.</small>"
      answer = [x1 + "," + x2 , x2 + "," + x1]
      answerString = 2
    }
    else if (i == 21) { // Solve (n-a)(n+b)=0
      var a = Math.ceil(Math.random() * 10)
      var b = Math.ceil(Math.random() * 10)
      var x1 = a
      var x2 = - b
      document.getElementById("mathProblem").innerHTML = "Solve `(n-" + a + ")(n+" + b + ")=0`.<br>"
        + "<small>You will get two answers. Enter both answers separated by a comma and no spaces.</small>"
      answer = [x1 + "," + x2 , x2 + "," + x1]
      answerString = 2
    }
    else if (i == 22) { //Factor w^2 - a^2
      var a = 1 + Math.ceil(Math.random() * 14)
      var asq = a ** 2
      document.getElementById("mathProblem").innerHTML = "Completely factor the expression<br>`w^2-" + asq + "`."
      answer = ["(w-" + a + ")(w+" + a + ")" , "(w+" + a + ")(w-" + a + ")"]
      answerString = 2
    }
    else if (i == 23) { //Factor xy + ax - by - c by grouping
      var a = Math.ceil(Math.random() * 10)
      var b = Math.ceil(Math.random() * 10)
      var ab = a * b
      text = "Factor by grouping:<br>" + "`xy+" + b + "x-" + a + "y-" + ab + "`<br>"
      document.getElementById("mathProblem").innerHTML =
        text.replace("1x","x").replace("1y","y")
      answer = ["(x-" + a + ")(y+" + b + ")" , "(y+" + b + ")(x-" + a + ")"]
      answerString = 2
    }
    else if (i == 24) { //Solve x^2 + bx + c = 0
      var a = Math.ceil(Math.random() * 21) - 11 //This can be from -10 to 10
      if (a == 0) {a += 5} //If a=0, make it a=5.
      var b = Math.ceil(Math.random() * 21) - 11 //This can be from -10 to 10
      if (b == 0) {b -= 7} //If b=0, make it b=-7.
      if (b == a || b == -a) {b *= 2} //If b=a or b=-a, double b. This can't make b zero again.
      var c = a + b
      var d = a * b
      var x1 = - a
      var x2 = - b
      text = "Solve the equation:<br>" + "`x^2+" + c + "x+" + d + "=0`<br>"
      document.getElementById("mathProblem").innerHTML = text.replace("+-","-").replace("+-","-").replace("+1x","+x")
        .replace("-1x","-x")
      answer = [x1 + "," + x2 , x2 + "," + x1]
      answerString = 2
    }
    else if (i == 25) { //Solve ax^2 + bx + c = 0
      var a = 2 * Math.ceil(Math.random() * 2) //This can be 2 or 4
      var b = 2 * Math.ceil(Math.random() * 6) - 7 //This can be -5,-3,-1,1,3,5
      var c = Math.ceil(Math.random() * 13) - 7 //This can be from -6 to 6
      if (c == 0) {c += 2} //If c=0, add 2.
      var d = a * c + b
      var e = - b*c
      var nb = - b
      var x1 = - b / a
      var x2 = - c
      text = "Solve the equation:<br>" + "`" + a + "x^2+" + d + "x=" + e + "`<br>"
      document.getElementById("mathProblem").innerHTML = text.replace("+-","-").replace("+1x","+x").replace("-1x","-x")
      answer = [x1 + "," + x2 , x2 + "," + x1 , nb + "/" + a + "," + x2 , x2 + "," + nb + "/" + a]
      answerString = 2
    }
    else if (i == 26) { //Find width of rectangle given area and relationship between L and W
      var W = 4 + Math.ceil(Math.random() * 6)
      var diff = 2 + Math.ceil(Math.random() * 3)
      var L = W + diff
      var A = L * W
      var worl = Math.ceil(Math.random() * 2)
      if (worl == 1) {
        var word = "width"
        answer = W
      }
      else {
        var word = "length"
        answer = L
      }
      document.getElementById("mathProblem").innerHTML =
        "A rectangle is " + diff + " feet longer than it is wide. Find the <b>" + word + "</b> of the rectangle if its area is "
        + A + " square feet."
    }
    else if (i == 27) { //Is x+e a factor of a cubic
      // (x+a)(bx+c)(x-d)
      var a = Math.ceil(Math.random() * 6)
      var b = 1 + Math.ceil(Math.random() * 3)
      var c = Math.ceil(Math.random() * 11) - 6
      var d = Math.ceil(Math.random() * 8)
      var yorn = Math.ceil(Math.random() * 2)
      if (yorn == 1) { //This is an attempt to make the answer yes roughly half the time, maybe slightly more than half.
        var e = a
      }
      else {
        var e = a + 1
      }
      var f = - e
      var a1 = b
      var a2 = c - b * d + a * b
      var a3 = a * (c - b * d) - c * d
      var a4 = - a * c * d
      var text = "Is `(x+" + e + ")` a factor of `" + a1 + "x^3+" + a2 + "x^2+" + a3 + "x+" + a4 + "`?<br>" +
      "Answer yes or no."
      document.getElementById("mathProblem").innerHTML =
        text.replace("+-","-").replace("+-","-").replace("+-","-")
        .replace("+-","-").replace("+0x^2","").replace("+0x","").replace("+0","")
        .replace("+1x^2","+x^2").replace("-1x^2","-x^2").replace("+1x","+x").replace("-1x","-x")
      if (eval(a1 * f ** 3 + a2 * f ** 2 + a3 * f + a4) == 0) {
        answer = ["Yes","YES","yes"]
      }
      else {
        answer = ["No","NO","no"]
      }
      answerString = 2
    }
    else if (i == 28) { //Evaluate a cubic using the remainder theorem
      var a = 1 + Math.ceil(Math.random() * 3)
      var b = Math.ceil(Math.random() * 13) - 7
      if (b == 0) {b += 2}
      var c = Math.ceil(Math.random() * 13) - 7
      if (c == 0) {c += 2}
      var d = Math.ceil(Math.random() * 13) - 7
      if (d == 0) {d += 3}
      var x = Math.ceil(Math.random() * 7) - 4
      if (x == 0) {x -= 2}
      text = "Calculate `f(" + x + ")` using synthetic division <br>" +
        "and the Remainder Theorem:<br>" + "`f(x)=" + a + "x^3+" + b + "x^2+" + c + "x+" + d + "`"
      document.getElementById("mathProblem").innerHTML =
        text.replace("+1x^2","+x^2").replace("-1x^2","-x^2").replace("+1x","+x").replace("-1x","-x")
          .replace("+-","-").replace("+-","-").replace("+-","-")
      answer = a * x ** 3 + b * x ** 2 + c * x + d
    }
    else if (i == 29) { //Find zeros of a cubic
      //(ax+b)(x+c)(x+d) = (ax+b)(x^2 + (c+d)x + cd) = ax^3 + (a(c+d)+b)x^2 + (acd+b(c+d))x + bcd
      var a = 1 + Math.ceil(Math.random() * 3)
      var b = 2 * Math.ceil(Math.random() * 2) + 1
      if (b == a) {b -= 5}
      var c = Math.ceil(Math.random() * 11) - 6
      if (c == 0) {c += 3}
      var d = Math.ceil(Math.random() * 11) - 6
      if (d == 0) {d -= 2}
      if (d == c) {d *= 2}
      var a1 = a
      var a2 = a * (c + d) + b
      var a3 = a * c * d + b * (c + d)
      var a4 = b * c * d
      var bm = - b
      var cm = - c
      var dm = - d
      text = "Find the zeros of the cubic function<br>" + 
        "`f(x)=" + a + "x^3+" + b + "x^2+" + c + "x+" + d + "`.<br>" +
        "<small>Separate all three answers with commas and no spaces. Write fractions like -4/7.</small>"
      document.getElementById("mathProblem").innerHTML =
        text.replace("1x^2","x^2").replace("1x","x").replace("+-","-").replace("+-","-").replace("+-","-")
      answer = [ bm + "/" + a + "," + cm + "," + dm ,
                 bm + "/" + a + "," + dm + "," + cm ,
                 cm + "," + bm + "/" + a + "," + dm ,
                 cm + "," + dm + "," + bm + "/" + a ,
                 dm + "," + bm + "/" + a + "," + cm ,
                 dm + "," + cm + "," + bm + "/" + a]
      answerString = 2
    }
    else if (i == 30) { //Determine multiplicity of a zero based on factored form
      var a = (2 * Math.ceil(Math.random() * 2) - 3) * (1 + Math.ceil(Math.random() * 11)) //Can be -12 to 12, not -1,0,1
      var x = [0,0,0]
      var r = [0,0,0]
      x[0] = Math.ceil(Math.random() * 5) - 11 //Can be -10 to -6
      x[1] = Math.ceil(Math.random() * 5) - 6 //Can be -5 to -1
      x[2] = 1 + Math.ceil(Math.random() * 8) //Can be 2 to 9
      r[0] = Math.ceil(Math.random() * 9)
      r[1] = Math.ceil(Math.random() * 9)
      r[2] = Math.ceil(Math.random() * 9)
      var index = Math.ceil(Math.random() * 3) - 1
      text = "Given the function `f(x)=" + a + "(x-" + x[0] + ")^" + r[0] + "(x-" + x[1] + ")^" + r[1]
        + "(x-" + x[2] + ")^" + r[2] + "`,<br>"
        + "determine the multiplicity of the zero " + x[index] + "."
      document.getElementById("mathProblem").innerHTML =
        text.replace("--","+").replace("--","+").replace("--","+").replace("^1","").replace("^1","").replace("^1","")
      answer = r[index]
    }
    else if (i == 31) { //Write cubic polynomial with given roots and leading coefficient 1
      var x = [0,0,0]
      x[0] = Math.ceil(Math.random() * 5) - 11 //Can be -10 to -6
      x[1] = (2 * Math.ceil(Math.random() * 2) - 3) * Math.ceil(Math.random() * 5) //Can be -5 to 5, not 0
      x[2] = Math.ceil(Math.random() * 5) + 5 //Can be 6 to 10
      var x0 = - x[0]
      var text0 = "(x+" + x0 + ")"
      if (x[1] > 0) {
        var x1 = x[1]
        var text1 = "(x-" + x1 + ")"
      }
      else {
        var x1 = - x[1]
        var text1 = "(x+" + x1 + ")"
      }
      var x2 = x[2]
      var text2 = "(x-" + x2 + ")"
      document.getElementById("mathProblem").innerHTML =
        "Write an expression for a degree-3 polynomial having zeros " + x[0] + ", " + x[1] + ", and " + x[2]
        + ' and having leading coefficient 1. Leave the answer in factored form (without the "`f(x)=`").'
      answer = [ text0 + text1 + text2 ,
                 text0 + text2 + text1 ,
                 text1 + text0 + text2 ,
                 text1 + text2 + text0 ,
                 text2 + text0 + text1 ,
                 text2 + text1 + text0]
      answerString = 2
    }
    else if (i == 32) { //Find the complex conjugate of a+bi
      var a = Math.ceil(Math.random() * 17) - 9
      var b = Math.ceil(Math.random() * 17) - 9
      var text = "Write the complex conjugate of:<br> `" + a + "+" + b + "i`"
      document.getElementById("mathProblem").innerHTML =
        text.replace("0+0i","0").replace("+0i","").replace("0+","").replace("1i","i").replace("+-","-")
      var bm = - b
      if (a == 0) {
        if (b == 0) {
          answer = 0
        }
        else {
          var text2 = bm + "i"
          answer = text2.replace("1i","i")
        }
      }
      else {
        if (b == 0) {
          answer = a
        }
        else {
          var text2 = a + "+" + bm + "i"
          answer = text2.replace("+-","-").replace("1i","i")
        }
      }
      answerString = 1
    }
    else if (i == 33) { //Find rational and other zeros
      // (x^2 + a^2)(x - b) = x^3 - bx^2 + a^2 x - a^2 b
      var a = 1 + Math.ceil(Math.random() * 5)
      var asq = a ** 2
      var b = (2 * Math.ceil(Math.random() * 2) - 3) * Math.ceil(Math.random() * 5) // Between -5 and 5 but not 0
      var c = asq * b
      var text = "Find all rational and other zeros of the function:<br> `"
        + "f(x)=x^3-" + b + "x^2+" + asq + "x-" + c + "`.<br>"
        + "Separate your answers with commas and no spaces."
      document.getElementById("mathProblem").innerHTML =
        text.replace("1x^2","x^2").replace("--","+").replace("--","+")
      var x1 = b
      var x2 = a + "i"
      var ma = - a
      var x3 = ma + "i"
      answer = [ x1 + "," + x2 + "," + x3 ,
                 x1 + "," + x3 + "," + x2 ,
                 x2 + "," + x1 + "," + x3 ,
                 x2 + "," + x3 + "," + x1 ,
                 x3 + "," + x1 + "," + x2 ,
                 x3 + "," + x2 + "," + x1 ]
      answerString = 2
    }
    else if (i == 34) { //Solve rational equation, one solution, one extraneous
      var arr = [-8,-7,-6,-5,-4,-3,-2,-1,1,2,3,4,5,6,7,8]
      var arr2 = shuffleArray(arr)
      var a = arr2[1]
      var b = arr2[2]
      var c = arr2[3]
      var g = arr2[4]
      if (g == -a) {g++}
      var d = b + c - a - g
      var e = a * b - a * g
      var ac = a * c
      var apc = a + c
      var text = "Solve for `x`:<br> `"
        + "x/(x+" + a + ")+" + b + "/(x+" + c + ")=" + "(" + d + "x+" + e + ")/(x^2+" + apc + "x+" + ac + ")`.<br>"
        + "Separate multiple answers with a comma."
      document.getElementById("mathProblem").innerHTML =
        text.replace("+1x","+x").replace("-1x","-x").replace("1x","x").replace("-1x","-x")
          .replace("+-","-").replace("+-","-").replace("+-","-").replace("+-","-")
          .replace("+-","-").replace("+-","-").replace("+0x","")
      answer = - g
    }
    else if (i == 35) { //Compute the discriminant of ax^2 + c = bx
      var a = (2 * Math.ceil(Math.random() * 2) - 3) * Math.ceil(Math.random() * 8) //This can be -8 to 8, not 0
      var b = (2 * Math.ceil(Math.random() * 2) - 3) * Math.ceil(Math.random() * 8) //This can be -8 to 8, not 0
      var c = (2 * Math.ceil(Math.random() * 2) - 3) * Math.ceil(Math.random() * 8) //This can be -8 to 8, not 0
      var text = "Compute the discriminant of<br> `"
        + a + "x^2+" + c + "=" + b + "x`"
      document.getElementById("mathProblem").innerHTML =
        text.replace("1x","x").replace("1x","x").replace("+-","-")
      answer = b ** 2 - 4 * a * c
    }
    else if (i == 36) { //Solve using quadratic formula - complex solutions - integer real/im parts
      var a = (2 * Math.ceil(Math.random() * 2) - 3) * Math.ceil(Math.random() * 5) //This can be -5 to 5, not 0
      var b = 1 + Math.ceil(Math.random() * 6)
      var a2 = 2 * a
      var a2b2 = a ** 2 + b ** 2
      var text = "Use the quadratic formula to solve the equation<br> `"
        + "x^2-" + a2 + "x+" + a2b2 + "=0`<br>"
        + "Separate multiple answers with a comma and no spaces."
      document.getElementById("mathProblem").innerHTML =
        text.replace("--","+")
      answer = [ a + "+" + b + "i," + a + "-" + b + "i" , a + "-" + b + "i," + a + "+" + b + "i" ]
      answerString = 2
    }
    else if (i == 37) { //Time until projectile hits ground
      var b = (2 * Math.ceil(Math.random() * 2) - 3) * (4 + Math.ceil(Math.random() * 16)) //Can be +/- 5,...,20
      var c = 5 * Math.ceil(Math.random() * 11) + 45 //Can be 50,55,60,...,100
      //-16t^2 + bt + c = 0
      // t = (b + sqrt(b^2 + 64c))/32
      var text = "The height of a falling object is given by<br>"
        + "`h(t)=-16t^2+" + b + "t+" + c + "`, where `t` is measured in seconds.<br>"
        + "How long will it take the object to hit the ground?<br>"
        + "Round your answer to three decimal places."
      document.getElementById("mathProblem").innerHTML =
        text.replace("+-","-")
      answer = (b + (b ** 2 + 64 * c) ** 0.5)/32
    }
    else if (i == 38) { //End behavior of cubic or quartic
      var a = (2 * Math.ceil(Math.random() * 2) - 3) * Math.ceil(Math.random() * 8)
      var b = (2 * Math.ceil(Math.random() * 2) - 3) * Math.ceil(Math.random() * 8)
      var c = (2 * Math.ceil(Math.random() * 2) - 3) * Math.ceil(Math.random() * 8)
      var d = (2 * Math.ceil(Math.random() * 2) - 3) * Math.ceil(Math.random() * 8)
      var e = (2 * Math.ceil(Math.random() * 2) - 3) * Math.ceil(Math.random() * 8)
      var type = Math.ceil(Math.random() * 2)
      var inftype = Math.ceil(Math.random() * 2)
      if (inftype == 1) {
        var inf = "oo"
        var infm = "-oo"
      }
      else {
        var inf = "-oo"
        var infm = "oo"
      }
      if (type == 1) { //cubic
        var text = "In terms of end behavior, what should go in the blank?<br>"
          + "`f(x)=" + a + "x^3+" + b + "x^2+" + c + "x+" + d + "`<br>"
          + "As `x->" + inf + "`, `f(x)->`____<br>"
          + "(Type oo for `\infty`.)"
        if (a > 0) {
          answer = inf
        }
        else {
          answer = infm
        }
      }
      else { //quartic
        var text = "In terms of end behavior, what should go in the blank?<br>"
        + "`f(x)=" + a + "x^4+" + b + "x^3+" + c + "x^2+" + d + "x+" + e + "`<br>"
        + "As `x->" + inf + "`, `f(x)->`____<br>"
        + "(Type oo for `\infty`.)"
        if (a > 0) {
          answer = "oo"
        }
        else {
          answer = "-oo"
        }
      }
      document.getElementById("mathProblem").innerHTML =
        text.replace("+1x","+x").replace("+1x","+x").replace("+1x","+x").replace("+1x","+x")
          .replace("-1x","-x").replace("-1x","-x").replace("-1x","-x").replace("-1x","-x")  
          .replace("+-","-").replace("+-","-").replace("+-","-").replace("+-","-")
          .replace("1x^3","x^3")
      answerString = 1
    }
    else if (i == 39) { //Find vertex of quadratic using vertex formula
      var a = (2 * Math.ceil(Math.random() * 2) - 3) * Math.ceil(Math.random() * 3)
      var k = (2 * Math.ceil(Math.random() * 2) - 3) * Math.ceil(Math.random() * 4)
      var b = 2 * a * k
      var c = (2 * Math.ceil(Math.random() * 2) - 3) * Math.ceil(Math.random() * 8)
      var x = - b / (2 * a)
      var y = a * x ** 2 + b * x + c
      var text = "Find the vertex. Enter as an ordered pair `(x,y)` with no spaces.<br>"
        + "`y=" + a + "x^2+" + b + "x+" + c + "`"
      document.getElementById("mathProblem").innerHTML =
        text.replace("1x","x").replace("1x","x").replace("+-","-").replace("+-","-")
      answer = "(" + x + "," + y + ")"
      answerString = 1
    }
    else if (i == 40) { //Find max height of projectile using vertex formula
      var b = 100 + 5 * Math.ceil(Math.random() * 10)
      var c = 200 + 5 * Math.ceil(Math.random() * 20)
      var x = b / 9.8
      var y = -4.9 * x ** 2 + b * x + c
      var text = "An object was launched, and its height is given by<br>"
        + "`h(t)=-4.9t^2+" + b + "t+" + c + "`. Find the maximum height of the object. Round to the nearest tenth." 
      document.getElementById("mathProblem").innerHTML = text
      answer = y
    }
    else if (i == 41) { //Determine degree of polynomial from graph
      var array = [-6,-5,-4,-3,-2,-1,1,2,3,4,5,6]
      array = shuffleArray(array)
      var x1 = array[0]
      var x2 = array[1]
      var x3 = array[2]
      var x4 = array[3]
      var x5 = array[4]
      var n = 1 + Math.ceil(Math.random() * 4)
      var sgn = 2 * Math.ceil(Math.random() * 2) - 3
      if (n == 2) {
        g = function(x) {return 0.5*sgn*(x-x1)*(x-x2)}
      }
      else if (n == 3) {
        g = function(x) {return 0.05*sgn*(x-x1)*(x-x2)*(x-x3)}
      }
      else if (n == 4) {
        g = function(x) {return 0.02*sgn*(x-x1)*(x-x2)*(x-x3)*(x-x4)}
      }
      else {
        g = function(x) {return 0.01*sgn*(x-x1)*(x-x2)*(x-x3)*(x-x4)*(x-x5)}
      }
      document.getElementById("mathProblem").innerHTML = "Determine the most likely degree of the polynomial:<br>" + canvasText
      plot(g);
      answer = n
    }
    else if (i == 42) { //Determine degree of polynomial from factored formula
      var array = [-6,-5,-4,-3,-2,-1,1,2,3,4,5,6]
      array = shuffleArray(array)
      var x1 = array[0]
      if (x1 > 0) {x1 = 0}
      var x2 = array[1]
      var x3 = array[2]
      var x4 = array[3]
      var a = array[4]
      var b = 1 + Math.ceil(Math.random() * 2)
      var array2 = [1,2,3,4,5,6,7,8]
      array2 = shuffleArray(array2)
      var r1 = array2[0]
      var r2 = array2[1]
      var r3 = array2[2]
      var r4 = array2[3]
      var n = r1 + r2 + r3 + r4
      var text = "Determine the degree of the polynomial:<br>" +
        "`f(x)=" + a + "(x-" + x1 + ")^" + r1 + "(" + b + "x-" + x2 + ")^" + r2 + "(x-" + x3 + ")^" + r3 + "(x-" + x4 + ")^" + r4 + "`"
      document.getElementById("mathProblem").innerHTML =
        text.replace("(x-0)","x").replace("1x","x").replace("^1","").replace("1(","(").replace("--","+").replace("--","+")
          .replace("--","+").replace("--","+")
      answer = n
    }
    else if (i == 43) { //Find y-intercept of cubic from factored form.
      var array = [-4,-3,-2,-1,1,2,3,4]
      array = shuffleArray(array)
      var x1 = array[0]
      var x2 = array[1]
      var x3 = array[2]
      var a = array[3]
      var b = 1 + Math.ceil(Math.random() * 3)
      var y = a * x1 * x2 * x3
      var text = "Find the `y`-intercept of the polynomial:<br>" +
        "`f(x)=" + a + "(x+" + x1 + ")("  + b + "x+" + x2 + ")(x+" + x3 + ")`"
        + "<br>Write as an ordered pair `(x,y)` with no spaces."
      document.getElementById("mathProblem").innerHTML =
        text.replace("1(","(").replace("+-","-").replace("+-","-").replace("+-","-")
      answer = "(0," + y + ")"
      answerString = 1
    }
    else if (i == 44) { //Find max number of turning points
      var array = [-9,-8,-7,-6,-5,-4,-3,-2,-1,1,2,3,4,5,6,7,8,9]
      array = shuffleArray(array)
      var x1 = array[0]
      var x2 = array[1]
      var x3 = array[2]
      var x4 = array[3]
      var array2 = [1,2,3,4,5,6,7,8,9,10,11,12]
      array2 = shuffleArray(array2)
      var r1 = array2[0]
      var r2 = array2[1]
      var r3 = array2[2]
      var r4 = array2[3]
      var text = "There are at most how many turning points for the following polynomial?<br>" +
        "`f(t)=" + x1 + "t^" + r1 + "+" + x2 + "t^" + r2 + "+" + x3 + "t^" + r3 + "+" + x4 + "t^" + r4 + " `"
      document.getElementById("mathProblem").innerHTML =
        text.replace("^1+","+").replace("^1+","+").replace("^1+","+").replace("^1 ","").replace("1t","t")
          .replace("1t","t").replace("+-","-").replace("+-","-").replace("+-","-")
      answer = Math.max(r1,r2,r3,r4) - 1
    }
    else if (i == 45) { //Determine multiplicity of a zero from a graph
      var array = [-4,-3,-2,-1,1,2,3,4]
      array = shuffleArray(array)
      var c = array[0]
      var x1 = array[1]
      var x2 = array[2]
      var n = Math.ceil(Math.random() * 3)
      document.getElementById("mathProblem").innerHTML = "The graph below depicts a polynomial. Determine the " + 
        "most likely multiplicity of the zero " + c + ":<br>" + canvasText
      g = function(x) {return (x-c)**n * (x-x1) * (x-x2)}
      plot(g)
      answer = n
    }
    else if (i == 46) { //Determine center and radius of circle given equation
      var array = [-4,-3,-2,-1,1,2,3,4]
      array = shuffleArray(array)
      var h = array[0]
      var k = array[1]
      var r = 1 + Math.ceil(Math.random() * 11)
      var rsq = r ** 2
      var n = Math.ceil(Math.random() * 3)
      var text = "Consider the circle having the equation<br>"
        + "`(x-" + h + ")^2+(y-" + k + ")^2=" + rsq + "`<br>"
        + "Determine the center and radius, separating them with a comma and no spaces.<br>"
        + "For example, you can write <font color=red>(7,-8),15</font>"
      document.getElementById("mathProblem").innerHTML = text.replace("--","+").replace("--","+")
      answer = "(" + h + "," + k + ")," + r
      answerString = 1
    }
    else if (i == 47) { //Determine midpoint of two points
      var x = Math.ceil(Math.random() * 21) - 11
      var y = Math.ceil(Math.random() * 21) - 11
      var diffx = (2 * Math.ceil(Math.random() * 2) - 3) * Math.ceil(Math.random() * 9)
      var diffy = (2 * Math.ceil(Math.random() * 2) - 3) * Math.ceil(Math.random() * 9)
      var x1 = x - diffx
      var y1 = y - diffy
      var x2 = x + diffx
      var y2 = y + diffy
      var text = "Determine the midpoint of the line segment from " + "`(" + x1 + "," + y1 + ")` and `(" + x2 + "," + y2 + ")`. "
        + "(Do not include any spaces in your answer.)"
      document.getElementById("mathProblem").innerHTML = text
      answer = "(" + x + "," + y + ")"
      answerString = 1
    }
    else if (i == 48) { //Determine distance between two points
      var array = [-5,-4,-3,-2,-1,0,1,2,3,4,5]
      array = shuffleArray(array)
      var x1 = array[0]
      var x2 = array[1]
      var y1 = array[2]
      var y2 = array[3]
      var text = "Determine the distance between the points " + "`(" + x1 + "," + y1 + ")` and `(" + x2 + "," + y2 + ")`. "
        + "Round to three decimal places."
      document.getElementById("mathProblem").innerHTML = text
      answer = ((x2-x1) ** 2 + (y2-y1) ** 2) ** 0.5
    }
    else if (i == 49) { //Solve ax+b INEQUALITY cx+d
      var a = Math.ceil(Math.random() * 12)
      var diff1 = (2 * Math.ceil(Math.random() * 2) - 3) * (1 + Math.ceil(Math.random() * 8))
      var c = a - diff1
      while (c == 0) {
        diff1 = (2 * Math.ceil(Math.random() * 2) - 3) * (1 + Math.ceil(Math.random() * 8))
        c = a - diff1
      }
      var b = (2 * Math.ceil(Math.random() * 2) - 3) * Math.ceil(Math.random() * 24)
      var k = (2 * Math.ceil(Math.random() * 2) - 3) * Math.ceil(Math.random() * 4)
      var diff2 = diff1 * k
      var d = b + diff2
      while (d == 0) {
        k = (2 * Math.ceil(Math.random() * 2) - 3) * Math.ceil(Math.random() * 4)
        diff2 = diff1 * k
        d = b + diff2
      }
      var type = Math.ceil(Math.random() * 4)
      if (type == 1) { // <
        var ineq = "<"
        if (a > c) {
          answer = "(-oo," + k + ")"
        }
        else {
          answer = "(" + k + ",oo)"
        }
      }
      else if (type == 2) { // <=
        var ineq = "<="
        if (a > c) {
          answer = "(-oo," + k + "]"
        }
        else {
          answer = "[" + k + ",oo)"
        }
      }
      else if (type == 3) { // >
        var ineq = ">"
        if (a > c) {
          answer = "(" + k + ",oo)"
        }
        else {
          answer = "(-oo," + k + ")"
        }
      }
      else { // >=
        var ineq = ">="
        if (a > c) {
          answer = "[" + k + ",oo)"
        }
        else {
          answer = "(-oo," + k + "]"
        }
      }
      var text = "Solve the inequality `" + a + "x+" + b + ineq + c + "x+" + d + "`.<br>"
        + "Write your answer in interval notation with no spaces. Use oo for `infty`."
      document.getElementById("mathProblem").innerHTML = text.replace("+-","-").replace("+-","-").replace("1x","x").replace("1x","x")
        .replace(">-","> -")
      answerString = 1
    }
    else if (i == 50) { //Find domain and range from graph
      var a = 2 * Math.ceil(Math.random() * 2) - 3
      var h = Math.ceil(Math.random() * 11) - 6
      var k = a * (Math.ceil(Math.random() * 7) - 6)
      var type = Math.ceil(Math.random() * 2)
      var text = "Determine the domain and range of the following function. Write both in interval notation, "
        + "separate with commas, and do not use spaces! For example, [4,oo),(-oo,3).<br>"
        + canvasText
      document.getElementById("mathProblem").innerHTML = text
      if (type == 1) {
        var x1 = h - 1 + 0.08
        var x0 = h - 1
        var y0 = a + k
        g = function(x) {
          if (x > x1) {
            return a * (x - h) ** 2 + k
          } else {stop}
        }
        if (a == 1) {
          answer = "(" + x0 + ",oo),[" + k + ",oo)"
        } else {
          answer = "(" + x0 + ",oo),(-oo," + k + "]"
        }
      } else {
        var x1 = h + 1 - 0.08
        var x0 = h + 1
        var y0 = a + k
        g = function(x) {
          if (x < x1) {
            return a * (x - h) ** 2 + k
          } else {stop}
        }
        if (a == 1) {
          answer = "(-oo," + x0 + "),[" + k + ",oo)"
        } else {
          answer = "(-oo," + x0 + "),(-oo," + k + "]"
        }
      }
      plot(g)
      plotOpenCircle(x0,y0)
      answerString = 1
    }
    else if (i == 51) { //Is relation given as set of ordered pairs a function?
      var array = shuffleArray([11,12,13,14,15,16,17,18])
      var x1 = array[0]
      var x2 = array[1]
      var x3 = array[2]
      var x4 = array[3]
      var x5 = 10 + Math.ceil(Math.random() * 8)
      var array2 = shuffleArray([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20])
      var y1 = array2[0]
      var y2 = array2[1]
      var y3 = array2[2]
      var y4 = array2[3]
      var y5 = array2[4]
      var check = (x5-x1)*(x5-x2)*(x5-x3)*(x5-x4)
      var text = "The relation `S` is given below:<br>"
        + "`S={(" + x1 + "," + y1 + "),(" + x2 + "," + y2 + "),(" + x3 + "," + y3 + "),(" + x4 + "," + y4
        + "),(" + x5 + "," + y5 + ")}`<br>Is the relation a function? Type yes or no."
      document.getElementById("mathProblem").innerHTML = text
      if (check == 0) {answer = ["No","no","NO"]}
      else {answer = ["Yes","yes","YES"]}
      answerString = 2
    }
    else if (i == 52) { //Find domain or range of set of ordered pairs
      var array = shuffleArray([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20])
      var x1 = array[0]
      var x2 = array[1]
      var x3 = array[2]
      var x4 = array[3]
      var x5 = array[4]
      var array2 = shuffleArray([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20])
      var y1 = array2[0]
      var y2 = array2[1]
      var y3 = array2[2]
      var y4 = array2[3]
      var y5 = array2[4]
      var type = Math.ceil(Math.random() * 2)
      if (type == 1) {
        var word = "domain"
        answer = "{" + x1 + "," + x2 + "," + x3 + "," + x4 + "," + x5 + "}"
      } else {
        var word = "range"
        answer = "{" + y1 + "," + y2 + "," + y3 + "," + y4 + "," + y5 + "}"
      }
      var text = "The relation `S` is given below:<br>"
        + "`S={(" + x1 + "," + y1 + "),(" + x2 + "," + y2 + "),(" + x3 + "," + y3 + "),(" + x4 + "," + y4
        + "),(" + x5 + "," + y5 + ")}`<br>Find the " + word + " of the relation. "
        + "Remember to enclose the elements in curly braces { }, separating them with commas and no spaces. " 
        + "Write the elements of the " + word + " in the order that you see them listed in the relation."
      document.getElementById("mathProblem").innerHTML = text
      answerString = 1
    }
    else if (i == 53) { //Find third test score to ensure minimum average
      var array = shuffleArray([70,71,72,73,74,75,76,77,78,79,80])
      var x1 = array[0]
      var x2 = array[1]
      var avg = 80 + Math.ceil(Math.random() * 10)
      var text = "John made a " + x1 + " and a " + x2 + " on his first two English tests. What is the minimum score "
        + "that he needs to make on his third test to get an average of at least " + avg + "? (Note: It could be over 100.)"
      document.getElementById("mathProblem").innerHTML = text
      answer = 3 * avg - x1 - x2
    }
    else if (i == 54) { //Evaluate piecewise function
      var m1 = Math.ceil(Math.random() * 3)
      var m2 = - Math.ceil(Math.random() * 3) - 1
      var b1 = (2 * Math.ceil(Math.random() * 2) - 3) * Math.ceil(Math.random() * 7)
      var b2 = (2 * Math.ceil(Math.random() * 2) - 3) * Math.ceil(Math.random() * 7)
      var c = Math.ceil(Math.random() * 7) - 4
      var x = c + (2 * Math.ceil(Math.random() * 2) - 3) * Math.ceil(Math.random() * 2)
      var text = "Evaluate `f(" + x + ")` for the piecewise function<br>"
        + "`f(x)={(" + m1 + "x+" + b1 + ",if x<=" + c + "),(" + m2 + "x+" + b2 + ",if x>" + c + "):}`"
      document.getElementById("mathProblem").innerHTML = text.replace("1x","x").replace("1x","x").replace("+-","-").replace("+-","-")
        .replace(">-","> -")
      if (x <= c) {
        answer = m1 * x + b1
      } else {
        answer = m2 * x + b2
      }
    }
    else if (i == 55) { //Determine if even, odd, or neither
      var type = Math.ceil(Math.random() * 3)
      var text = "Determine if the function graphed below is even, odd, or neither.<br>"
        + canvasText
      document.getElementById("mathProblem").innerHTML = text
      if (type == 1) { //even
        var a = (2 * Math.ceil(Math.random() * 2) - 3) * Math.ceil(Math.random() * 2)
        var n = 2 * Math.ceil(Math.random() * 2)
        var k = (2 * Math.ceil(Math.random() * 2) - 3) * Math.ceil(Math.random() * 3)
        g = function(x) {return a * x ** n + k}
        plot(g)
        answer = ["Even","EVEN","even"]
      }
      else if (type == 2) { //odd
        var a = (2 * Math.ceil(Math.random() * 2) - 3) * Math.ceil(Math.random() * 2)
        var n = 2 * Math.ceil(Math.random() * 3) - 1
        g = function(x) {return a * x ** n}
        plot(g)
        answer = ["Odd","ODD","odd"]
      }
      else { //neither
        var a = (2 * Math.ceil(Math.random() * 2) - 3) * Math.ceil(Math.random() * 2)
        var n = Math.ceil(Math.random() * 5)
        var h = (2 * Math.ceil(Math.random() * 2) - 3) * (2 + Math.ceil(Math.random() * 5))
        var k = (2 * Math.ceil(Math.random() * 2) - 3) * Math.ceil(Math.random() * 3)
        g = function(x) {return a * (x - h) ** n + k}
        plot(g)
        answer = ["Neither","NEITHER","neither"]
      }
      answerString = 2
    }
    else if (i == 56) { //Which parent function does the graph depict?
      var type = Math.ceil(Math.random() * 8)
      if (type == 1) {
        g = function(x) {return x ** 0.5}
        answer = ["A","a"]
      }
      else if (type == 2) {
        g = function(x) {return x}
        answer = ["B","b"]
      }
      else if (type == 3) {
        g = function(x) {return Math.abs(x)}
        answer = ["C","c"]
      }
      else if (type == 4) {
        g = function(x) {return 1 / x}
        answer = ["D","d"]
      }
      else if (type == 5) {
        g = function(x) {return Math.cbrt(x)}
        answer = ["E","e"]
      }
      else if (type == 6) {
        g = function(x) {return x ** 3}
        answer = ["F","f"]
      }
      else if (type == 7) {
        g = function(x) {return x ** 2}
        answer = ["G","g"]
      }
      else {
        g = function(x) {return 1 / x ** 2}
        answer = ["H","h"]
      }
      var text = "Which parent function does the graph depict? Type in the letter of the answer choice.<br>"
        + canvasText
        + "<br>A. `y=sqrt(x)` &nbsp; B. `y=x` &nbsp; C. `y=|x|` &nbsp; D. `y=1/x`<br>"
        + "E. `y=root[3](x)` &nbsp; F. `y=x^3` &nbsp; G. `y=x^2` &nbsp; H. `y=1/x^2`<br>"
      document.getElementById("mathProblem").innerHTML = text
      plot(g)
      answerString = 2
    }
    else if (i == 57) { //Determine direction of translation
      var c = 5 + Math.ceil(Math.random() * 21)
      var type = Math.ceil(Math.random() * 4)
      if (type == 1) { //right
        var eqn = "`y=f(x-" + c + ")`"
        answer = ["Right","RIGHT","right"]
      }
      else if (type == 2) { //left
        var eqn = "`y=f(x+" + c + ")`"
        answer = ["Left","LEFT","left"]
      }
      else if (type == 3) { //up
        var eqn = "`y=f(x)+" + c + "`"
        answer = ["Up","UP","up"]
      }
      else { //down
        var eqn = "`y=f(x)-" + c + "`"
        answer = ["Down","DOWN","down"]
      }
      var text = "The graph of " + eqn + " can be obtained from the graph of `y=f(x)` by shifting it "
        + c + " units in what direction (left, right, up, or down)?"
      document.getElementById("mathProblem").innerHTML = text
      answerString = 2
    }
    else if (i == 58) { //Determine function formula after translation
      var a = 2 * Math.ceil(Math.random() * 2) - 3
      var h = (2 * Math.ceil(Math.random() * 2) - 3) * Math.ceil(Math.random() * 5)
      var k = a * (Math.ceil(Math.random() * 7) - 6)
      g = function(x) {return a * (x - h) ** 2 + k}
      var text = "Write the equation of the following transformation of `y=x^2`:<br>"
        + canvasText
        + "<br>For example, for `y=-(x-1)^2-1`, type y=-(x-1)^2-1 (no spaces!)."
      document.getElementById("mathProblem").innerHTML = text
      plot(g)
      if (k == 0) {
        var answertext = "y=" + a + "(x-" + h + ")^2"
      }
      else {
        var answertext = "y=" + a + "(x-" + h + ")^2+" + k
      }
      answer = answertext.replace("1(","(").replace("--","+").replace("+-","-")
      answerString = 1
    }
    else if (i == 59) { //Given a point on a graph, determine a point on a transformed graph
      var array = shuffleArray([-4,-3,-2,-1,0,1,2,3,4])
      var x = array[0]
      var y = array[1]
      var c = array[2]
      if (c == 0) {c = 3}
      var type = Math.ceil(Math.random() * 6)
      if (type == 1) { //reflect over x axis
        var eqn = "`g(x)=-f(x)`"
        var my = - y
        answer = "(" + x + "," + my + ")"
      }
      if (type == 2) { //horizontal translation
        var eqntext = "`g(x)=f(x-" + c + ")`"
        var eqn = eqntext.replace("--","+")
        var newx = x + c
        answer = "(" + newx + "," + my + ")"
      }
      if (type == 3) { //vertical shrink
        var k = 1 + Math.ceil(Math.random() * 3)
        y *= k
        var newy = y / k
        var eqn = "`g(x)=1/" + k + " f(x)`"
        answer = "(" + x + "," + newy + ")"
      }
      if (type == 4) { //vertical translation
        var eqntext = "`g(x)=f(x)+" + c + "`"
        var newy = y + c
        var eqn = eqntext.replace("+-","-")
        answer = "(" + x + "," + newy + ")"
      }
      if (type == 5) { //reflect over y axis
        var mx = - x
        var eqn = "`g(x)=f(-x)`"
        answer = "(" + mx + "," + y + ")"
      }
      else { //vertical stretch
        var k = 1 + Math.ceil(Math.random() * 3)
        var newy = y * k
        var eqn = "`g(x)=" + k + " f(x)`"
        answer = "(" + x + "," + newy + ")"
      }
      var text = "The point `(" + x + "," + y + ")` is on the graph of `y=f(x)`. Determine a point on the graph of `y=g(x)`, where "
        + eqn + "."
      document.getElementById("mathProblem").innerHTML = text
      answerString = 1
    }
    else if (i == 60) { //Find domain of sqrt(ax+b)
      var a = (2 * Math.ceil(Math.random() * 2) - 3) * (1 + Math.ceil(Math.random() * 5))
      var k = (2 * Math.ceil(Math.random() * 2) - 3) * (1 + Math.ceil(Math.random() * 4))
      var b = - a * k
      if (a > 0) {
        answer = "[" + k + ",oo)"
      }
      else {
        answer = "(-oo," + k + "]"
      }
      var text = "Find the domain of the function `f(x)=sqrt(" + a + "x+" + b + ")`. Write your answer in interval notation, using "
        + "oo for `infty`."
      document.getElementById("mathProblem").innerHTML = text.replace("+-","-")
      answerString = 1
    }
    else if (i == 61) { //Evaluate sum/diff/prod/quot of functions at a point
      var a = (2 * Math.ceil(Math.random() * 2) - 3) * (1 + Math.ceil(Math.random() * 5))
      var b = (2 * Math.ceil(Math.random() * 2) - 3) * (1 + Math.ceil(Math.random() * 4))
      var c = (2 * Math.ceil(Math.random() * 2) - 3) * (2 + Math.ceil(Math.random() * 4))
      var x = (2 * Math.ceil(Math.random() * 2) - 3) * Math.ceil(Math.random() * 2)
      var fx = x ** 2 + a * x + b
      var gx = x + c
      var type = Math.ceil(Math.random() * 4)
      if (type == 1) {
        var eqn = "`(f+g)(" + x + ")`"
        answer = fx + gx
      }
      else if (type == 2) {
        var eqn = "`(f-g)(" + x + ")`"
        answer = fx - gx
      }
      else if (type == 3) {
        var eqn = "`(f*g)(" + x + ")`"
        answer = fx * gx
      }
      else {
        var eqn = "`(f/g)(" + x + ")`"
        answer = fx / gx
      }
      var text = "Find " + eqn + ", given the functions<br>"
        + "`f(x)=x^2+" + a + "x+" + b + "`<br>"
        + "`g(x)=x+" + c + "`"
      document.getElementById("mathProblem").innerHTML = text.replace("+-","-").replace("+-","-").replace("+-","-")
    }
    else if (i == 62) { // Add or subtract functions ax+b and cx+d
      var array = shuffleArray([-6,-5,-4,-3,-2,2,3,4,5,6])
      var a = array[0]
      var b = array[1]
      var c = array[2]
      var d = array[3]
      var type = Math.ceil(Math.random() * 2)
      if (type == 1) {
        var apc = a + c
        var bpd = b + d
        var eqn = "`(f+g)(x)`"
        if (apc == 1) {
          var answertext = "x+" + bpd
        }
        else if (apc == 0) {
          var answertext = bpd
        }
        else {
          var answertext = apc + "x+" + bpd
        }
        answer = answertext.replace("+-","-").replace("+0","").replace("-1x","-x")
      }
      else {
        var amc = a - c
        var bmd = b - d
        var eqn = "`(f-g)(x)`"
        if (amc == 1) {
          var answertext = "x+" + bmd
        }
        else if (amc == 0) {
          var answertext = bmd
        }
        else {
          var answertext = amc + "x+" + bmd
        }
        answer = answertext.replace("+-","-").replace("+0","").replace("-1x","-x")
      }
      var text = "Find " + eqn + ", given the functions<br>"
        + "`f(x)=" + a + "x+" + b + "`<br>"
        + "`g(x)=" + c + "x+" + d + "`<br>"
      document.getElementById("mathProblem").innerHTML = text.replace("+-","-").replace("+-","-")
      answerString = 1
    }
    else if (i == 63) { //Find profit for given number of units if cost and revenue functions are given
      var a = 10 * Math.ceil(Math.random() * 20) + 100
      var b = 10 * Math.ceil(Math.random() * 200) + 1000
      var c = 10 * Math.ceil(Math.random() * 20) + 400
      var x = Math.ceil(Math.random() * 200) + 200
      var text = "A manufacturer has total cost function `C(x)=" + a + "x+" + b + "` and total revenue function `R(x)="
        + c + "x`. What is the profit on " + x + " units?"
      document.getElementById("mathProblem").innerHTML = text
      answer = (c - a) * x - b
    }
    else if (i == 64) { //Find (f o g)(x) or (g o f)(x) for f(x)=ax+b and g(x)=cx+d
      var array = shuffleArray([-6,-5,-4,-3,-2,2,3,4,5,6])
      var a = array[0]
      var b = array[1]
      var c = array[2]
      var d = array[3]
      var type = Math.ceil(Math.random() * 2)
      if (type == 1) {
        var m = a * c
        var n = a * d + b
        var eqn = "`(f`" + " o " + "`g)(x)`"
      }
      else {
        var m = a * c
        var n = b * c + d
        var eqn = "`(g`" + " o " + "`f)(x)`"
      }
      var answertext = m + "x+" + n
      answer = answertext.replace("+-","-").replace("+0","")
      var text = "Find the composition " + eqn + ", given the functions<br>"
        + "`f(x)=" + a + "x+" + b + "`<br>"
        + "`g(x)=" + c + "x+" + d + "`<br>"
      document.getElementById("mathProblem").innerHTML = text.replace("+-","-").replace("+-","-")
      answerString = 1
    }
    else if (i == 65) { // Find composition at a point for f(x)=x^2+ax+b and g(x)=x+c
      var a = (2 * Math.ceil(Math.random() * 2) - 3) * (1 + Math.ceil(Math.random() * 5))
      var b = (2 * Math.ceil(Math.random() * 2) - 3) * (1 + Math.ceil(Math.random() * 4))
      var c = (2 * Math.ceil(Math.random() * 2) - 3) * (1 + Math.ceil(Math.random() * 4))
      var x = (2 * Math.ceil(Math.random() * 2) - 3) * Math.ceil(Math.random() * 2)
      var fx = x ** 2 + a * x + b
      var gx = x + c
      var fogx = gx ** 2 + a * gx + b
      var gofx = fx + c
      var type = Math.ceil(Math.random() * 2)
      if (type == 1) { // (f o g)(x)
        var eqn = "`(f`" + " o " + "`g)(" + x + ")`"
        answer = fogx
      }
      else { // (g o f)(x)
        var eqn = "`(g`" + " o " + "`f)(" + x + ")`"
        answer = gofx
      }
      var text = "Find " + eqn + ", given the functions<br>"
        + "`f(x)=x^2+" + a + "x+" + b + "`<br>"
        + "`g(x)=x+" + c + "`"
      document.getElementById("mathProblem").innerHTML = text.replace("+-","-").replace("+-","-").replace("+-","-")
    }
    else if (i == 66) { // Find difference quotient for f(x)=ax+b or f(x)=ax^2 + b
      var type = Math.ceil(Math.random() * 2)
      var a = (2 * Math.ceil(Math.random() * 2) - 3) * (1 + Math.ceil(Math.random() * 5))
      var b = (2 * Math.ceil(Math.random() * 2) - 3) * (1 + Math.ceil(Math.random() * 8))
      var a2 = 2 * a
      if (type == 1) { // f(x)=ax+b
        var eqn = "`f(x)=" + a + "x+" + b + "`"
        answer = a
        answerString = 0
      }
      else { // f(x)=ax^2+b
        var eqn = "`f(x)=" + a + "x^2+" + b + "`"
        var answertext1 = a2 + "x+" + a + "h"
        var answertext2 = a + "h+" + a2 + "x"
        answer = [ answertext1.replace("+-","-") , answertext2.replace("+-","-") ]
        answerString = 2
      }
      var text = "For the function " + eqn + ", find the difference quotient<br>"
        + "`(f(x+h)-f(x))/h=`"
      document.getElementById("mathProblem").innerHTML = text.replace("+-","-")
    }
    else if (i == 67) { //Is the linear/quadratic function one-to-one?
      var type = Math.ceil(Math.random() * 2)
      var a = (2 * Math.ceil(Math.random() * 2) - 3) * (Math.ceil(Math.random() * 5))
      var b = (2 * Math.ceil(Math.random() * 2) - 3) * (1 + Math.ceil(Math.random() * 8))
      if (type == 1) { // f(x)=ax+b
        var eqn = "`f(x)=" + a + "x+" + b + "`"
        answer = ["Yes","YES","yes"]
      }
      else { // f(x)=ax^2+b
        var eqn = "`f(x)=" + a + "x^2+" + b + "`"
        answer = ["No","NO","no"]
      }
      var text = "Is the following function one-to-one? (Yes or no)<br>" + eqn
      document.getElementById("mathProblem").innerHTML = text.replace("+-","-").replace("1x","x")
      answerString = 2
    }
    else if (i == 68) { //Is the function one-to-one? (Set of ordered pairs)
      var array = shuffleArray([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20])
      var x1 = array[0]
      var x2 = array[1]
      var x3 = array[2]
      var x4 = array[3]
      var x5 = array[4]
      var array2 = shuffleArray([11,12,13,14,15,16,17,18])
      var y1 = array2[0]
      var y2 = array2[1]
      var y3 = array2[2]
      var y4 = array2[3]
      var y5 = 10 + Math.ceil(Math.random() * 8)
      var check = (y5-y1)*(y5-y2)*(y5-y3)*(y5-y4)
      var text = "Is the following function one-to-one? Type yes or no.<br>"
        + "`S={(" + x1 + "," + y1 + "),(" + x2 + "," + y2 + "),(" + x3 + "," + y3 + "),(" + x4 + "," + y4
        + "),(" + x5 + "," + y5 + ")}`"
      document.getElementById("mathProblem").innerHTML = text
      if (check == 0) {answer = ["No","no","NO"]}
      else {answer = ["Yes","yes","YES"]}
      answerString = 2
    }
    else if (i == 69) { //Find the inverse of the linear function f(x)=(1/a)x+b. f^-1(x)=a(x-b)=ax-ab
      var sgn = 2 * Math.ceil(Math.random() * 2) - 3
      var a = sgn * (1 + Math.ceil(Math.random() * 5))
      var b = (2 * Math.ceil(Math.random() * 2) - 3) * (1 + Math.ceil(Math.random() * 8))
      if (a > 0) {
        var eqn = "`f(x)=1/" + a + "x+" + b + "`"
      }
      else {
        var ma = - a
        var eqn = "`f(x)=-1/" + ma + "x+" + b + "`"
      }
      var text = "Find the inverse of the function " + eqn + ". Write just the expression for the inverse (like 4x+20)"
      document.getElementById("mathProblem").innerHTML = text.replace("+-","-")
      var mab = - a * b
      var mb = - b
      var answertext1 = a + "x+" + mab
      var answertext2 = mab + "+" + a + "x"
      var answertext3 = a + "(x-" + b + ")"
      var answertext4 = a + "(" + mb + "+x)"
      answer = [ answertext1.replace("+-","-") , answertext2.replace("+-","-") , answertext3.replace("--","+") , 
        answertext4 ]
      answerString = 2
    }
    else if (i == 70) { //Find future value under compound interest
      var array = shuffleArray([0,1,2,3,4,5])
      var k = array[0]
      var narray = [1,2,4,12,52,365]
      var n = narray[k]
      var warray = ["annually","semiannually","quarterly","monthly","weekly","daily"]
      var word = warray[k]
      var P = 1000*(4 + Math.ceil(Math.random() * 11))
      var r = Math.ceil(Math.random() * 5) * 0.005
      var R = 100*r
      var t = 3 + Math.ceil(Math.random() * 7)
      document.getElementById("mathProblem").innerHTML = "John invests $" + P + " at " + R + "% interest compounded " + word + 
        " for " + t + " years. How much is in the account at the end of the " + t + "-year period?"
      answer = Math.round((P*(1+r/n)^(n*t)+Number.EPSILON)*100)/100
    }
    else if (i == 71) { //Solve a^x = b by inspection
      var a = 1 + Math.ceil(Math.random() * 4)
      var x = 1 + Math.ceil(Math.random() * 4)
      var b = a ** x
      document.getElementById("mathProblem").innerHTML = "Solve for `x`:<br> `" + a + "^x=" + b + "`"
      answer = x
    }
    else if (i == 72) { //Evaluate log_a(b)
      var a = 1 + Math.ceil(Math.random() * 7)
      var x = Math.ceil(Math.random() * 5) - 1
      var b = a ** x
      document.getElementById("mathProblem").innerHTML = "Solve for `x`:<br> `log_" + a + "(" + b + ")=x`"
      answer = x
    }
    else if (i == 73) { //Find log_x(root[n](x))
      var n = 1 + Math.ceil(Math.random() * 4)
      var m = Math.ceil(Math.random() * (n-1))
      if (n == 2) {
        var eqn = "`log_x(sqrt(x^" + m + "))`"
      }
      else {
        var eqn = "`log_x(root[" + n + "](x^" + m + "))`"
      }
      var text = "Evaluate the logarithm:<br> " + eqn
      document.getElementById("mathProblem").innerHTML = text.replace("^1","")
      answer = m / n
    }
    else if (i == 74) { //Solve log_a(x)=b
      var a = 1 + Math.ceil(Math.random() * 7)
      var b = Math.ceil(Math.random() * 7) - 4
      var text = "Solve for `x`:<br> `log_" + a + "(x)=" + b + "`"
      document.getElementById("mathProblem").innerHTML = text
      answer = a ** b
    }
    else if (i == 75) { //Solve a^x = b requiring use of logs
      var a = 8 + Math.ceil(Math.random() * 7)
      var b = 60 + Math.ceil(Math.random() * 50)
      var text = "Solve for `x`:<br>`" + a + "^x=" + b + "`<br>Round to 4 decimal places."
      document.getElementById("mathProblem").innerHTML = text
      answer = Math.log(b) / Math.log(a)
    }
    else if (i == 76) { //Expand natural log using properties of logs
      var array = shuffleArray([2,3,4,5,6,7,8,9,10,11,12,13,14,15])
      var a = array[0]
      var b = array[1]
      var c = array[2]
      var text = "Use properties of logarithms to expand the logarithm so that no logarithm of a product, " 
        + "quotient, or exponent remains. Use parentheses around the argument of the log (like this: `ln(x)`), "
        + "and do not use any spaces or asterisks (*).<br>"
        + "`ln((x^" + a + "y^" + b + ")/z^" + c + ")`"
      document.getElementById("mathProblem").innerHTML = text
      answer = a + "ln(x)+" + b + "ln(y)-" + c + "ln(z)"
      answerString = 1
    }
    else if (i == 77) { //Find future value or doubling time under continuously compounded interest
      var P = 1000*(4 + Math.ceil(Math.random() * 11))
      var r = Math.ceil(Math.random() * 5) * 0.005
      var R = 100*r
      var t = 3 + Math.ceil(Math.random() * 7)
      var type = Math.ceil(Math.random() * 2)
      if (type == 1) { //Find future value
        document.getElementById("mathProblem").innerHTML = "John invests $" + P + " at " + R + "% interest compounded continuously "
          + "for " + t + " years. How much is in the account at the end of the " + t + "-year period?"
        answer = Math.round((P*Math.exp(r * t)+Number.EPSILON)*100)/100
      }
      else { //Find doubling time
        document.getElementById("mathProblem").innerHTML = "John invests $" + P + " at " + R + "% interest compounded continuously. "
          + "How many years will it take for the money in the account to double? Round to two decimal places."
        answer = Math.round((Math.log(2)/r+Number.EPSILON)*100)/100
      }
    }
    document.getElementById("mathProblemType").style.fontSize = "1.1vw"
    document.getElementById("mathProblemType").innerHTML = "<b>Type-" + i + " Problem</b>"
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, mathProblem]);
    costT[i] = multiply(gameData.growthFactor,costT[i]) //Could you get noninteger costs here?
    document.getElementById("T"+i+"cost").innerHTML = convertNumber(costT[i])
    document.getElementById("answer").focus()
    document.getElementById("answer").value = ""
    document.getElementById("answerdiv").style.display = "inline-block"
    //document.getElementById("checkButton").style.display = "block"
    document.getElementById("feedback").innerHTML = ""
    document.getElementById("answer").readOnly = false
    gameData.typetag = i
    if (answerString == 2) {
      document.getElementById("devAnswer").innerHTML = "Answer: " + answer[0]
    } else {
      document.getElementById("devAnswer").innerHTML = "Answer: " + answer
    }
  }
}

function buyRuby() {
  greekRuby.pause()
  greekRuby.currentTime = 0
  greekRuby.play()
  gameData.rubies++;
  gameData.knowledge = subtract(gameData.knowledge,gameData.rubyCost);
  var oldFactor = gameData.rubyBonus;
  gameData.rubyBonus = Math.round((1 + gameData.rubies / 100) * 100) / 100;
  var newFactor = gameData.rubyBonus / oldFactor;
  document.getElementById("rubies").style.fontSize = "2vw"
  document.getElementById("rubies").innerHTML = gameData.rubies;
  document.getElementById("totalKnowledge").innerHTML = convertKnowledge(gameData.knowledge);
  document.getElementById("rubyBonus").innerHTML = "(Base KPS x " + gameData.rubyBonus.toFixed(2) + ")";
  gameData.kps = multiply(gameData.kps,[newFactor,0]);
  document.getElementById("kps").innerHTML = "per second: " + convertNumber(gameData.kps) + " KPS"
  gameData.rubyCost = multiply(gameData.kps,[7.2,1]) //This is 2 hours of KPS
  document.getElementById("rubyCost").innerHTML = convertNumber(gameData.rubyCost)
  for (let i = 1; i < 78; i++) {
    kpsvector[i] = multiply(kpsvector[i],[newFactor,0])
    document.getElementById("kpsT"+i).innerHTML = "+" + convertNumber(kpsvector[i]) + " KPS"
    kpsFromT[i] = multiply([numberCorrect[i],0],kpsvector[i])
    document.getElementById("kpsFromT"+i).innerHTML = convertNumber(kpsFromT[i]) + " KPS"
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function check() {
  if (answerString == 1) { // If answer is a string like DNE...
    var uanswer = document.getElementById("answer").value
    if (uanswer == answer) {
      document.getElementById("feedback").innerHTML = "Correct!"
      document.getElementById("feedback").style.color = "green"
      if (z == 0) {
        gameData.knowledge = add([1,0],gameData.knowledge)
        gameData.cmKnowledge = add([1,0],gameData.cmKnowledge)
        document.getElementById("totalKnowledge").innerHTML = convertKnowledge(gameData.knowledge)
        if (document.getElementById("beginningtip").innerHTML == "Reward: 1 Knowledge") {
          document.getElementById("beginningtip").innerHTML == "Reward: 1 Knowledge"
        } else {
          document.getElementById("beginningtip").innerHTML =
            "Keep doing more of these until you have enough Knowledge to purchase a regular question, "
            + "which will start to give you a passive Knowledge income."
        }
      }
      else {
        if (gameData.streak == gameData.streakHighest) {
          gameData.streakHighest++
        }
        gameData.streak++
        gameData.kps = add(kpsvector[gameData.typetag],gameData.kps)
        gameData.rubyCost = multiply(gameData.kps,[7.2,1]) //This is 2 hours of KPS
        document.getElementById("rubyCost").innerHTML = convertNumber(gameData.rubyCost)
        document.getElementById("kps").innerHTML = "per second: " + convertNumber(gameData.kps) + " KPS"
        numberCorrect[gameData.typetag] += 1
        numberCorrectCommas[gameData.typetag] = numberCorrect[gameData.typetag].toLocaleString("en-us")
        document.getElementById("correctT" + gameData.typetag).innerHTML = numberCorrectCommas[gameData.typetag]
        kpsFromT[gameData.typetag] = multiply([numberCorrect[gameData.typetag],0],kpsvector[gameData.typetag])
        document.getElementById("kpsFromT" + gameData.typetag).innerHTML = convertNumber(kpsFromT[gameData.typetag]) + " KPS"
        for (let i=1; i < numberOfQ + 1; i++) {
          c = divide(kpsFromT[i],gameData.kps)
          document.getElementById("kpsPctFromT" + i).innerHTML =
            Math.round(c[0] * 10 ** (3 * c[1]) *10000)/100 + "%"
        }
        document.getElementById("rubyHeader").style.visibility = "visible"
        document.getElementById("rubyArea").style.visibility = "visible"
        if (numberCorrect[gameData.typetag] == 1) {
          levelUpT(gameData.typetag)
        }
        else if (numberCorrect[gameData.typetag] == 10) {
          upgradeArea.appendChild(upgradeButton[gameData.typetag][2])
        }
        else if (numberCorrect[gameData.typetag] == 25) {
          upgradeArea.appendChild(upgradeButton[gameData.typetag][3])
        }
        else if (numberCorrect[gameData.typetag] == 50) {
          upgradeArea.appendChild(upgradeButton[gameData.typetag][4])
        }
        else if (numberCorrect[gameData.typetag] == 100) {
          upgradeArea.appendChild(upgradeButton[gameData.typetag][5])
        }
      }
    }
    else if (uanswer == "") {
      gameData.streak = 0
      document.getElementById("feedback").innerHTML = "You didn't even answer! Do better next time!"
      document.getElementById("feedback").style.color = "red"
      wrongAnswer.play()
    }
    else {
      gameData.streak = 0
      document.getElementById("feedback").innerHTML = "Incorrect! The correct answer was " + answer + " and you answered "
        + uanswer + "."
      document.getElementById("feedback").style.color = "red"
      wrongAnswer.play()
    }
  }
  else if (answerString == 2) { // If you are checking that multiple answers separated with a comma are correct independent of order
    var uanswer = document.getElementById("answer").value
    if (answer.indexOf(uanswer) > -1) {
      document.getElementById("feedback").innerHTML = "Correct!"
      document.getElementById("feedback").style.color = "green"
      if (z == 0) {
        gameData.knowledge = add([1,0],gameData.knowledge)
        gameData.cmKnowledge = add([1,0],gameData.cmKnowledge)
        document.getElementById("totalKnowledge").innerHTML = convertKnowledge(gameData.knowledge)
        if (document.getElementById("beginningtip").innerHTML == "Reward: 1 Knowledge") {
          document.getElementById("beginningtip").innerHTML == "Reward: 1 Knowledge"
        } else {
          document.getElementById("beginningtip").innerHTML =
            "Keep doing more of these until you have enough Knowledge to purchase a regular question, "
            + "which will start to give you a passive Knowledge income."
        }
      }
      else {
        if (gameData.streak == gameData.streakHighest) {
          gameData.streakHighest++
        }
        gameData.streak++
        gameData.kps = add(kpsvector[gameData.typetag],gameData.kps)
        gameData.rubyCost = multiply(gameData.kps,[7.2,1]) //This is 2 hours of KPS
        document.getElementById("rubyCost").innerHTML = convertNumber(gameData.rubyCost)
        document.getElementById("kps").innerHTML = "per second: " + convertNumber(gameData.kps) + " KPS"
        numberCorrect[gameData.typetag] += 1
        numberCorrectCommas[gameData.typetag] = numberCorrect[gameData.typetag].toLocaleString("en-us")
        document.getElementById("correctT" + gameData.typetag).innerHTML = numberCorrectCommas[gameData.typetag]
        kpsFromT[gameData.typetag] = multiply([numberCorrect[gameData.typetag],0],kpsvector[gameData.typetag])
        document.getElementById("kpsFromT" + gameData.typetag).innerHTML = convertNumber(kpsFromT[gameData.typetag]) + " KPS"
        for (let i=1; i < numberOfQ + 1; i++) {
          c = divide(kpsFromT[i],gameData.kps)
          document.getElementById("kpsPctFromT" + i).innerHTML =
            Math.round(c[0] * 10 ** (3 * c[1]) *10000)/100 + "%"
        }
        document.getElementById("rubyHeader").style.visibility = "visible"
        document.getElementById("rubyArea").style.visibility = "visible"
        if (numberCorrect[gameData.typetag] == 1) {
          levelUpT(gameData.typetag)
        }
        else if (numberCorrect[gameData.typetag] == 10) {
          upgradeArea.appendChild(upgradeButton[gameData.typetag][2])
        }
        else if (numberCorrect[gameData.typetag] == 25) {
          upgradeArea.appendChild(upgradeButton[gameData.typetag][3])
        }
        else if (numberCorrect[gameData.typetag] == 50) {
          upgradeArea.appendChild(upgradeButton[gameData.typetag][4])
        }
        else if (numberCorrect[gameData.typetag] == 100) {
          upgradeArea.appendChild(upgradeButton[gameData.typetag][5])
        }
      }
    }
    else if (uanswer == "") {
      gameData.streak = 0
      document.getElementById("feedback").innerHTML = "You didn't even answer! Do better next time!"
      document.getElementById("feedback").style.color = "red"
      wrongAnswer.play()
    }
    else {
      gameData.streak = 0
      document.getElementById("feedback").innerHTML = "Incorrect! The correct answer was " + answer[0] + " and you answered "
        + uanswer + "."
      document.getElementById("feedback").style.color = "red"
      wrongAnswer.play()
    }
  }
  else { // If answer is a string that is a number
    var uanswer = eval(document.getElementById("answer").value)
    if (Math.abs(uanswer - answer) <= tolerance*Math.abs(answer)) {
      document.getElementById("feedback").innerHTML = "Correct!"
      document.getElementById("feedback").style.color = "green"
      if (z == 0) { //If it's a review question
        gameData.knowledge = add([1,0],gameData.knowledge)
        gameData.cmKnowledge = add([1,0],gameData.cmKnowledge)
        document.getElementById("totalKnowledge").innerHTML = convertKnowledge(gameData.knowledge)
        if (document.getElementById("beginningtip").innerHTML == "Reward: 1 Knowledge") {
          document.getElementById("beginningtip").innerHTML == "Reward: 1 Knowledge"
        } else {
          document.getElementById("beginningtip").innerHTML =
            "Keep doing more of these until you have enough Knowledge to purchase a regular question, "
              + "which will start to give you a passive Knowledge income."
        }
      }
      else { //It's a unit question
        if (gameData.streak == gameData.streakHighest) {
          gameData.streakHighest++
        }
        gameData.streak++
        gameData.kps = add(kpsvector[gameData.typetag],gameData.kps)
        gameData.rubyCost = multiply(gameData.kps,[7.2,1]) //This is 2 hours of KPS
        document.getElementById("rubyCost").innerHTML = convertNumber(gameData.rubyCost)
        document.getElementById("kps").innerHTML = "per second: " + convertNumber(gameData.kps) + " KPS"
        numberCorrect[gameData.typetag] += 1
        numberCorrectCommas[gameData.typetag] = numberCorrect[gameData.typetag].toLocaleString("en-us")
        document.getElementById("correctT" + gameData.typetag).innerHTML = numberCorrectCommas[gameData.typetag]
        kpsFromT[gameData.typetag] = multiply([numberCorrect[gameData.typetag],0],kpsvector[gameData.typetag])
        document.getElementById("kpsFromT" + gameData.typetag).innerHTML = convertNumber(kpsFromT[gameData.typetag]) + " KPS"
        for (let i=1; i < numberOfQ + 1; i++) {
          c = divide(kpsFromT[i],gameData.kps)
          document.getElementById("kpsPctFromT" + i).innerHTML =
            Math.round(c[0] * 10 ** (3 * c[1]) *10000)/100 + "%"
        }
        document.getElementById("rubyHeader").style.visibility = "visible"
        document.getElementById("rubyArea").style.visibility = "visible"
        if (numberCorrect[gameData.typetag] == 1) {
          levelUpT(gameData.typetag)
        }
        else if (numberCorrect[gameData.typetag] == 10) {
          upgradeArea.appendChild(upgradeButton[gameData.typetag][2])
        }
        else if (numberCorrect[gameData.typetag] == 25) {
          upgradeArea.appendChild(upgradeButton[gameData.typetag][3])
        }
        else if (numberCorrect[gameData.typetag] == 50) {
          upgradeArea.appendChild(upgradeButton[gameData.typetag][4])
        }
        else if (numberCorrect[gameData.typetag] == 100) {
          upgradeArea.appendChild(upgradeButton[gameData.typetag][5])
        }
      }
    }
    else if (uanswer == null) {
      gameData.streak = 0
      document.getElementById("feedback").innerHTML = "You didn't even answer! Do better next time!"
      document.getElementById("feedback").style.color = "red"
      wrongAnswer.play()
    }
    else {
      gameData.streak = 0
      document.getElementById("feedback").innerHTML = "Incorrect! The correct answer was " + answer + " and you answered "
        + uanswer + "."
      document.getElementById("feedback").style.color = "red"
      wrongAnswer.play()
    }
  }
  document.getElementById("checkButton").style.display = "none"
  document.getElementById("answer").readOnly = true
  answerString = 0
}

function plot(g) {
  
  var Canvas = document.getElementById('xy-graph');  
  var Ctx = null ;
  
  var Width = Canvas.width ;
  var Height = Canvas.height ;
  
  // Returns the right boundary of the logical viewport:
  function MaxX() {
    return 10 ;
  }
  
  // Returns the left boundary of the logical viewport:
  function MinX() {
    return -10 ;
  }
  
  // Returns the top boundary of the logical viewport:
  function MaxY() {
    return MaxX() * Height / Width;
  }
  
  // Returns the bottom boundary of the logical viewport:
  function MinY() {
      return MinX() * Height / Width;
  }
  
  // Returns the physical x-coordinate of a logical x-coordinate:
  function XC(x) {
    return (x - MinX()) / (MaxX() - MinX()) * Width ;
  }
  
  // Returns the physical y-coordinate of a logical y-coordinate:
  function YC(y) {
    return Height - (y - MinY()) / (MaxY() - MinY()) * Height ;
  }
  
  
  /* Rendering functions */
  
  // Clears the canvas, draws the axes and graphs the function F.
  function Draw() {

    if (Canvas.getContext) {
    
      // Set up the canvas:
      Ctx = Canvas.getContext('2d');
      //Ctx.clearRect(0,0,Width,Height) ;
      // Draw:
      DrawAxes() ;
      RenderFunction(g) ;
    
    } else {
      // Do nothing.
    }
  }
  
  
  // Returns the distance between ticks on the X axis:
  function XTickDelta() {
    return 1 ;
  }
  
  // Returns the distance between ticks on the Y axis:
  function YTickDelta() {
    return 1 ;
  }
  
    
  // DrawAxes draws the X ad Y axes, with tick marks.
  function DrawAxes() {
    Ctx.save() ;
    Ctx.lineWidth = 2 ;
    // +Y axis
    Ctx.beginPath() ;
    Ctx.moveTo(XC(0),YC(0)) ;
    Ctx.lineTo(XC(0),YC(MaxY())) ;
    Ctx.stroke() ;
  
    // -Y axis
    Ctx.beginPath() ;
    Ctx.moveTo(XC(0),YC(0)) ;
    Ctx.lineTo(XC(0),YC(MinY())) ;
    Ctx.stroke() ;
  
    // Y axis tick marks
    var delta = YTickDelta() ;
    for (var i = 1; (i * delta) < MaxY() ; ++i) {
    Ctx.lineWidth = 0.15 ;
    Ctx.beginPath() ;
    Ctx.moveTo(-10,YC(i * delta)) ;
    Ctx.lineTo(540,YC(i * delta)) ;
    Ctx.stroke() ;  
    }
  
    var delta = YTickDelta() ;
    for (var i = 1; (i * delta) > MinY() ; --i) {
    Ctx.beginPath() ;
    Ctx.moveTo(-10,YC(i * delta)) ;
    Ctx.lineTo(540,YC(i * delta)) ;
    Ctx.stroke() ;  
    }  
  
    // +X axis
    Ctx.lineWidth = 2 ;
    Ctx.beginPath() ;
    Ctx.moveTo(XC(0),YC(0)) ;
    Ctx.lineTo(XC(MaxX()),YC(0)) ;
    Ctx.stroke() ;
  
    // -X axis
    Ctx.beginPath() ;
    Ctx.moveTo(XC(0),YC(0)) ;
    Ctx.lineTo(XC(MinX()),YC(0)) ;
    Ctx.stroke() ;
  
    // X tick marks
    var delta = XTickDelta() ;
    for (var i = 1; (i * delta) < MaxX() ; ++i) {
    Ctx.lineWidth = 0.15 ;
    Ctx.beginPath() ;
    Ctx.moveTo(XC(i * delta),-5) ;
    Ctx.lineTo(XC(i * delta),300) ;
    Ctx.stroke() ;  
    }
  
    var delta = XTickDelta() ;
    for (var i = 1; (i * delta) > MinX() ; --i) {
    Ctx.beginPath() ;
    Ctx.moveTo(XC(i * delta),-5) ;
    Ctx.lineTo(XC(i * delta),300) ;
    Ctx.stroke() ;  
    }
    Ctx.restore() ;
  }
  
  
  // When rendering, XSTEP determines the horizontal distance between points:
  var XSTEP = (MaxX()-MinX())/Width ;
  
  
  // RenderFunction(f) renders the input function f on the canvas.
  function RenderFunction(f) {
    var first = true;
    Ctx.lineWidth = 1 ;
    Ctx.strokeStyle = 'red';
    Ctx.beginPath() ;
    for (var x = MinX(); x <= MaxX(); x += XSTEP) {
      var y = f(x) ;
      if (first) {
      Ctx.moveTo(XC(x),YC(y)) ;
      first = false ;
      } else {
      Ctx.lineTo(XC(x),YC(y)) ;
      }
    }
    Ctx.stroke() ;
    Ctx.strokeStyle = 'black';
  }
  
  Draw() ;
}

function plotOpenCircle(x,y) {
  var Canvas = document.getElementById('xy-graph');  
  var Ctx = null ;
  
  var Width = Canvas.width ;
  var Height = Canvas.height ;
  
  function MaxX() {
    return 10 ;
  }
  
  function MinX() {
    return -10 ;
  }
  
  function MaxY() {
    return MaxX() * Height / Width;
  }
  
  function MinY() {
      return MinX() * Height / Width;
  }
  
  function XC(x) {
    return (x - MinX()) / (MaxX() - MinX()) * Width ;
  }
  
  function YC(y) {
    return Height - (y - MinY()) / (MaxY() - MinY()) * Height ;
  }
  
  var ctx2 = document.getElementById('xy-graph').getContext("2d");
  ctx2.strokeStyle = 'red';
  ctx2.beginPath();
  ctx2.arc(XC(x), YC(y), 5, 0, 2 * Math.PI, true);
  ctx2.stroke();
}

function shuffleArray(array) {
  for (var k = array.length - 1; k > 0; k--) {
      var j = Math.floor(Math.random() * (k + 1));
      var temp = array[k];
      array[k] = array[j];
      array[j] = temp;
  }
  return array
}

function initialize() {
  initializeTime = Date.now()
  if (localStorage['gameData'] != "" && localStorage['gameData'] != null) {
    gameData = JSON.parse(decodeString(localStorage['gameData']));
    costT = JSON.parse(decodeString(localStorage['costT']));
    kpsvector = JSON.parse(decodeString(localStorage['kpsvector']));
    numberCorrect = JSON.parse(decodeString(localStorage['numberCorrect']));
    numberCorrectCommas = JSON.parse(decodeString(localStorage['numberCorrectCommas']));
    numberCorrectUnit = JSON.parse(decodeString(localStorage['numberCorrectUnit']));
    kpsFromT = JSON.parse(decodeString(localStorage['kpsFromT']));
    levelT = JSON.parse(decodeString(localStorage['levelT']));
    purchasedMusicUpgrade = JSON.parse(decodeString(localStorage['purchasedMusicUpgrade']));
    upgradePurchased = JSON.parse(decodeString(localStorage['upgradePurchased']));
    gotGreek = JSON.parse(decodeString(localStorage['gotGreek']));
    gotGreekTotal = JSON.parse(decodeString(localStorage['gotGreekTotal']));
  }
  if (gameData.kps[0] == 0) {
    document.getElementById("rubyHeader").style.visibility = "hidden"
    document.getElementById("rubyArea").style.visibility = "hidden"
  }
  else {
    document.getElementById("rubyHeader").style.visibility = "visible"
    document.getElementById("rubyArea").style.visibility = "visible"
  }
  document.getElementById("totalKnowledge").innerHTML = convertKnowledge(gameData.knowledge)
  document.getElementById("kps").innerHTML = "per second: " + convertNumber(gameData.kps) + " KPS"
  document.getElementById("rubies").style.fontSize = "2vw"
  document.getElementById("rubies").innerHTML = gameData.rubies
  document.getElementById("rubyCost").innerHTML = convertNumber(gameData.rubyCost)
  document.getElementById("rubyBonus").innerHTML = "(Base KPS x " + gameData.rubyBonus.toFixed(2) + ")"
  for (let i = 1; i < numberOfQ + 1; i++) {
    numberCorrectCommas[i] = numberCorrect[i].toLocaleString("en-us")
    document.getElementById("T"+i+"cost").innerHTML = convertNumber(costT[i])
    document.getElementById("kpsT" + i).innerHTML = "+" + convertNumber(kpsvector[i]) + " KPS"
    document.getElementById("correctT" + i).innerHTML = numberCorrectCommas[i]
    document.getElementById("kpsFromT" + i).innerHTML = convertNumber(kpsFromT[i]) + " KPS"
    document.getElementById("kpsPctFromT" + i).innerHTML = ""
  }
  //Create the KPS percentages if KPS != 0
  if (gameData.kps.toString() != [0,0].toString()) {
    for (let i = 1; i < numberOfQ + 1; i++) {
      c = divide(kpsFromT[i],gameData.kps)
      document.getElementById("kpsPctFromT" + i).innerHTML =
        Math.round(c[0] * 10 ** (3 * c[1]) *10000)/100 + "%"
    }
  }
  if (devtools == true) {
    document.getElementById("freeK").style.display = "block"
    document.getElementById("greekButton").style.display = "block"
    for (let i = 1; i < 14; i++) {
      document.getElementById("unlockUnit"+i).style.visibility = "hidden" // hidden or visible
    }
  }
  else {
    document.getElementById("freeK").style.display = "none"
    document.getElementById("greekButton").style.display = "none"
    document.getElementById("devAnswer").style.display = "none"
    for (let i = 1; i < 14; i++) {
      document.getElementById("unlockUnit"+i).style.visibility = "hidden"
    }
  }
  if (true) { //Hide all units again
    document.getElementById('progressUnit1').style = 'display: row-block';
    document.getElementById('Unit1row1').style = 'display: none';
    document.getElementById('Unit1row2').style = 'display: none';
    document.getElementById('Unit1row3').style = 'display: none';
    document.getElementById('Unit1row4').style = 'display: none';
    document.getElementById('Unit1row5').style = 'display: none';
    document.getElementById('Unit1row6').style = 'display: none';
    document.getElementById('Unit1row7').style = 'display: none';
    document.getElementById('Unit1row8').style = 'display: none';
    document.getElementById('Unit1row9').style = 'display: none';
    document.getElementById('Unit1row10').style = 'display: none';
    document.getElementById('progressUnit2').style = 'display: none';
    document.getElementById('Unit2row1').style = 'display: none';
    document.getElementById('Unit2row2').style = 'display: none';
    document.getElementById('Unit2row3').style = 'display: none';
    document.getElementById('Unit2row4').style = 'display: none';
    document.getElementById('Unit2row5').style = 'display: none';
    document.getElementById('Unit2row6').style = 'display: none';
    document.getElementById('Unit2row7').style = 'display: none';
    document.getElementById('Unit2row8').style = 'display: none';
    document.getElementById('progressUnit3').style = 'display: none';
    document.getElementById('Unit3row1').style = 'display: none';
    document.getElementById('Unit3row2').style = 'display: none';
    document.getElementById('Unit3row3').style = 'display: none';
    document.getElementById('Unit3row4').style = 'display: none';
    document.getElementById('Unit3row5').style = 'display: none';
    document.getElementById('Unit3row6').style = 'display: none';
    document.getElementById('Unit3row7').style = 'display: none';
    document.getElementById('Unit3row8').style = 'display: none';
    document.getElementById('progressUnit4').style = 'display: none';
    document.getElementById('Unit4row1').style = 'display: none';
    document.getElementById('Unit4row2').style = 'display: none';
    document.getElementById('Unit4row3').style = 'display: none';
    document.getElementById('Unit4row4').style = 'display: none';
    document.getElementById('Unit4row5').style = 'display: none';
    document.getElementById('Unit4row6').style = 'display: none';
    document.getElementById('Unit4row7').style = 'display: none';
    document.getElementById('Unit4row8').style = 'display: none';
    document.getElementById('progressUnit5').style = 'display: none';
    document.getElementById('Unit5row1').style = 'display: none';
    document.getElementById('Unit5row2').style = 'display: none';
    document.getElementById('Unit5row3').style = 'display: none';
    document.getElementById('Unit5row4').style = 'display: none';
    document.getElementById('Unit5row5').style = 'display: none';
    document.getElementById('progressUnit6').style = 'display: none';
    document.getElementById('Unit6row1').style = 'display: none';
    document.getElementById('Unit6row2').style = 'display: none';
    document.getElementById('Unit6row3').style = 'display: none';
    document.getElementById('Unit6row4').style = 'display: none';
    document.getElementById('Unit6row5').style = 'display: none';
    document.getElementById('Unit6row6').style = 'display: none';
    document.getElementById('Unit6row7').style = 'display: none';
    document.getElementById('progressUnit7').style = 'display: none';
    document.getElementById('Unit7row1').style = 'display: none';
    document.getElementById('Unit7row2').style = 'display: none';
    document.getElementById('Unit7row3').style = 'display: none';
    document.getElementById('Unit7row4').style = 'display: none';
    document.getElementById('Unit7row5').style = 'display: none';
    document.getElementById('Unit7row6').style = 'display: none';
    document.getElementById('Unit7row7').style = 'display: none';
    document.getElementById('Unit7row8').style = 'display: none';
    document.getElementById('progressUnit8').style = 'display: none';
    document.getElementById('Unit8row1').style = 'display: none';
    document.getElementById('Unit8row2').style = 'display: none';
    document.getElementById('Unit8row3').style = 'display: none';
    document.getElementById('Unit8row4').style = 'display: none';
    document.getElementById('Unit8row5').style = 'display: none';
    document.getElementById('Unit8row6').style = 'display: none';
    document.getElementById('Unit8row7').style = 'display: none';
    document.getElementById('Unit8row8').style = 'display: none';
    document.getElementById('Unit8row9').style = 'display: none';
    document.getElementById('Unit8row10').style = 'display: none';
    document.getElementById('progressUnit9').style = 'display: none';
    document.getElementById('Unit9row1').style = 'display: none';
    document.getElementById('Unit9row2').style = 'display: none';
    document.getElementById('Unit9row3').style = 'display: none';
    document.getElementById('Unit9row4').style = 'display: none';
    document.getElementById('Unit9row5').style = 'display: none';
    document.getElementById('Unit9row6').style = 'display: none';
    document.getElementById('Unit9row7').style = 'display: none';
    document.getElementById('Unit9row8').style = 'display: none';
    document.getElementById('progressUnit10').style = 'display: none';
    document.getElementById('Unit10row1').style = 'display: none';
    document.getElementById('Unit10row2').style = 'display: none';
    document.getElementById('Unit10row3').style = 'display: none';
    document.getElementById('Unit10row4').style = 'display: none';
    document.getElementById('Unit10row5').style = 'display: none';
    document.getElementById('Unit10row6').style = 'display: none';
    document.getElementById('Unit10row7').style = 'display: none';
    document.getElementById('progressUnit11').style = 'display: none';
    document.getElementById('Unit11row1').style = 'display: none';
    document.getElementById('Unit11row2').style = 'display: none';
    document.getElementById('Unit11row3').style = 'display: none';
    document.getElementById('Unit11row4').style = 'display: none';
    document.getElementById('Unit11row5').style = 'display: none';
    document.getElementById('Unit11row6').style = 'display: none';
    document.getElementById('Unit11row7').style = 'display: none';
    document.getElementById('Unit11row8').style = 'display: none';
    document.getElementById('Unit11row9').style = 'display: none';
    document.getElementById('progressUnit12').style = 'display: none';
    document.getElementById('Unit12row1').style = 'display: none';
    document.getElementById('Unit12row2').style = 'display: none';
    document.getElementById('Unit12row3').style = 'display: none';
    document.getElementById('Unit12row4').style = 'display: none';
    document.getElementById('Unit12row5').style = 'display: none';
    document.getElementById('Unit12row6').style = 'display: none';
    document.getElementById('progressUnit13').style = 'display: none';
    document.getElementById('Unit13row1').style = 'display: none';
    document.getElementById('Unit13row2').style = 'display: none';
    document.getElementById('Unit13row3').style = 'display: none';
    document.getElementById('Unit13row4').style = 'display: none';
    document.getElementById('Unit13row5').style = 'display: none';
    document.getElementById('Unit13row6').style = 'display: none';
    document.getElementById('Unit13row7').style = 'display: none';
    document.getElementById('Unit13row8').style = 'display: none';
    document.getElementById('Unit13row9').style = 'display: none';
  }
  gameData.unitUnlocked = 0
  if (subtract(gameData.cmKnowledge,[10,0]) != 0) {
    document.getElementById("unlockUnit1").click()
  }
  for (let i = 2; i < 14; i++) {
    if (numberCorrectUnit[i] > 0) {
      document.getElementById("unlockUnit"+i).click()
    }
  }
  for (let i = 1; i < 78; i++) {
    if (levelT[i] == 1) {
      document.getElementById("buyT" + i + "cell").style.backgroundColor = "#b87333" //copper
    }
    else if (levelT[i] == 2) {
      document.getElementById("buyT" + i + "cell").style.backgroundColor = "silver"
    }
    else if (levelT[i] == 3) {
      document.getElementById("buyT" + i + "cell").style.backgroundColor = "gold"
    }
    else if (levelT[i] == 4) {
      document.getElementById("buyT" + i + "cell").style.backgroundColor = "#E5E4E2" //platinum
    }
    else if (levelT[i] == 5) {
      document.getElementById("buyT" + i + "cell").style.backgroundColor = "#b9f2ff" //diamond
    }
  }
  for (let i = 1; i < 78; i++) {
    if (upgradePurchased[i][2] == false && numberCorrect[i] >= 10) {
      upgradeArea.appendChild(upgradeButton[i][2])
    }
    if (upgradePurchased[i][3] == false && numberCorrect[i] >= 25) {
      upgradeArea.appendChild(upgradeButton[i][3])
    }
    if (upgradePurchased[i][4] == false && numberCorrect[i] >= 50) {
      upgradeArea.appendChild(upgradeButton[i][4])
    }
    if (upgradePurchased[i][5] == false && numberCorrect[i] >= 100) {
      upgradeArea.appendChild(upgradeButton[i][5])
    }
  }
  if (purchasedMusicUpgrade[1] == false) {
    document.getElementById("playerDiv").style = "display:none"
  }
  else {
    document.getElementById("playerDiv").style = "display:block"
  }
  musicCheck()
}

for (let i = 1; i < 6; i++) { //Add Music Buttons
  addMusicButton[i].classList.add("buyButton")
  addMusicButton[i].classList.add(iconmusic[i])
  addMusicButton[i].innerHTML =
    "<b>Buy Music<br><br><br>" + convertNumber(musicUpgradeCost[i]) + "</b>"
  addMusicButton[i].style =
    "background-color: white; font-size: 0.7vw; line-height:1.07vw"
  addMusicButton[i].addEventListener('click', function() {
    purchaseUpgradeAddMusic(i);
    addMusicButton[i].style.display = "none";
    })
}

function purchaseUpgradeAddMusic(i) {
  if (i == 1) {playSelected()}
  purchasedMusicUpgrade[i] = true
  document.getElementById("playerDiv").style.display = "block"
  gameData.knowledge = subtract(gameData.knowledge,musicUpgradeCost[i])
  document.getElementById("totalKnowledge").innerHTML = convertKnowledge(gameData.knowledge)
  addMusicButton[i].style.display = "none"
}

function freeK() {
  gameData.knowledge = add(gameData.knowledge,[1,21])
  gameData.cmKnowledge = add(gameData.cmKnowledge,[1,21])
}

function levelUpT(i) {
  levelT[i] += 1
  if (levelT[i] == 1) {
    document.getElementById("buyT" + i + "cell").style.backgroundColor = "#b87333" //copper
    upgradePurchased[i][1] = true
  }
  else if (levelT[i] == 2) {
    document.getElementById("buyT" + i + "cell").style.backgroundColor = "silver"
    gameData.knowledge = subtract(gameData.knowledge,upgradeCost[i][levelT[i]])
    kpsvector[i] = multiply(kpsvector[i],rewardFactor[levelT[i]])
    document.getElementById("kpsT" + i).innerHTML = "+" + convertNumber(kpsvector[i]) + " KPS"
    gameData.kps = add(multiply(kpsFromT[i],subtract(rewardFactor[levelT[i]],[1,0])),gameData.kps)
    document.getElementById("kps").innerHTML = "per second: " + convertNumber(gameData.kps) + " KPS"
    kpsFromT[i] = multiply(kpsFromT[i],rewardFactor[levelT[i]]) 
    document.getElementById("kpsFromT" + i).innerHTML = convertNumber(kpsFromT[i]) + " KPS"
    for (let j = 1; j < numberOfQ + 1; j++) {
      c = divide(kpsFromT[j],gameData.kps)
      document.getElementById("kpsPctFromT" + j).innerHTML =
        Math.round(c[0] * 10 ** (3 * c[1]) *10000)/100 + "%"
    }
    upgradePurchased[i][2] = true
    gameData.rubyCost = multiply(gameData.kps,[7.2,1]) //This is 2 hours of KPS
    document.getElementById("rubyCost").innerHTML = convertNumber(gameData.rubyCost)
  }
  else if (levelT[i] == 3) {
    document.getElementById("buyT" + i + "cell").style.backgroundColor = "gold"
    gameData.knowledge = subtract(gameData.knowledge,upgradeCost[i][levelT[i]])
    kpsvector[i] = multiply(kpsvector[i],rewardFactor[levelT[i]])
    document.getElementById("kpsT" + i).innerHTML = "+" + convertNumber(kpsvector[i]) + " KPS"
    gameData.kps = add(multiply(kpsFromT[i],subtract(rewardFactor[levelT[i]],[1,0])),gameData.kps)
    document.getElementById("kps").innerHTML = "per second: " + convertNumber(gameData.kps) + " KPS"
    kpsFromT[i] = multiply(kpsFromT[i],rewardFactor[levelT[i]]) 
    document.getElementById("kpsFromT" + i).innerHTML = convertNumber(kpsFromT[i]) + " KPS"
    for (let j=1; j < numberOfQ + 1; j++) {
      c = divide(kpsFromT[j],gameData.kps)
      document.getElementById("kpsPctFromT" + j).innerHTML =
        Math.round(c[0] * 10 ** (3 * c[1]) *10000)/100 + "%"
    }
    upgradePurchased[i][3] = true
    gameData.rubyCost = multiply(gameData.kps,[7.2,1]) //This is 2 hours of KPS
    document.getElementById("rubyCost").innerHTML = convertNumber(gameData.rubyCost)
  }
  else if (levelT[i] == 4) {
    document.getElementById("buyT" + i + "cell").style.backgroundColor = "#E5E4E2" //platinum
    gameData.knowledge = subtract(gameData.knowledge,upgradeCost[i][levelT[i]])
    kpsvector[i] = multiply(kpsvector[i],rewardFactor[levelT[i]])
    document.getElementById("kpsT" + i).innerHTML = "+" + convertNumber(kpsvector[i]) + " KPS"
    gameData.kps = add(multiply(kpsFromT[i],subtract(rewardFactor[levelT[i]],[1,0])),gameData.kps)
    document.getElementById("kps").innerHTML = "per second: " + convertNumber(gameData.kps) + " KPS"
    kpsFromT[i] = multiply(kpsFromT[i],rewardFactor[levelT[i]]) 
    document.getElementById("kpsFromT" + i).innerHTML = convertNumber(kpsFromT[i]) + " KPS"
    for (let j=1; j < numberOfQ + 1; j++) {
      c = divide(kpsFromT[j],gameData.kps)
      document.getElementById("kpsPctFromT" + j).innerHTML =
        Math.round(c[0] * 10 ** (3 * c[1]) *10000)/100 + "%"
    }
    upgradePurchased[i][4] = true
    gameData.rubyCost = multiply(gameData.kps,[7.2,1]) //This is 2 hours of KPS
    document.getElementById("rubyCost").innerHTML = convertNumber(gameData.rubyCost)
  }
  else if (levelT[i] == 5) {
    document.getElementById("buyT" + i + "cell").style.backgroundColor = "#b9f2ff" //diamond
    gameData.knowledge = subtract(gameData.knowledge,upgradeCost[i][levelT[i]])
    kpsvector[i] = multiply(kpsvector[i],rewardFactor[levelT[i]])
    document.getElementById("kpsT" + i).innerHTML = "+" + convertNumber(kpsvector[i]) + " KPS"
    gameData.kps = add(multiply(kpsFromT[i],subtract(rewardFactor[levelT[i]],[1,0])),gameData.kps)
    document.getElementById("kps").innerHTML = "per second: " + convertNumber(gameData.kps) + " KPS"
    kpsFromT[i] = multiply(kpsFromT[i],rewardFactor[levelT[i]]) 
    document.getElementById("kpsFromT" + i).innerHTML = convertNumber(kpsFromT[i]) + " KPS"
    for (let j=1; j < numberOfQ + 1; j++) {
      c = divide(kpsFromT[j],gameData.kps)
      document.getElementById("kpsPctFromT" + j).innerHTML =
        Math.round(c[0] * 10 ** (3 * c[1]) *10000)/100 + "%"
    }
    upgradePurchased[i][5] = true
    gameData.rubyCost = multiply(gameData.kps,[7.2,1]) //This is 2 hours of KPS
    document.getElementById("rubyCost").innerHTML = convertNumber(gameData.rubyCost)
  }
}

var lastUpdate = Date.now()
window.requestAnimationFrame(increment)

function increment() {
  var now = Date.now()
  var dt = (now - lastUpdate) / 1000
  lastUpdate = now
  var kn = gameData.knowledge
  var dk = multiply([dt,0],gameData.kps)
  gameData.knowledge = add(dk,kn)
  gameData.cmKnowledge = add(dk,gameData.cmKnowledge)
  document.getElementById("totalKnowledge").innerHTML = convertKnowledge(gameData.knowledge)
  if (true) { //Update how many questions correct in each unit
    numberCorrectUnit[1] = numberCorrect[1] + numberCorrect[2] + numberCorrect[3] + numberCorrect[4]
                            + numberCorrect[5] + numberCorrect[6] + numberCorrect[7] + numberCorrect[8]
    numberCorrectUnit[2] = numberCorrect[9] + numberCorrect[10] + numberCorrect[11] + numberCorrect[12]
                            + numberCorrect[13] + numberCorrect[14]
    numberCorrectUnit[3] = numberCorrect[15] + numberCorrect[16] + numberCorrect[17] + numberCorrect[18]
                            + numberCorrect[19] + numberCorrect[20]
    numberCorrectUnit[4] = numberCorrect[21] + numberCorrect[22] + numberCorrect[23] + numberCorrect[24]
                            + numberCorrect[25] + numberCorrect[26]
    numberCorrectUnit[5] = numberCorrect[27] + numberCorrect[28] + numberCorrect[29]
    numberCorrectUnit[6] = numberCorrect[30] + numberCorrect[31] + numberCorrect[32] + numberCorrect[33]
                            + numberCorrect[34]
    numberCorrectUnit[7] = numberCorrect[35] + numberCorrect[36] + numberCorrect[37] + numberCorrect[38]
                            + numberCorrect[39] + numberCorrect[40]
    numberCorrectUnit[8] = numberCorrect[41] + numberCorrect[42] + numberCorrect[43] + numberCorrect[44]
                            + numberCorrect[45] + numberCorrect[46] + numberCorrect[47] + numberCorrect[48]
    numberCorrectUnit[9] = numberCorrect[49] + numberCorrect[50] + numberCorrect[51] + numberCorrect[52]
                            + numberCorrect[53] + numberCorrect[54]
    numberCorrectUnit[10] = numberCorrect[55] + numberCorrect[56] + numberCorrect[57] + numberCorrect[58]
                            + numberCorrect[59]
    numberCorrectUnit[11] = numberCorrect[60] + numberCorrect[61] + numberCorrect[62] + numberCorrect[63]
                            + numberCorrect[64] + numberCorrect[65] + numberCorrect[66]
    numberCorrectUnit[12] = numberCorrect[67] + numberCorrect[68] + numberCorrect[69] + numberCorrect[70]
    numberCorrectUnit[13] = numberCorrect[71] + numberCorrect[72] + numberCorrect[73] + numberCorrect[74]
                            + numberCorrect[75] + numberCorrect[76] + numberCorrect[77]
  }
  document.getElementById("KProgressBarUnit1").value =
    divide(gameData.cmKnowledge,KNeededToUnlock[1])[0] * 10 ** (3 * divide(gameData.cmKnowledge,KNeededToUnlock[1])[1])
  document.getElementById("KProgressUnit1").innerHTML = "<font color='blue'>" + 
    convertNumber(gameData.cmKnowledge) + " / " + convertNumber(KNeededToUnlock[1]) + "</font>"
  if (subtract(gameData.cmKnowledge,KNeededToUnlock[1]) != 0) {
    document.getElementById("KProgressUnit1").innerHTML = "<font color='blue'>" + convertNumber(KNeededToUnlock[1]) + " / " +
      convertNumber(KNeededToUnlock[1]) + " >>> Complete!</font>"
    document.getElementById("unlockUnit1").style.visibility = "visible"
  }
  for (let i = 2; i < 14; i++) {
    document.getElementById("KProgressBarUnit"+i).value =
      divide(gameData.cmKnowledge,KNeededToUnlock[i])[0] * 10 ** (3 * divide(gameData.cmKnowledge,KNeededToUnlock[i])[1])
    document.getElementById("KProgressUnit"+i).innerHTML = "<font color='blue'>" + 
      convertNumber(gameData.cmKnowledge) + " / " + convertNumber(KNeededToUnlock[i]) + "</font>"
    document.getElementById("KPSProgressBarUnit"+i).value =
      divide(gameData.kps,KPSNeededToUnlock[i])[0] * 10 ** (3 * divide(gameData.kps,KPSNeededToUnlock[i])[1])
    document.getElementById("KPSProgressUnit"+i).innerHTML = "<font color='red'>" + 
      convertNumber(gameData.kps) + " / " + convertNumber(KPSNeededToUnlock[i]) + "</font>"
    document.getElementById("correctProgressBarUnit"+i).value =
      numberCorrectUnit[i-1]/correctNeededtoUnlock[i]
    document.getElementById("correctProgressUnit"+i).innerHTML = "<font color='green'>" + 
      numberCorrectUnit[i-1] + " / " + correctNeededtoUnlock[i] + "</font>"
    if (subtract(gameData.cmKnowledge,KNeededToUnlock[i]) != 0) {
      document.getElementById("KProgressUnit"+i).innerHTML = "<font color='blue'>" + convertNumber(KNeededToUnlock[i]) + " / " +
        convertNumber(KNeededToUnlock[i]) + " >>> Complete!</font>"
    }
    if (subtract(gameData.kps,KPSNeededToUnlock[i]) != 0) {
      document.getElementById("KPSProgressUnit"+i).innerHTML = "<font color='red'>" + convertNumber(KPSNeededToUnlock[i]) + " / " +
        convertNumber(KPSNeededToUnlock[i]) + " >>> Complete!</font>"
    }
    if (numberCorrectUnit[i-1] >= correctNeededtoUnlock[i]) {
      document.getElementById("correctProgressUnit"+i).innerHTML = "<font color='green'>" + correctNeededtoUnlock[i]
        + " / " + correctNeededtoUnlock[i] + " >>> Complete!</font>"
    }
    if (subtract(gameData.cmKnowledge,KNeededToUnlock[i]) != 0
        && subtract(gameData.kps,KPSNeededToUnlock[i]) != 0
        && numberCorrectUnit[i-1] >= correctNeededtoUnlock[i]) {
          document.getElementById("unlockUnit"+i).style.visibility = "visible"
    }
  }
  for (let i = 1; i < numberOfQ+1; i++) {
    if (subtract(gameData.knowledge,costT[i]) != 0) {
      document.getElementById("buyT"+i).disabled = false
      document.getElementById("buyT"+i).classList.add("shinyButton2")
    }
    else {
      document.getElementById("buyT"+i).disabled = true
      document.getElementById("buyT"+i).classList.remove("shinyButton2")
    }
  }
  for (let i = 1; i < numberOfQ+1; i++) {
    for (let j = 2; j < 6; j++) {
      if (subtract(gameData.knowledge,upgradeCost[i][j]) != 0 && upgradePurchased[i][j-1] == true) {
        upgradeButton[i][j].disabled = false
      }
      else {
        upgradeButton[i][j].disabled = true
      }
    }
  }
  if (subtract(gameData.knowledge,gameData.rubyCost) != 0) {
    document.getElementById("buyRubyButton").disabled = false
    document.getElementById("buyRubyButton").classList.add("shinyButton2")
  }
  else {
    document.getElementById("buyRubyButton").disabled = true
    document.getElementById("buyRubyButton").classList.remove("shinyButton2")
  }
  for (let i = 1; i < 6; i++) {
    if (subtract(gameData.knowledge,musicUpgradeCost[i]) != 0 && purchasedMusicUpgrade[i] == false
      && purchasedMusicUpgrade[i-1] == true) {
        musicButtonAppear[i]++
        if (musicButtonAppear[i] == 1) {upgradeArea.appendChild(addMusicButton[i])}
        addMusicButton[i].style.display = "inline-block"
        addMusicButton[i].disabled = false
    }
    else {
      addMusicButton[i].disabled = true
    }
  }
  window.requestAnimationFrame(increment)
}

var upgradeButton = [
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
  [0,0,document.createElement("button"),document.createElement("button"),document.createElement("button"),document.createElement("button")],
]
for (let i = 1; i < 78; i++) {
  for (let j = 2; j < 6; j++) {
    upgradeButton[i][j].innerHTML = "<b>Lvl Up T-" + i + "<br><br><br>"
      + upgradeCost[i][j][0] + " " + abbr[upgradeCost[i][j][1]] + "</b>"
    upgradeButton[i][j].style =
      "background-color: white; font-size: 0.7vw; line-height:1.07vw"
    upgradeButton[i][j].classList.add("buyButton")
    upgradeButton[i][j].addEventListener('click', function() {
      levelUpT(i);
      upgradeButton[i][j].style.display = "none";
    })
    if (j == 2) {
      upgradeButton[i][j].classList.add('iconsilver')
    }
    else if (j == 3) {
      upgradeButton[i][j].classList.add('icongold')
    }
    else if (j == 4) {
      upgradeButton[i][j].classList.add('iconplatinum')
    }
    else if (j == 5) {
      upgradeButton[i][j].classList.add('icondiamond')
    }
  }
}

var newDiv =
  [0,document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div"),document.createElement("div"),document.createElement("div"),
  document.createElement("div"),document.createElement("div")
]

function achievementCheck() {
  var hadAchievement = Array(451).fill(0)
  //So weird, if I defined hadAchievement = haveAchievement, then "had" would change whenever "have" changed
  for (let i = 1; i < 451; i++) {
    hadAchievement[i] = haveAchievement[i]
  }
  var m = 0
  for (let i = 1; i < 22; i++) { //Cumulative knowledge achievements
    if (subtract(gameData.cmKnowledge,[1,i]) != 0) {
      m++
      haveAchievement[i] = 1
      document.getElementById("achievement"+i).style = "background-color: white"
      document.getElementById("achievement"+i).style.fontWeight = "bold"
      document.getElementById("achievement"+i).style.lineHeight = "1.56vw"
      document.getElementById("achievement"+i).innerHTML = "1 " + abbr[i]
      document.getElementById("achievement"+i).title = "Earned 1 " + abbr[i] + " cumulative Knowledge."
      document.getElementById("achievement"+i).style.backgroundImage = "url('lightbulb.jpg')"
      document.getElementById("achievement"+i).style.backgroundRepeat = "no-repeat";
      document.getElementById("achievement"+i).style.backgroundSize = "2.08vw";
      document.getElementById("achievement"+i).style.backgroundPosition = "center";
      document.getElementById("achievement"+i).style.backgroundColor = "transparent";
      if (i > 14 && i < 21) {
        document.getElementById("achievement"+i).style.fontSize = "0.62vw"
      }
      else {
        document.getElementById("achievement"+i).style.fontSize = "0.73vw"
      }
    }
  }
  for (let i = 1; i < 14; i++) { //Unit unlocked achievements
    var j = i + 21
    if (gameData.unitUnlocked >= i) {
      m++
      haveAchievement[j] = 1
      document.getElementById("achievement"+j).style.textAlign = "left"
      document.getElementById("achievement"+j).style.fontWeight = "bold"
      document.getElementById("achievement"+j).style.color = "white"
      document.getElementById("achievement"+j).style.lineHeight = "1.04vw"
      document.getElementById("achievement"+j).innerHTML = "<br>&nbsp;U" + i
      document.getElementById("achievement"+j).title = "Unlocked Unit " + i
      document.getElementById("achievement"+j).style.fontSize = "0.62vw"
      document.getElementById("achievement"+j).style.backgroundImage = "url('unlock.png')"
      document.getElementById("achievement"+j).style.backgroundRepeat = "no-repeat";
      document.getElementById("achievement"+j).style.backgroundSize = "2.08vw";
      document.getElementById("achievement"+j).style.backgroundPosition = "center";
      document.getElementById("achievement"+j).style.backgroundColor = "white";
    }
  }
  for (let i = 1; i < 12; i++) { //Questions answered correctly achievements
    var j = i + 34
    var indexNumber = [0,1,10,25,50,100,250,500,1000,2500,5000,10000]
    var index = ["0","1","10","25","50","100","250","500","1 K","2.5 K","5 K","10 K"]
    var totalNumberCorrect = 0
    for (let i = 1; i < 14; i++) {
      totalNumberCorrect += numberCorrectUnit[i]
    }
    if (totalNumberCorrect >= indexNumber[i]) {
      m++
      haveAchievement[j] = 1
      document.getElementById("achievement"+j).style.lineHeight = "1.04vw"
      document.getElementById("achievement"+j).style.fontWeight = "bold"
      document.getElementById("achievement"+j).innerHTML = index[i]
      if (i == 1) {
        document.getElementById("achievement"+j).title = "Answered " + index[i] + " question correctly"
      }
      else {
        document.getElementById("achievement"+j).title = "Answered " + index[i] + " questions correctly"
      }
      document.getElementById("achievement"+j).style.fontSize = "0.83vw"
      document.getElementById("achievement"+j).style.backgroundImage = "url('question.png')"
      document.getElementById("achievement"+j).style.backgroundRepeat = "no-repeat";
      document.getElementById("achievement"+j).style.backgroundSize = "2.08vw";
      document.getElementById("achievement"+j).style.backgroundPosition = "bottom";
      document.getElementById("achievement"+j).style.backgroundColor = "white";
    }
  }
  for (let i = 1; i < 5; i++) { //Greek letter achievements
    var j = i + 45
    var index = ["0","1","5","15","24"]
    var numberUniqueGreeks = 0
    for (let k = 1; k < 25; k++) {
      numberUniqueGreeks += gotGreek[k]
    }
    if (numberUniqueGreeks >= index[i]) {
      m++
      haveAchievement[j] = 1
      document.getElementById("achievement"+j).style.lineHeight = "1.3vw"
      document.getElementById("achievement"+j).style.fontWeight = "bold"
      document.getElementById("achievement"+j).style.textAlign = "left"
      document.getElementById("achievement"+j).innerHTML = "&nbsp;" + index[i]
      if (i == 1) {
        document.getElementById("achievement"+j).title = "Collected " + index[i] + " Greek letter"
      }
      else {
        document.getElementById("achievement"+j).title = "Collected " + index[i] + " unique Greek letters"
      }
      document.getElementById("achievement"+j).style.fontSize = "0.83vw"
      document.getElementById("achievement"+j).style.backgroundImage = "url('greek.png')"
      document.getElementById("achievement"+j).style.backgroundRepeat = "no-repeat";
      document.getElementById("achievement"+j).style.backgroundSize = "2.08vw";
      document.getElementById("achievement"+j).style.backgroundPosition = "right";
      document.getElementById("achievement"+j).style.backgroundColor = "white";
    }
  }
  for (let i = 1; i < 8; i++) { //Ruby achievements
    var j = i + 49
    var index = [0,1,10,25,50,100,250,500]
    if (gameData.rubies >= index[i]) {
      m++
      haveAchievement[j] = 1
      document.getElementById("achievement"+j).style.lineHeight = "1.67vw"
      document.getElementById("achievement"+j).style.color = "white"
      document.getElementById("achievement"+j).innerHTML = "<b>" + index[i] + "</b>"
      if (i == 1) {
        document.getElementById("achievement"+j).title = "Collected " + index[i] + " ruby"
      }
      else {
        document.getElementById("achievement"+j).title = "Collected " + index[i] + " rubies"
      }
      document.getElementById("achievement"+j).style.fontSize = "0.83vw"
      document.getElementById("achievement"+j).style.backgroundImage = "url('ruby.png')"
      document.getElementById("achievement"+j).style.backgroundRepeat = "no-repeat";
      document.getElementById("achievement"+j).style.backgroundSize = "2.92vw";
      document.getElementById("achievement"+j).style.backgroundPosition = "center";
      document.getElementById("achievement"+j).style.backgroundColor = "white";
    }
  }
  for (let i = 1; i < 5; i++) { //Streak achievements
    var j = i + 56
    var index = [0,10,50,100,250]
    if (gameData.streakHighest >= index[i]) {
      m++
      haveAchievement[j] = 1
      document.getElementById("achievement"+j).style.lineHeight = "2.5vw"
      document.getElementById("achievement"+j).innerHTML = "<b>" + index[i] + "</b>"
      document.getElementById("achievement"+j).title = "Answered " + index[i] + " unit questions correctly in a row"
      document.getElementById("achievement"+j).style.fontSize = "0.83vw"
      document.getElementById("achievement"+j).style.backgroundImage = "url('fire-streak.png')"
      document.getElementById("achievement"+j).style.backgroundRepeat = "no-repeat";
      document.getElementById("achievement"+j).style.backgroundSize = "2.92vw";
      document.getElementById("achievement"+j).style.backgroundPosition = "center";
      document.getElementById("achievement"+j).style.backgroundColor = "white";
    }
  }
  for (let i = 1; i < 6; i++) { //Music achievements
    var j = i + 60
    if (purchasedMusicUpgrade[i] == true) {
      m++
      haveAchievement[j] = 1
      document.getElementById("achievement"+j).style.lineHeight = "2.5vw"
      document.getElementById("achievement"+j).title = "Unlocked Music - " + musicLevel[i] + " Level"
      document.getElementById("achievement"+j).style.fontSize = "0.83vw"
      document.getElementById("achievement"+j).style.backgroundImage = "url('" + musicCheckName[i] + ".png')"
      document.getElementById("achievement"+j).style.backgroundRepeat = "no-repeat";
      document.getElementById("achievement"+j).style.backgroundSize = "3.38vw";
      document.getElementById("achievement"+j).style.backgroundPosition = "right";
      document.getElementById("achievement"+j).style.backgroundColor = "white";
    }
  }
  for (let i = 1; i < 78; i++) { //Metal level achievements
    for (let j = 1; j < 6; j++) {
      var k = 65 + 5 * (i-1) + j
      if (upgradePurchased[i][j] == true) {
        m++
        haveAchievement[k] = 1
        if (j == 1) {
          document.getElementById("achievement"+k).style.backgroundImage = "url('iconcopper.png')"
          document.getElementById("achievement"+k).title = "Reached Copper Level for Type-" + i + " Question"
        }
        else if (j == 2) {
          document.getElementById("achievement"+k).style.backgroundImage = "url('iconsilver.png')"
          document.getElementById("achievement"+k).title = "Reached Silver Level for Type-" + i + " Question"
        }
        else if (j == 3) {
          document.getElementById("achievement"+k).style.backgroundImage = "url('icongold.png')"
          document.getElementById("achievement"+k).title = "Reached Gold Level for Type-" + i + " Question"
        }
        else if (j == 4) {
          document.getElementById("achievement"+k).style.backgroundImage = "url('iconplatinum.png')"
          document.getElementById("achievement"+k).title = "Reached Platinum Level for Type-" + i + " Question"
        }
        else if (j == 5) {
          document.getElementById("achievement"+k).style.backgroundImage = "url('icondiamond.png')"
          document.getElementById("achievement"+k).title = "Reached Diamond Level for Type-" + i + " Question"
        }
        document.getElementById("achievement"+k).style.lineHeight = "2.08vw"
        document.getElementById("achievement"+k).innerHTML = "<b>" + i + "</b>"
        document.getElementById("achievement"+k).style.fontSize = "0.62vw"
        document.getElementById("achievement"+k).style.backgroundRepeat = "no-repeat";
        document.getElementById("achievement"+k).style.backgroundSize = "2.6vw";
        document.getElementById("achievement"+k).style.backgroundPosition = "center";
        document.getElementById("achievement"+k).style.backgroundColor = "white";
      }
    }
  }
  numberAchievements = m
  document.getElementById("handle4").innerHTML = "Achievements: (" + m + "/450)"
  var timeSinceInitialize = Date.now() - initializeTime
  if (timeSinceInitialize >= 1500) {
    for (let p = 1; p < 451; p++) {
      if (hadAchievement[p] != haveAchievement[p]) {
        const div = document.getElementById("achievement"+p)
        const clone = div.cloneNode(true)
        clone.id = "achievementIcon"+p
        clone.style.position = "absolute"
        clone.classList.add("achievementIcon")
        clone.style.left = "2.5%"
        clone.style.top = "17%"
        clone.title = ""
        clone.addEventListener("click",function(){this.parentNode.classList.add("slide-away")})
        clone.style.cursor = "pointer"
        newDiv[p].style.position = "absolute"
        newDiv[p].style.left = "70%"
        newDiv[p].style.top = "4%"
        newDiv[p].style.width = "30%"
        newDiv[p].style.fontSize = "1vw"
        newDiv[p].innerHTML = 
          `<button style='padding:0px; border:0px; cursor:pointer'
            onclick='this.parentNode.classList.add("slide-away")'>
          <div><table border='3' style='table-layout: fixed; width:100%; background:lightblue; font-size: 1vw'>
          <tr><td style='padding:0.15vw; text-align:left'>`
          + "<div style='padding-left:13%'>"
          + "<div><b>NEW ACHIEVEMENT UNLOCKED!</b><br><big>"
          + document.getElementById("achievement"+p).title + "</big></div>"
          + "</div></td></tr></table></div>"
          + "</button>"
        newDiv[p].appendChild(clone)
        document.getElementById("container").appendChild(newDiv[p])
        if (p > 21 && p < 35) {
          achievementSound.pause()
          achievementSound.currentTime = 0
          unlockSound.play()
        }
        else {
          achievementSound.pause()
          achievementSound.currentTime = 0
          achievementSound.play()
        }
      }
    }
  }
}

function removeParentDiv(e) {
  e.parentNode.parentNode.parentNode.removeChild(e.parentNode.parentNode)
}

function statsUpdate() {
  document.getElementById("streak").innerHTML = "Streak: " + gameData.streak
  document.getElementById("statKnowledge").innerHTML
    = "<b>Current Knowledge:</b> " + convertNumber(gameData.knowledge)
  document.getElementById("statKPS").innerHTML
    = "<b>Current KPS:</b> " + convertNumber(gameData.kps)
  document.getElementById("statCmKnowledge").innerHTML
    = "<b>Cumulative Knowledge:</b> " + convertNumber(gameData.cmKnowledge)
  var numberUniqueGreeks = 0
  var numberTotalGreeks = 0
  for (let k = 1; k < 25; k++) {
    numberUniqueGreeks += gotGreek[k]
    numberTotalGreeks += gotGreekTotal[k]
  }
  document.getElementById("statUniqueGreeks").innerHTML
    = "<b>Unique Greek Letters Obtained:</b> " + numberUniqueGreeks
  document.getElementById("statTotalGreeks").innerHTML
    = "<b>Total Greek Letters Clicked:</b> " + numberTotalGreeks
  document.getElementById("statCurrentStreak").innerHTML
    = "<b>Current Streak:</b> " + gameData.streak
  document.getElementById("statHighestStreak").innerHTML
    = "<b>Highest Streak:</b> " + gameData.streakHighest
  document.getElementById("statRubies").innerHTML
    = "<b>Rubies Found:</b> " + gameData.rubies
  document.getElementById("statAchievements").innerHTML
    = "<b>Achievements Unlocked:</b> " + numberAchievements
  var totalNumberCorrect = 0
  for (let i = 1; i < 14; i++) {
    totalNumberCorrect += numberCorrectUnit[i]
  }
  document.getElementById("statTotalCorrect").innerHTML
    = "<b>Total Unit Questions Answered Correctly:</b> " + totalNumberCorrect
  for (let i = 1; i < 14; i++) {
    document.getElementById("statUnit"+i+"Correct").innerHTML
      = "<b>Unit " + i + " Questions Answered Correctly:</b> " + numberCorrectUnit[i]
  }
  for (let i = 1; i < 25; i++) {
    if (gotGreek[i] == 1) {
      greekText[i] = "<font color=green><b>" + greekTextInitial[i] + "</b></font>"
    }
    else {
      greekText[i] = "<font color=red>" + greekTextInitial[i] + "</font>"
    }
    document.getElementById("whichGreeks").innerHTML = greekText[1]+greekText[2]+greekText[3]+greekText[4]+greekText[5]+
      greekText[6]+greekText[7]+greekText[8]+greekText[9]+greekText[10]+greekText[11]+greekText[12]+greekText[13]+greekText[14]+
      greekText[15]+greekText[16]+greekText[17]+greekText[18]+greekText[19]+greekText[20]+greekText[21]+greekText[22]+greekText[23]+
      greekText[24]
  }
}

function musicCheck() {
  for (let i = 1; i < 6; i++) {
    if (purchasedMusicUpgrade[i] == true) {
      document.getElementById(musicCheckName[i]).style.display = "block"
    }
    else {
      document.getElementById(musicCheckName[i]).style.display = "none"

    }
  }
}

setInterval(saveGame,1000) //Auto-save every second
setInterval(greek,360000) //Clickable Greek letter every 6 minutes - 360000 delay
setInterval(function() {achievementCheck(); statsUpdate(); musicCheck()},1000)