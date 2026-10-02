// 1. OpenWeather API 키 설정
const API_KEY = 'your_key_here';

// 2. 5대 도시 영문 검색 이름 설정
const CITIES = {
  seoul: { name: '서울 (Seoul)', query: 'Seoul' },
  busan: { name: '부산 (Busan)', query: 'Busan' },
  daegu: { name: '대구 (Daegu)', query: 'Daegu' },
  incheon: { name: '인천 (Incheon)', query: 'Incheon' },
  gwangju: { name: '광주 (Gwangju)', query: 'Gwangju' }
};

const logBox = document.getElementById('logBox');
const resultCard = document.getElementById('resultCard');
const cityNameEl = document.getElementById('cityName');
const cityTempEl = document.getElementById('cityTemp');
const cityExtraEl = document.getElementById('cityExtra');

function log(msg) {
  const time = new Date().toLocaleTimeString();
  logBox.textContent += `\n[${time}] ${msg}`;
  logBox.scrollTop = logBox.scrollHeight;
}

function clearLog() {
  logBox.textContent = '> 콘솔이 초기화되었습니다.';
}

// 3. 버튼 클릭 이벤트 (fetch와 .then() 사용)
document.getElementById('btnFetch').addEventListener('click', () => {
  const cityKey = document.getElementById('citySelect').value;
  const target = CITIES[cityKey];

  // OpenWeather 날씨 API 요청 주소 (섭씨온도: units=metric, 한글: lang=kr)
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${target.query}&appid=${API_KEY}&units=metric&lang=kr`;

  log(`1. fetch() 주문서 발송: ${target.name}`);
  resultCard.classList.add('d-none');

  // 핵심: fetch와 .then 체인
  fetch(url)
    .then((response) => {
      log(`2. 서버 응답 도착 (HTTP 상태 코드: ${response.status})`);
      if (!response.ok) {
        throw new Error(`HTTP 에러 발생: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      log(`3. 번역 완료! 기온: ${data.main.temp}℃ / 상태: ${data.weather[0].description}`);

      // 화면에 표시
      cityNameEl.textContent = target.name;
      cityTempEl.textContent = `${data.main.temp} ℃`;
      cityExtraEl.textContent = `날씨: ${data.weather[0].description} | 습도: ${data.main.humidity}% | 풍속: ${data.wind.speed} m/s`;
      resultCard.classList.remove('d-none');
    })
    .catch((error) => {
      log(`❌ 에러 발생: ${error.message}`);
      alert(`날씨 정보를 가져오지 못했습니다: ${error.message}`);
    })
    .finally(() => {
      log('4. fetch 요청 사이클 완료');
    });
});
