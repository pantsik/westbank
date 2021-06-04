const PLACES_HEIGHT = 68;
const DOORS_HEIGHT = 322;
const SCORE_WIDTH = 170;
const SCENE_WIDTH = 720;
const NORMAL_FRAME_RATE = 60;
const DELAYED_FRAME_RATE = 20;
const DOOR_FRAMES = 7;
const OUTLAW_FRAMES = 6;
const SMOKE_FRAMES = 5;
const DOLLAR_FRAMES = 7;
const HANDSUP_FRAMES = 9;
const HANDSUP_FREQUENCY = 0.2;
const CITIZEN_LIMIT = 100;
const KID_LIMIT = 150;
const STARTING_CLOSING_COUNTER = 4 * 60 * NORMAL_FRAME_RATE + 60;  // that is 4 mins
const EXTRA_LIFE_SCORE = 20000;
const MAX_DAY = 7; // Beyond this day no new visitors are added, openDoorFrequency doesn't increase and outlaw limits don't decrease
const HOW_TO_PLAY_TITLE = "How to play";
const HOW_TO_PLAY_TEXT = "West Bank has 12 doors with one cashier each. Only 3 doors are visible at a time. Your job as a banker is to accept at least one deposit from each of the 12 cashiers by the bank's clients. But be careful! Various robbers want to rob your bank. You must shoot any robber who has drawn a gun but not before he draws. There is also a kid wearing 7 hats which you can shoot to reveal a money bag or a bomb hidden underneath them.\n\nIf the bank closes before you accept one deposit from each door you will lose a life.";
const CONTROLS_TITLE = "Controls";
const CONTROLS_TEXT = "\nLong finger swipe or long mouse drag left / right:\n3 doors movement left / right *\n\nShort finger swipe or short mouse drag left / right:\n1 door movement left / right *\n\nTouch or click an opened door: Shoot the visitor\n\n* Movement works when all the doors are closed.";
const ABOUT_GAME_TITLE = "About the game";
const ABOUT_GAME_TEXT = "\nWest Bank Remastered v1.1\n\nA remastered version of a ZX-Spectrum game from 1985.\n\nCoding: Panos Tsikogiannopoulos\n\nGraphics: Yiannis and Panos Tsikogiannopoulos";
const MARGIN_LEFT = 332;
let OUTLAW1_LIMIT, OUTLAW2_LIMIT, OUTLAW3_LIMIT;
let gameOver = false; // It is declared as false here because it has to do with the music loop
let newEntryPos = 99;
let bgImg0, bgImg1, bgImg2;
let gunshot_hero, gunshot_outlaw, money, boom_sound, hey, scream, yee_haw, all_deposits, game_over_theme, menu_music;
let rand, randomDoor, i, v, b, dayGrab, c;
let score, lives;
let mouseXClick, mouseYClick, mouseXPressed, mouseYPressed, mouseUnclicked, mouseXDrag;
let x0, x1, x2;
let scrollSpeed, scrolling, canScroll;
let frameOpen=[], frameClose=[], door=[], counter=[], visitor=[], visitors=[], newVisitors=[], visitorsImg=[];
let openedDoor=[], doorIsOpening=[], doorClicked=[], canShootMoney=[], dollars=[], places=[];
let openDoorFrequency, changeLives, extraLife, newDay;
let kidFrame=[], kidRandom=[], kidStatus=[], outlaw4Random=[], handsUpRandom=[];
let changeLivesCounter, running, extraLifeInterval, dayCounter, day;
let closingCounter, previousCounter, menuScreen, hiscores, nickname, menuItemHow, menuItemControls, menuItemAbout;
let entries=[], list=[], list_new=[], new_entry=[];
let startScript = false;
let inputDiv = document.getElementById("inputid");

