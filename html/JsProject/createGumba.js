

/**
 * 적1 생성 및 캐릭터, 적, 공격 상호작용
 *
 * 이 함수의 구조는
 * 1. 적 객체 생성
 * 2. 적 이동 (setInterval을 사용해 계속 실행)
 *  2. 1. 적 아군 상호작용 (무사히 상호작용 완료시 인터벌 종료)
 *  2. 2. 적 공격 상호작용
 *  3. 인터벌 숫자를 점수에 따라 조절(이동속도)
 * 4. 함수 재귀. setTimeout을 사용하여 일정 시간 후에 재귀하며 '일정시간'은 점수에 따라 달라짐
 *
 **/
function createEnemy(currentPosition, AttackCnt, isMarioTrample) {
  // 적 객체 생성
  const enemy = document.createElement("div");
  enemy.innerHTML = `<img src="https://static.wikia.nocookie.net/stabyourself/images/7/71/Anigoomba.gif/revision/latest/thumbnail/width/360/height/360?cb=20150107031425"
                alt="">`;
  enemy.classList.add("enemy");
  enemy.style.width = "30px";
  enemy.style.height = "30px";
  enemy.style.position = "absolute";
  enemy.style.left = "670px";
  enemyHeight = Math.floor(GROUND_HEIGHT);
  enemy.style.bottom = +enemyHeight + "px";
  document.getElementById("container").appendChild(enemy); // 적 속성 불러오기

  // 적 이동
  let moveLeftInterval = setInterval(
    function () {
      let enemyLeft = parseInt(
        window.getComputedStyle(enemy).getPropertyValue("left")
      );
      let enemyBottom = parseInt(
        window.getComputedStyle(enemy).getPropertyValue("bottom")
      );
      let pointBox = document.getElementById("point");

      // 히트박스 정의
      let characterHitboxTop = enemyBottom - currentPosition;
      let enemyHitboxTop = currentPosition - enemyBottom;

      // 캐릭터, 적 상호작용부 =========================================================
      // 적이 끝까지 가면 적 삭제하고 점수 up
      if (enemyLeft <= 0) {
        enemy.remove();
        clearInterval(moveLeftInterval);
        point += 100;
        pointBox.innerText = "점수 : " + point;
      } else if (
        enemyLeft > 30 &&
        enemyLeft <= 60 &&
        characterHitboxTop <= 50 &&
        enemyHitboxTop <= 25
      ) {
        // 캐릭터, 적 충돌 감지
        // 히트박스 좌측 좌표 // 히트박스 오른쪽 좌표 // 캐릭터 히트박스 상단(숫자) // 적 히트박스 상단(숫자)
        if (isMarioTrample === true) {
          enemy.remove();
          clearInterval(moveLeftInterval);
          point += 200;
          pointBox.innerText = "점수 : " + point;
          showtrampleEffect(enemyHeight);
        } else {
          isGameOver = true;
          clearInterval(moveLeftInterval);
          gameOver();
          return;
        }
      } else {
        // 적 이동
        if (isGameOver === false) {
          enemy.style.left = enemyLeft - 5 + "px";
        }
      }

      // 공격, 적 상호작용부
      if (AttackCnt > 0) {
        // 화면에 공격이 존재할때
        let attackList = document.getElementsByClassName("attack");
        let attackLeft = parseInt(
          window.getComputedStyle(attackList[0]).getPropertyValue("left")
        );

        if (enemyLeft < attackLeft + 50) {
          showExplosionEffect(attackLeft);
          enemy.remove();
          attackList[0].remove();
          AttackCnt--; // 적과 충돌시 공격도 사라진다.
        }
      }

      // 이동속도 생성
    },
    point < 1000
      ? 20 + Math.floor(Math.random() * 5)
      : point < 2500
      ? 15 + Math.floor(Math.random() * 5)
      : point < 4000
      ? 10 + Math.floor(Math.random() * 10)
      : 7 + Math.floor(Math.random() * 8)
  ); // 랜덤한 간격으로 이동

  // 재귀함수지만 별개의 스레드를 사용하기 때문에 실행스택이 쌓이지 않는다. (새로 실행된 함수의 실행여부와 상관없이 함수가 끝난다.)
  if (isGameOver === false) {
    // 생성간격
    if (point < 1000) {
      setTimeout(createEnemy, 500 + Math.floor(Math.random() * 2500));
    } else if (point < 2500) {
      setTimeout(createEnemy, 500 + Math.floor(Math.random() * 1500));
      container.style.animation = "slide 4s linear infinite";
      filter.style.backgroundColor = "rgba(0, 0, 0, 0.226)";
    } else if (point < 4000) {
      setTimeout(createEnemy, 500 + Math.floor(Math.random() * 500));
      filter.style.backgroundColor = "rgba(255, 0, 0, 0.356)";
      container.style.animation = "slide 2s linear infinite";
    } else {
      setTimeout(createEnemy, 300 + Math.floor(Math.random() * 500));
      filter.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
      container.style.animation = "slide 1.5s linear infinite";
    }
  }
}
