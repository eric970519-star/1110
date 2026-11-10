// 宣告全域變數用來儲存精靈圖（Sprite Sheet）圖片物件
let stopSpriteSheet;

// 宣告陣列用來儲存切割好的每一格動畫畫格（Frame）
let stopFrames = [];

// 宣告變數記錄目前播放的動畫畫格索引（從第 0 格開始）
let currentFrame = 0;

// 宣告變數控制動畫播放速度（每隔幾影格切換一次圖片）
let frameInterval = 6;

// 宣告計數器用來計算經過的影格數
let frameCounter = 0;

// 宣告變數記錄圖片狀態：0 = 載入中, 1 = 載入成功, 2 = 載入失敗
let loadStatus = 0; 

// 宣告變數用來儲存背景的 RGB 顏色數值（初始設定為天空色）
let bgColorR = 135;
let bgColorG = 206;
let bgColorB = 235;

// 預載入函數，在程式執行前優先載入圖片資源
function preload() {
  // 載入角色1的 10 張連續停止動作精靈圖檔案（已將副檔名改為 .jpg）
  stopSpriteSheet = loadImage(
    '1/stop/stop.jpg',
    // 成功載入的回呼函數
    () => {
      console.log("精靈圖載入成功！");
      setupFrames();
      loadStatus = 1; // 標記載入成功
    },
    // 載入失敗的回呼函數
    (err) => {
      console.error("精靈圖載入失敗，請檢查路徑 '1/stop/stop.jpg'：", err);
      loadStatus = 2; // 標記載入失敗
    }
  );
}

// 切割精靈圖的函數
function setupFrames() {
  let totalFrames = 10;
  let spriteWidth = stopSpriteSheet.width / totalFrames;
  let spriteHeight = stopSpriteSheet.height;

  // 使用迴圈依序切割精靈圖中的每一張圖片並存入陣列中
  for (let i = 0; i < totalFrames; i++) {
    let x = i * spriteWidth;
    let imgFrame = stopSpriteSheet.get(x, 0, spriteWidth, spriteHeight);
    stopFrames.push(imgFrame);
  }
}

// 設定函數，在程式啟動時執行一次，用於初始化畫布
function setup() {
  // 建立一個剛好填滿整個瀏覽器視窗大小的全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  
  // 設定圖片繪製時的基準點為「左上角」
  imageMode(CORNER);
}

// 繪製函數，每秒執行多次，負責持續更新畫面
function draw() {
  // 將畫布背景填滿指定的背景顏色
  background(bgColorR, bgColorG, bgColorB);

  // 如果圖片仍在載入中
  if (loadStatus === 0) {
    fill(0);
    textSize(22);
    textAlign(CENTER, CENTER);
    text("圖片載入中...", width / 2, height / 2);
    return;
  }

  // 如果圖片載入失敗（顯示錯誤提示，方便你確認問題）
  if (loadStatus === 2) {
    fill(255, 0, 0);
    textSize(20);
    textAlign(CENTER, CENTER);
    text("圖片載入失敗！請確認專案中是否有 '1/stop/stop.jpg' 檔案", width / 2, height / 2 - 20);
    textSize(16);
    fill(0);
    text("提示：請透過 VS Code Live Server 執行，並檢查 F12 主控台錯誤", width / 2, height / 2 + 20);
    return;
  }

  // --- 以下為圖片載入成功後的正常動畫繪製邏輯 ---

  // 計算角色在畫布 x 軸的 2/3 位置
  let posX = width * (2 / 3);
  
  // 取得單張畫格的原始寬度與高度
  let frameW = stopFrames[0].width;
  let frameH = stopFrames[0].height;
  
  // 設定角色在畫面上顯示的高度（設定為 300 像素）
  let renderHeight = 300; 
  let renderWidth = (frameW / frameH) * renderHeight; // 依比例計算對應寬度

  // 計算角色 y 座標，讓角色的最底端剛好落在畫布的最底端
  let posY = height - renderHeight;

  // 將目前要顯示的動畫畫格繪製在畫布指定位置上
  image(stopFrames[currentFrame], posX - renderWidth / 2, posY, renderWidth, renderHeight);

  // 累積影格計數器
  frameCounter++;

  // 當計數器達到設定的間隔時，切換到下一張畫格
  if (frameCounter >= frameInterval) {
    currentFrame = (currentFrame + 1) % stopFrames.length;
    frameCounter = 0;
  }

  // 在畫面左上角顯示操作提示文字
  noStroke();
  fill(0, 180);
  textSize(16);
  text("提示：點擊畫面任意處可隨機變更背景顏色測試互動！", 30, 40);
}

// 當滑鼠被點擊時自動觸發的函數（用於測試互動）
function mousePressed() {
  bgColorR = random(50, 220);
  bgColorG = random(50, 220);
  bgColorB = random(50, 220);
}

// 當瀏覽器視窗大小改變時自動觸發，保持畫布為全螢幕
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}