function preload() {
  menu = loadImage("menu.png");
  bgImg0 = loadImage("places.png");
  bgImg1 = loadImage("3doors.png");
  bgImg2 = loadImage("score.png");
  doorSpriteSheet = loadImage("door_SpriteSheet.png");
  visitorsImg[0] = loadImage("citizen_sir.png");
  visitorsImg[1] = loadImage("citizen_lady.png");
  visitorsImg[2] = loadImage("kid_hats_SpriteSheet.png");
  visitorsImg[3] = loadImage("outlaw1_alive.png");
  visitorsImg[5] = loadImage("outlaw2_calm.png");
  visitorsImg[4] = loadImage("outlaw3_alive.png");
  visitorsImg[6] = loadImage("outlaw4_calm.png");
  visitorsImg[7] = loadImage("outlaw5_calm.png");
  visitorsImg[8] = loadImage("outlaw6_calm.png");
  visitorsImg[9] = loadImage("outlaw7_calm.png");
  visitorsImg[10] = loadImage("outlaw2_draws.png");
  visitorsImg[11] = loadImage("outlaw4_draws.png");
  visitorsImg[12] = loadImage("outlaw5_draws.png");
  visitorsImg[13] = loadImage("outlaw6_draws.png");
  visitorsImg[14] = loadImage("outlaw7_draws.png");
  citizen_sir_handsup_SpriteSheet = loadImage("citizen_sir_handsup_SpriteSheet.png");
  citizen_lady_handsup_SpriteSheet = loadImage("citizen_lady_handsup_SpriteSheet.png");
  outlaw1_dead_SpriteSheet = loadImage("outlaw1_dead_SpriteSheet.png");
  outlaw2_dead_SpriteSheet = loadImage("outlaw2_dead_SpriteSheet.png");
  outlaw3_dead_SpriteSheet = loadImage("outlaw3_dead_SpriteSheet.png");
  outlaw4_dead_SpriteSheet = loadImage("outlaw4_dead_SpriteSheet.png");
  outlaw5_dead_SpriteSheet = loadImage("outlaw5_dead_SpriteSheet.png");
  outlaw6_dead_SpriteSheet = loadImage("outlaw6_dead_SpriteSheet.png");
  outlaw7_dead_SpriteSheet = loadImage("outlaw7_dead_SpriteSheet.png");
  smoke_SpriteSheet = loadImage("smoke_SpiteSheet.png");
  dollar_SpriteSheet = loadImage("dollar_SpriteSheet.png");
  kid_bomb = loadImage("kid_bomb.png");
  kid_money = loadImage("kid_money.png");
  kid_nohat = loadImage("kid_nohat.png");
  boom = loadImage("boom.png");
  bang = loadImage("bang.png");
  dont_shoot = loadImage("dont_shoot.png");
  citizen_sir_handsup_shoot = loadImage("citizen_sir_handsup_shoot.png");
  citizen_lady_handsup_shoot = loadImage("citizen_lady_handsup_shoot.png");
  cowboy_small = loadImage("cowboy_small.png");
  dollar_small = loadImage("dollar_small.png");
  numbers = loadImage("numbers.png");
  pause_sign = loadImage("pause_sign.png");
  paused = loadImage("paused.png");
  sign_newday = loadImage("sign_newday.png");
  game_over = loadImage("game_over.png");
  high_scores_table = loadImage("high_scores_table.png");

  gunshot_hero = loadSound("gunshot_hero.wav");
  gunshot_outlaw = loadSound("gunshot_outlaw.wav");
  money = loadSound("money.mp3");
  boom_sound = loadSound("boom.mp3");
  hey = loadSound("hey.wav");
  scream = loadSound("scream.wav");
  yee_haw = loadSound("yee-haw.mp3");
  all_deposits = loadSound("all_deposits.wav");
  game_over_theme = loadSound("game_over_theme.mp3");
  //menu_music = loadSound("The good the bad and the ugly - Theme.mp3");

  rioGrande = loadFont("RioGrande.ttf");
  algerian = loadFont("alger.ttf");
  kristen = loadFont("ITCKRIST.ttf");
  hiscores = loadStrings("boring_data_file.txt");
}

function setup() {
  createCanvas(SCENE_WIDTH + SCORE_WIDTH, PLACES_HEIGHT + DOORS_HEIGHT);
  x0 = -SCENE_WIDTH;
  x2 = SCENE_WIDTH - 1;
  gunshot_hero.setVolume(0.3);
  money.setVolume(0.3);
  gunshot_outlaw.setVolume(1);
  boom_sound.setVolume(1);
  hey.setVolume(0.2);
  scream.setVolume(1);
  yee_haw.setVolume(2);
  all_deposits.setVolume(0.3);
  //menu_music.setVolume(0.3);
  //menu_music.playMode("restart");
  game_over_theme.setVolume(0.5);
  cursor(CROSS);
  textFont(rioGrande);

  createEntries();
  inputDiv.style.display = "block";

  noLoop();
}

function startGame() {
  inputDiv.style.display = "none";
  nickname = document.getElementById("nickname").value;
  if (nickname == "") {
    nickname = "Anonymous";
  }
  startScript = true;
  mainMenu();
}

function sendEmail() {
  let params = {
  from_name: nickname,
  message: list_new
  };
  emailjs.send( 'service_d7c6m1o', 'template_ac23j6g', params)
  .then(function(response) {
     console.log('Mail send SUCCESS!', response.status, response.text);
  }, function(error) {
     console.log('Mail send FAILED...', error);
  });
}

function showHiScores() {
  image(high_scores_table, MARGIN_LEFT + 25, 0, 368, 389);
  strokeWeight(2);
  stroke(73, 46, 19);
  textFont(algerian);
  textSize(25);
  fill(220, 146, 59);
  for (i = 0; i < entries.length; i++) {
    textAlign(LEFT);
    text(str(i+1) + ".", MARGIN_LEFT + 45, 35*i + 61);
    text(entries[i][0].substring(0, 15), MARGIN_LEFT + 85, 35*i + 61);
    textAlign(RIGHT);
    text(entries[i][1], MARGIN_LEFT + 378, 35*i + 61);
  }
  textAlign(LEFT);
}

function createEntries() {
  list = split(hiscores[0], ",");
  for (i = 0; i < list.length - 1; i+=2) {
    entries.push([list[i], int(list[i+1])]);
  }
}

function updateEntries() {
  entries.splice(newEntryPos, 0, new_entry); // Adds the new entry
  entries.splice(entries.length - 1, 1); // Deletes the last entry
}

function newEntryPosition(sc) {
  for (i = 0; i < entries.length; i++) {
    if (sc > entries[i][1]) {
      return i;
    }
  }
  return 99;
}

function mainMenu() {
  noLoop();
  menuScreen = true;
  running = false;
  score = 0;
  lives = 3;
  door = [0, 1, 2];
  visitors = [0, 1, 2]; // The first visitor to be added in this array is newVisitors[day-1] = 3
  newVisitors = [3, 5, 4, 6, 7, 8, 9];  // There's no  mistake in numbering
  openDoorFrequency = 0.00333; // It will become 0.01 on day 1
  OUTLAW1_LIMIT = 105; // It is set to 100 on first appearence on day 1
  OUTLAW2_LIMIT = 80; // It is set to 70 on first appearence on day 2
  OUTLAW3_LIMIT = 85; // It is set to 70 on first appearence on day 3
  newDay = true;
  dollars = [false, false, false, false, false, false, false, false, false, false, false, false];
  places = [0, 1, 2];
  extraLifeInterval = EXTRA_LIFE_SCORE;
  gameOver = false;
  dayCounter = 0;
  day = 1;
  menuItemHow = true;
  menuItemControls = true;
  menuItemAbout = true;

  image(menu, 0, 0);
  showHiScores();
  // if (! gameOver) { // Don't start over the music if it comes from a game over, so that the game over music will continue playing
  //   menu_music.loop();
  // }
  if (newEntryPos < 99) {
    //noFill();
    fill(255, 255, 0, 100);
    strokeWeight(4);
    stroke(255, 128, 0);
    rect(MARGIN_LEFT + 35, newEntryPos * 35 + 34, 352, 35, 10);
    strokeWeight(0);
  }
}

function draw() {
  if (running) {
    if (! newDay) {
      if (! changeLives) {
        checkDeposits();
        checkDrag();
        checkShooting();
        openDoors();
        counters();
      } else {
        changeLivesSequence();
      }
    } else {
      if (! gameOver) {
        startNewDay();
      } else {
        gameOverFunc();
      }
    }
  }
}

function startNewDay() {
  frameRate(2);
  closingCounter = STARTING_CLOSING_COUNTER;
  previousCounter = closingCounter;
  if (day == 1 && dayCounter == 0) {
    dayCounter = 11;
  }
  if (dayCounter <= 10 && day > 1) { // flashing dollars
    if (extraLife) { // To control exrta life while finishing the day
      changeLivesSequence();
    }
    if (dayCounter == 1) { // This is the smallest value because it is increased after calling the startNewLife function
      all_deposits.play();
    }
    if (dayCounter / 2 == floor(dayCounter / 2)) {
      image(bgImg0, 0, 0);
      image(numbers, 0, 0);
    } else {
      dollars = [true, true, true, true, true, true, true, true, true, true, true, true];
      updateDepositsAll();
    }
  } else if (dayCounter > 12) { // new day sign
    image(sign_newday, 150, 100, 400, 200);
    textSize(80);
    fill(153, 66, 0);
    textFont(rioGrande);
    text("DAY " + day, 250, 230);
    if (dayCounter == 18) {
      image(dayGrab, 150, 100, 400, 200);
      newDay = false;
      dollars = [false, false, false, false, false, false, false, false, false, false, false, false];
      //dollars = [false, true, true, true, true, true, true, true, true, true, true, true];
      places = [0, 1, 2];
      if (day <= MAX_DAY) {
        visitors.push(newVisitors[(day - 1)]); // add a new visitor
        openDoorFrequency += 0.00667;
        OUTLAW1_LIMIT -= 5;
        OUTLAW2_LIMIT -= 5;
        OUTLAW3_LIMIT -= 5;
      }
      startNewLife();
    }
  }
  dayCounter++;
}

function startNewLife() {
  x1 = 0;
  scrollSpeed = 10;
  scrolling = false;
  canScroll = false;
  mouseUnclicked = false;
  mouseXDrag = 0;
  frameOpen = [0, 0, 0];
  frameClose = [0, 0, 0];
  counter = [0, 0, 0];
  visitor = [9, 9, 9];
  openedDoor = [false, false, false];
  doorIsOpening = [false, false, false]
  doorClicked = [false, false, false];
  canShootMoney = [false, false, false];
  kidFrame = [1, 1, 1];
  kidStatus = [0, 0, 0]; // 0 is null, 1 is bomb, 2 is money
  changeLives = false;
  extraLife = false;
  changeLivesCounter = 0;
  dayCounter = 0;

  frameRate(NORMAL_FRAME_RATE);
  image(bgImg0, 0, 0);
  image(bgImg1, x1, PLACES_HEIGHT);
  image(bgImg2, SCENE_WIDTH, 0);
  randomDoor = random(door);
  updateScore(0);
  updateLives();
  updatePlaces(0);
  dayGrab = get(150, 100, 400, 200); // get the part of the doors that will be replaced with DAY x
}

function changeLivesSequence() {
  fill(0);
  frameRate(3);
  if (! extraLife) { // If extraLife is false then the lose life sequence is started
    if (changeLivesCounter / 2 == floor(changeLivesCounter / 2)) {
      rect(740 + (lives - 1) * 27, 245, 27, 58);
    } else {
      image(cowboy_small, 740 + (lives - 1) * 27, 245);
    }
    changeLivesCounter++;
    if (changeLivesCounter == 13) {
      lives--;
      if (lives == 0) {
        newDay = true;
        gameOver = true;
      } else {
        startNewLife();
      }
    }
  } else { // If extraLife is true then the gain life sequence is started
    if (changeLivesCounter / 2 == floor(changeLivesCounter / 2)) {
      image(cowboy_small, 740 + (lives) * 27, 245);
    } else {
      rect(740 + (lives) * 27, 245, 27, 58);
    }
    changeLivesCounter++;
    if (changeLivesCounter == 9) {
      lives++;
      changeLivesCounter = 0;
      extraLife = false;
      changeLives = false;
    }
  }
}

function gameOverFunc() {
  noLoop();
  image(game_over, 110, 150);
  game_over_theme.play();
  new_entry = [nickname, score];
  newEntryPos = newEntryPosition(new_entry[1]);
  updateEntries();
  if (newEntryPos < 99) {
    list_new = [entries.join()];
    //saveStrings(list_new, "boring_data_file.txt");
    sendEmail();
  }
}

function counters() {
  closingCounter--;
  c = floor(closingCounter / NORMAL_FRAME_RATE);
  if (c < previousCounter) {
    previousCounter = c;
    fill(0);
    rect(750,35, 130, 35);
    fill(255, 236, 153);
    textFont(algerian);
    textSize(30);
    let str = floor(c / 60) + ":" + (c - floor(c / 60) * 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});
    text(str, 760, 61);
    textFont(rioGrande);
    if (c <= 0) {
      changeLives = true;
      closingCounter = STARTING_CLOSING_COUNTER;
      previousCounter = closingCounter;
    }
  }
  for (i = 0; i < 3; i++) {
    if (openedDoor[i]) {
      counter[i]++;
      if (visitor[i] == 3 && counter[i] > OUTLAW1_LIMIT) {
          gunshot_outlaw.play();
          image(bang, -80 + 240 * i, 50);
          //counter[i] = 0;
          changeLives = true;
      } else if (visitor[i] == 4 && counter[i] > OUTLAW3_LIMIT) {
        gunshot_outlaw.play();
        image(bang, -90 + 240 * i, 70);
        //image(bang,  10 + 240 * i, 65); // bang for the second gun
        changeLives = true;
      } else if (visitor[i] > 9 && counter[i] > OUTLAW2_LIMIT) {
        gunshot_outlaw.play();
        image(bang, -25 + 240 * i, 40);
        changeLives = true;
      }
    }
  }
}

function openDoor(d, fr) {
  image(visitorsImg[visitor[d]], 43+d*240, 86, 136, 232, [dx=0], [dy=0], [dWidth=136], [dHeight=232]);
  image(doorSpriteSheet,[sx=d*SCENE_WIDTH/3 + 26],[sy=PLACES_HEIGHT-1],[sWidth=188],[sHeight=272],[dx=fr*185],[dy=0],[dWidth=185],[dHeight=268]);
}

function updateScore(sc) {
  score += sc;
  noStroke();
  fill(0);
  //rect(735, 125, 150, 50);
  rect(SCENE_WIDTH, 125, SCORE_WIDTH, 50);
  fill(255, 0, 0);
  textFont(rioGrande);
  textSize(45);
  text(score, 735, 165);
  if (score >= extraLifeInterval) {
    extraLifeInterval += EXTRA_LIFE_SCORE;
    if (lives < 5) {
      extraLife = true;
      changeLives = true;
      yee_haw.play();
    }
  }
}

function updateLives() {
  for (i = 0; i < lives; i++) {
    image(cowboy_small, 740 + i * 27, 245);
  }
}

function updateDeposits(dr) {
  dollars[places[dr]] = true;
  image(dollar_small, 57 + places[dr] * 53, 34);
}

function updateDepositsAll() {
  for (i = 0; i < 12; i++) {
    if (dollars[i]) {
      image(dollar_small, 57 + i * 53, 34);
    }
  }
}

function checkDeposits() {
  if (! openedDoor[0] && ! openedDoor[1] && ! openedDoor[2]) {
    if (! doorIsOpening[0] && ! doorIsOpening[1] && ! doorIsOpening[2]) {
      let dollarCount = 0;
      for (i = 0; i < 12; i++) {
        if (dollars[i]) {
          dollarCount++;
        }
      }
      if (dollarCount == 12) {
        updateScore(1000);
        day++;
        newDay = true;
      }
    }
  }
}

function updatePlaces(pl) {
  for (i = 0; i < 3; i++) {
    if (places[i] + pl > 11) {
      places[i] += pl - 12;
    } else if (places[i] + pl < 0) {
      places[i] += pl + 12;
    } else {
      places[i] += pl;
    }
  }
  image(bgImg0, 0, 0);
  updateDepositsAll();
  fill(220, 0, 0);
  noStroke();
  for (i = 0; i < 3; i++) {
    rect(43 + places[i] * 53, 0, 53, 26);
  }
  image(numbers, 0, 0);
}

function closeDoor(d, fr) {
  if (visitor[d] == 3) { // It's outlaw 1
    if (fr < OUTLAW_FRAMES) {
      if (fr == 1) {
        updateScore(100);
      }
      image(outlaw1_dead_SpriteSheet,[sx=43+d*240],[sy=86],[sWidth=136],[sHeight=232],[dx=fr*136],[dy=0],[dWidth=136],[dHeight=232]);
      image(smoke_SpriteSheet,[sx=mouseXClick - (smoke_SpriteSheet.width / SMOKE_FRAMES) / 2],[sy=mouseYClick - smoke_SpriteSheet.height / 2],[sWidth=36],[sHeight=36],[dx=fr*36],[dy=0],[dWidth=36],[dHeight=36]);
    } else {
      image(doorSpriteSheet,[sx=d*SCENE_WIDTH/3 + 26],[sy=PLACES_HEIGHT-1],[sWidth=188],[sHeight=272],[dx=(DOOR_FRAMES + OUTLAW_FRAMES - 1 - fr)*185],[dy=0],[dWidth=185],[dHeight=268]);
    }
  } else if (visitor[d] == 4) { // It's outlaw 3
    if (fr < OUTLAW_FRAMES) {
      if (fr == 1) {
        updateScore(200);
      }
      image(outlaw3_dead_SpriteSheet,[sx=43+d*240],[sy=86],[sWidth=136],[sHeight=232],[dx=fr*136],[dy=0],[dWidth=136],[dHeight=232]);
      image(smoke_SpriteSheet,[sx=mouseXClick - (smoke_SpriteSheet.width / SMOKE_FRAMES) / 2],[sy=mouseYClick - smoke_SpriteSheet.height / 2],[sWidth=36],[sHeight=36],[dx=fr*36],[dy=0],[dWidth=36],[dHeight=36]);
    } else {
      image(doorSpriteSheet,[sx=d*SCENE_WIDTH/3 + 26],[sy=PLACES_HEIGHT-1],[sWidth=188],[sHeight=272],[dx=(DOOR_FRAMES + OUTLAW_FRAMES - 1 - fr)*185],[dy=0],[dWidth=185],[dHeight=268]);
    }
  } else if (visitor[d] > 9) { // It's outlaw 2 through 7 drawing a gun
    if (fr < OUTLAW_FRAMES) {
      if (fr == 1) {
        if (visitor[d] != 11) {
          updateScore(200);
        } else { // It's outlaw 4
          updateScore(250);
        }
      }
      if (visitor[d] == 10) {
        image(outlaw2_dead_SpriteSheet,[sx=43+d*240],[sy=86],[sWidth=136],[sHeight=232],[dx=fr*136],[dy=0],[dWidth=136],[dHeight=232]);
      } else if (visitor[d] == 11) {
        image(outlaw4_dead_SpriteSheet,[sx=43+d*240],[sy=86],[sWidth=136],[sHeight=232],[dx=fr*136],[dy=0],[dWidth=136],[dHeight=232]);
      } else if (visitor[d] == 12) {
        image(outlaw5_dead_SpriteSheet,[sx=43+d*240],[sy=86],[sWidth=136],[sHeight=232],[dx=fr*136],[dy=0],[dWidth=136],[dHeight=232]);
      } else if (visitor[d] == 13) {
        image(outlaw6_dead_SpriteSheet,[sx=43+d*240],[sy=86],[sWidth=136],[sHeight=232],[dx=fr*136],[dy=0],[dWidth=136],[dHeight=232]);
      } else if (visitor[d] == 14) {
        image(outlaw7_dead_SpriteSheet,[sx=43+d*240],[sy=86],[sWidth=136],[sHeight=232],[dx=fr*136],[dy=0],[dWidth=136],[dHeight=232]);
      }
      image(smoke_SpriteSheet,[sx=mouseXClick - (smoke_SpriteSheet.width / SMOKE_FRAMES) / 2],[sy=mouseYClick - smoke_SpriteSheet.height / 2],[sWidth=36],[sHeight=36],[dx=fr*36],[dy=0],[dWidth=36],[dHeight=36]);
    } else {
      image(doorSpriteSheet,[sx=d*SCENE_WIDTH/3 + 26],[sy=PLACES_HEIGHT-1],[sWidth=188],[sHeight=272],[dx=(DOOR_FRAMES + OUTLAW_FRAMES - 1 - fr)*185],[dy=0],[dWidth=185],[dHeight=268]);
    }
  } else if (visitor[d] > 4 && visitor[d] < 10 && counter[d] < OUTLAW2_LIMIT) { // An outlaw was shot before he draws
    if (fr < 3) { // To show the image while the smoke clears
      image(dont_shoot, 43+d*240, 86, 136, 232);
      changeLives = true;
    }
  } else if (visitor[d] > 4 && visitor[d] < 10 && counter[d] > OUTLAW2_LIMIT) { // An outlaw is about to draw his gun
    if (visitor[d] != 6 || (visitor[d] == 6 && outlaw4Random[d] < 0.5)) { // If it's not the outlaw with the money or it is the outlaw with the money but he is going to draw a gun
      counter[d] = 0; // The counter of this door is reset
      visitor[d] = visitor[d] + 5; // The outlaw changes to the image of himself drawing a gun
      frameClose[d] = -1; // In the next check it will be 0 so the gunfire will be heared
      image(visitorsImg[visitor[d]], 43+d*240, 86, 136, 232, [dx=0], [dy=0], [dWidth=136], [dHeight=232]);
    } else if (visitor[d] == 6  && counter[d] > CITIZEN_LIMIT) { // It's the outlaw with the money who is about to deposit
      if (fr == 1) {
        money.play();
        updateScore(50);
        updateDeposits(d);
      }
      if (fr < DOLLAR_FRAMES) {
        image(dollar_SpriteSheet,[sx=79+d*240],[sy=340],[sWidth=82],[sHeight=50],[dx=fr*82],[dy=0],[dWidth=82],[dHeight=50]);
      } else {
        image(doorSpriteSheet,[sx=d*SCENE_WIDTH/3 + 26],[sy=PLACES_HEIGHT-1],[sWidth=188],[sHeight=272],[dx=(DOOR_FRAMES + OUTLAW_FRAMES - 1 - fr)*185],[dy=0],[dWidth=185],[dHeight=268]);
      }
    }
  } else if (visitor[d] < 2 && counter[d] < CITIZEN_LIMIT) { // A citizen was shot
    if (fr < SMOKE_FRAMES + 5) { // To show the image while the smoke clears
      if (visitor[d] == 0) { // The sir was shot
        image(citizen_sir_handsup_shoot, 41+d*240, 84);
      } else { // The lady was shot
        image(citizen_lady_handsup_shoot, 41+d*240, 84);
      }
      image(smoke_SpriteSheet,[sx=mouseXClick - (smoke_SpriteSheet.width / SMOKE_FRAMES) / 2],[sy=mouseYClick - smoke_SpriteSheet.height / 2],[sWidth=36],[sHeight=36],[dx=fr*36],[dy=0],[dWidth=36],[dHeight=36]);
    } else {
      changeLives = true;
    }
  } else if (visitor[d] < 2 && counter[d] > CITIZEN_LIMIT) { // A citizen is about to deposit money or raise hands
    if (handsUpRandom[d] > HANDSUP_FREQUENCY) { // A citizen is depositing money
      if (fr == 1) {
        money.play();
        updateScore(50);
        updateDeposits(d);
      }
      if (fr < DOLLAR_FRAMES) {
        image(dollar_SpriteSheet,[sx=79+d*240],[sy=340],[sWidth=82],[sHeight=50],[dx=fr*82],[dy=0],[dWidth=82],[dHeight=50]);
      } else {
        image(doorSpriteSheet,[sx=d*SCENE_WIDTH/3 + 26],[sy=PLACES_HEIGHT-1],[sWidth=188],[sHeight=272],[dx=(DOOR_FRAMES + OUTLAW_FRAMES - 1 - fr)*185],[dy=0],[dWidth=185],[dHeight=268]);
      }
    } else { // A citizen is raising hands
      if (fr < HANDSUP_FRAMES) {
        if (visitor[d] == 1) { // The lady is raising hands
          if (fr == 1) {
            scream.play();
          }
          image(citizen_lady_handsup_SpriteSheet,[sx=43+d*240],[sy=86],[sWidth=136],[sHeight=232],[dx=fr*136],[dy=0],[dWidth=136],[dHeight=232]);
        } else { // The sir is raising hands
          if (fr == 1) {
            hey.play();
          }
          image(citizen_sir_handsup_SpriteSheet,[sx=43+d*240],[sy=86],[sWidth=136],[sHeight=232],[dx=fr*136],[dy=0],[dWidth=136],[dHeight=232]);
        }
      } else {
        counter[d] = 0; // The counter of this door is reset
        visitor[d] = 3; // The visitor of this door is turned to the outlaw1
        frameClose[d] = -1; // In the next check it will be 0 so the gunfire will be heared
        image(visitorsImg[visitor[d]], 43+d*240, 86, 136, 232, [dx=0], [dy=0], [dWidth=136], [dHeight=232]);
      }
    }
  } else if (visitor[d] == 2 && counter[d] < KID_LIMIT) { // The kid was shot
    if (kidFrame[d] < 7) {
      image(visitorsImg[visitor[d]], 43+d*240, 86, 136, 232, [dx=kidFrame[d]*136], [dy=0], [dWidth=136], [dHeight=232]);
      if (fr == 1) {
        updateScore(10);
      }
    } else {
      if (kidRandom[d] < 0.5) {
        image(kid_bomb, 43+d*240, 86, 136, 232);
        kidStatus[d] = 1; // The kid carries a bomb
      } else {
        kidStatus[d] = 2; // The kid carries the money
        if (canShootMoney[d]) {
          image(kid_money, 43+d*240, 86, 136, 232);
          updateScore(300);
          canShootMoney[d] = false;
        }
      }
      if (kidFrame[d] == 8) {
        if (kidStatus[d] == 1) { // The bomb is exploding
          if (d == 0) { // If it is the first door move the boom slightly to the right
            image(boom, -50, 50);
          } else {
            image(boom, -80 + 240 * d, 50);
          }
          boom_sound.play();
          changeLives = true;
        } else { // kidStatus[d] == 2 and the money is countered
          if (fr == 1) {
            image(kid_nohat, 43+d*240, 86, 136, 232);
            money.play();
            updateScore(50);
            updateDeposits(d);
          }
          frameRate(DELAYED_FRAME_RATE); // Dollar and door frames were moving too fast
          closingCounter -= NORMAL_FRAME_RATE / DELAYED_FRAME_RATE - 1;
          image(dollar_SpriteSheet,[sx=79+d*240],[sy=340],[sWidth=82],[sHeight=50],[dx=fr*82],[dy=0],[dWidth=82],[dHeight=50]);
        }
      }
    }
  } else if (visitor[d] == 2 && counter[d] > KID_LIMIT) { // Time to close the kid's door
    image(doorSpriteSheet,[sx=d*SCENE_WIDTH/3 + 26],[sy=PLACES_HEIGHT-1],[sWidth=188],[sHeight=272],[dx=(DOOR_FRAMES - 1 - fr)*185],[dy=0],[dWidth=185],[dHeight=268]);
  }
}

function openDoors() {
  if (! scrolling) { // doors can't be opened during scrolling
    randomDoor = random(door);
    if (! openedDoor[randomDoor]) { // if the selected door is closed
      if (random(1) < openDoorFrequency) {
        if (! doorIsOpening[randomDoor]) {
          v = random(visitors);
          visitor[randomDoor] = v;
          if (v == 2) { // If it is a new kid behind the door
            kidRandom[randomDoor] = random(1);
            canShootMoney[randomDoor] = true;
          } else if (v < 2) { // If it is a citizen behind the door
            handsUpRandom[randomDoor] = random(1);
          } else if (v == 6) { // If it is a new outlaw with money behind the door
            outlaw4Random[randomDoor] = random(1);
          }
        }
        doorIsOpening[randomDoor] = true; // this door will be opened next
        canScroll = false; // If a door is opening the player cannot scroll
      }
    }
    for (i = 0; i < 3; i++) {
      if (doorIsOpening[i]) { // if the specific door is not fully opened yet
        frameRate(DELAYED_FRAME_RATE);
        closingCounter -= NORMAL_FRAME_RATE / DELAYED_FRAME_RATE - 1;
        openDoor(i, frameOpen[i]);
        frameOpen[i]++;
        if (frameOpen[i] == DOOR_FRAMES) {
          frameOpen[i] = 0;
          doorIsOpening[i] = false; // this door is no longer opening
          openedDoor[i] = true; // this door is fully opened
          frameRate(NORMAL_FRAME_RATE);
        }
      }
    }
  }
}

function checkShooting() {
  frameRate(NORMAL_FRAME_RATE); // To have more frequent checking
  for (i = 0; i < 3; i++) {
    if (doorClicked[i] && !((visitor[i] < 2 || visitor[i] == 6) && counter[i] > CITIZEN_LIMIT)) { // The second term is for letting the door close after shooting outlaw 4 while the door is closing
      if (! scrolling && openedDoor[i]) {
        if (frameClose[i] == 0) {
          gunshot_hero.play();
        }
        if (visitor[i] != 2) { // For everybody else except the kid
          counter[i] = 0;
          frameRate(DELAYED_FRAME_RATE);
          closingCounter -= NORMAL_FRAME_RATE / DELAYED_FRAME_RATE - 1;
        }
        if (!(counter[i] > KID_LIMIT && visitor[i] == 2)) { // The door is closing after shooting an outlaw (if it's not the kid or it's not the time to close the kid's door)
          frameClose[i]++;
          closeDoor(i, frameClose[i]); // Updates the hats also
          if ((visitor[i] != 2 && frameClose[i] == DOOR_FRAMES + OUTLAW_FRAMES) || (visitor[i] == 2 && frameClose[i] >= DOOR_FRAMES)) {
            doorClicked[i] = false;
            frameClose[i] = 0;
            frameRate(NORMAL_FRAME_RATE);
            if (visitor[i] != 2) {
              openedDoor[i] = false;
              visitor[i] = 9;
            } else {
              kidFrame[i]++;
            }
          }
        }
      }
    } else if (counter[i] > CITIZEN_LIMIT && (visitor[i] < 2 || visitor[i] == 6)) { // The door is closing after depositing money
      frameRate(DELAYED_FRAME_RATE);
      closingCounter -= NORMAL_FRAME_RATE / DELAYED_FRAME_RATE - 1;
      doorClicked[i] = false;
      closeDoor(i, frameClose[i]);
      frameClose[i]++;
      if (frameClose[i] == DOOR_FRAMES + OUTLAW_FRAMES) {
        frameClose[i] = 0;
        openedDoor[i] = false;
        frameRate(NORMAL_FRAME_RATE);
        visitor[i] = 9;
        counter[i] = 0;
      }
    } else if (counter[i] > OUTLAW2_LIMIT && visitor[i] > 4 && visitor[i] < 10) { // An outlaw is drawing
      if (visitor[i] != 6) { // If it's not the outlaw with the money
        closeDoor(i, frameClose[i]);
      } else { // It's the outlaw with the money
        closeDoor(i, frameClose[i]);
      }
    }

    if (counter[i] > KID_LIMIT && visitor[i] == 2) { // Time to close kid's door
      frameRate(DELAYED_FRAME_RATE);
      closingCounter -= NORMAL_FRAME_RATE / DELAYED_FRAME_RATE - 1;
      doorClicked[i] = false;
      closeDoor(i, frameClose[i]);
      frameClose[i]++;
      if (frameClose[i] >= DOOR_FRAMES) {
        frameRate(NORMAL_FRAME_RATE);
        doorClicked[i] = false;
        frameClose[i] = 0;
        openedDoor[i] = false;
        visitor[i] = 9;
        counter[i] = 0;
        kidFrame[i] = 1;
        kidStatus[i] = 0;
      }
    }
  }
}

function checkDrag() {
  if (canScroll) {
    if (mouseXDrag < -10) { // drag left
      frameRate(NORMAL_FRAME_RATE);
      doorClicked = [false, false, false];
      scrolling = true;
      openedDoor = [false, false, false];
      image(bgImg1, x1, PLACES_HEIGHT);
      image(bgImg1, x2, PLACES_HEIGHT);
      image(bgImg2, SCENE_WIDTH, 0);
      updateScore(0);
      updateLives();
      if (mouseXDrag < -SCENE_WIDTH / 3) { // Three doors drag left
        if (x2 > 1) { // continue dragging
          x1 -= scrollSpeed;
          x2 -= scrollSpeed;
          if (x2 < SCENE_WIDTH * 1/3) { // close to end of dragging
            scrollSpeed -= 0.2;
          }
        } else { // stop dragging
          mouseXDrag = 0;
          x1 = 0;
          x2 = SCENE_WIDTH;
          scrolling = false;
          scrollSpeed = 10;
          canScroll = false;
          updatePlaces(3);
        }
      } else { // One door drag left
        if (x2 > SCENE_WIDTH * 2/3 + 1) { // continue dragging
          x1 -= scrollSpeed;
          x2 -= scrollSpeed;
          scrollSpeed -= 0.2;
        } else { // stop dragging
          mouseXDrag = 0;
          x1 = 0;
          x2 = SCENE_WIDTH;
          scrolling = false;
          scrollSpeed = 10;
          canScroll = false;
          updatePlaces(1);
        }
      }
    } else if (mouseXDrag > 10) { // drag right
      frameRate(NORMAL_FRAME_RATE);
      doorClicked = [false, false, false];
      scrolling = true;
      openedDoor = [false, false, false];
      frameRate(NORMAL_FRAME_RATE);
      image(bgImg1, x0, PLACES_HEIGHT);
      image(bgImg1, x1, PLACES_HEIGHT);
      image(bgImg2, SCENE_WIDTH, 0);
      updateScore(0);
      updateLives();
      if (mouseXDrag > SCENE_WIDTH / 3) { // Three doors drag right
        if (x0 < 0) { // continue dragging
          x1 += scrollSpeed;
          x0 += scrollSpeed;
          if (x0 > -SCENE_WIDTH * 1/3) { // close to end of dragging
            scrollSpeed -= 0.2;
          }
        } else { // stop dragging
          mouseXDrag = 0;
          x1 = 0;
          x0 = -SCENE_WIDTH;
          scrolling = false;
          scrollSpeed = 10;
          canScroll = false;
          updatePlaces(-3);
        }
      } else { // One door drag right
        if (x0 < -SCENE_WIDTH * 2/3) { // continue dragging
          x1 += scrollSpeed;
          x0 += scrollSpeed;
          scrollSpeed -= 0.2;
        } else { // stop dragging
          mouseXDrag = 0;
          x1 = 0;
          x0 = -SCENE_WIDTH;
          scrolling = false;
          scrollSpeed = 10;
          canScroll = false;
          updatePlaces(-1);
        }
      }
    }
  }

  if (mouseUnclicked && mouseXDrag > -40 && mouseXDrag < 40) { // No drag just a click
    if (mouseYClick > 86 && mouseYClick < 317) {
      if (mouseXClick > 42 && mouseXClick < 177) {
        if (openedDoor[0]) {
          doorClicked[0] = true;
        }
      } else if (mouseXClick > 282 && mouseXClick < 417) {
        if (openedDoor[1]) {
          doorClicked[1] = true;
        }
      } else if (mouseXClick > 522 && mouseXClick < 657) {
        if (openedDoor[2]) {
          doorClicked[2] = true;
        }
      }
    }
  }
  mouseUnclicked = false;
}

function menuItemPressed(itemTitle, itemText) {
  strokeWeight(5);
  stroke(59, 77, 79);
  fill(150, 197, 204);
  rect(20, 20, 680, 350);
  textFont(kristen);
  textSize(32);
  fill(237, 255, 240);
  text(itemTitle, 50, 60);
  textSize(20);
  textLeading(30);
  fill(0);
  strokeWeight(1);
  text(itemText, 50, 75, 640, 340);
}

function mousePressed() {
  if (! menuScreen) { // In game mouse control
    if (gameOver) {
      mainMenu();
    } else if (mouseY > 330 && mouseX > 730 && running) { // Pause was pressed
      noLoop();
      //print("paused");
      running = false;
      image(pause_sign, SCENE_WIDTH, 235);
      b = get(0, PLACES_HEIGHT, SCENE_WIDTH, 272);
      image(paused, 0, PLACES_HEIGHT);
    } else if (mouseY > 330 && mouseX > 730 && ! running) { // Resume was pressed
      loop();
      //print("resumed");
      running = true;
      image(bgImg2, SCENE_WIDTH, 0);
      image(b, 0, PLACES_HEIGHT);
      updateScore(0);
      updateLives();
    } else if (mouseY > 261 && mouseY < 308 && mouseX > 730 && ! running) { // Quit was pressed
      //print("quit");
      mainMenu();
    }
  } else { // Menu screen mouse control
    if (mouseY > 312 && mouseX > 733) { // Start game
      //menu_music.stop();
      loop();
      //print("start game");
      menuScreen = false;
      running = true;
      startNewLife();
    } else if (mouseY > 46 && mouseY < 106 && mouseX > 733) { // How to play
      if (menuItemHow) {
        menuItemHow = false;
        menuItemControls = true;
        menuItemAbout = true;
        menuItemPressed(HOW_TO_PLAY_TITLE, HOW_TO_PLAY_TEXT);
      } else {
        image(menu, 0, 0);
        showHiScores();
        menuItemHow = true;
      }
    } else if (mouseY > 135 && mouseY < 195 && mouseX > 733) { // Controls
      if (menuItemControls) {
        menuItemHow = true;
        menuItemControls = false;
        menuItemAbout = true;
        menuItemPressed(CONTROLS_TITLE, CONTROLS_TEXT);
      } else {
        image(menu, 0, 0);
        showHiScores();
        menuItemControls = true;
      }
    } else if (mouseY > 224 && mouseY < 285 && mouseX > 733) { // About game
      if (menuItemAbout) {
        menuItemHow = true;
        menuItemControls = true;
        menuItemAbout = false;
        menuItemPressed(ABOUT_GAME_TITLE, ABOUT_GAME_TEXT);
      } else {
        image(menu, 0, 0);
        showHiScores();
        menuItemAbout = true;
      }
    }
  }

  if  (! scrolling) {
    mouseXPressed = mouseX;
    mouseYPressed = mouseY;
  }
  if (startScript) {
    return false; // prevent default behavior of the browser
  }
}

function mouseReleased() {
  if (running) { // So that it can't scroll and can't shoot while paused
    if  (! scrolling) {
      if (! openedDoor[0] && ! openedDoor[1] && ! openedDoor[2] && ! doorIsOpening[0] && ! doorIsOpening[1] && ! doorIsOpening[2]) { // if all doors are closed and are not opening
        canScroll = true;
      }
      mouseXDrag = mouseX - mouseXPressed;
      mouseXClick = mouseX;
      mouseYClick = mouseY;
      mouseUnclicked = true;
    }
    return false; // prevent default behavior of the browser
  }
}

document.ontouchmove = function(event) {
    event.preventDefault();
};
