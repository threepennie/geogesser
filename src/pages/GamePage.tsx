import type { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../state/GameContext';

const MIN_LAT = -85;
const MAX_LAT = 85;
const MIN_LNG = -180;
const MAX_LNG = 180;

function toLatLngFromClick(clientX: number, clientY: number, rect: DOMRect) {
  const xRatio = (clientX - rect.left) / rect.width;
  const yRatio = (clientY - rect.top) / rect.height;
  const lat = MAX_LAT - yRatio * (MAX_LAT - MIN_LAT);
  const lng = MIN_LNG + xRatio * (MAX_LNG - MIN_LNG);
  return { lat, lng };
}

export default function GamePage() {
  const navigate = useNavigate();
  const {
    round,
    totalRounds,
    totalScore,
    timer,
    status,
    currentQuestion,
    currentGuess,
    isGuestAuthenticated,
    startRound,
    updateGuess,
    submitGuess
  } = useGame();

  const handleMapClick = (event: MouseEvent<HTMLDivElement>) => {
    if (status !== 'playing') return;
    const rect = event.currentTarget.getBoundingClientRect();
    updateGuess(toLatLngFromClick(event.clientX, event.clientY, rect));
  };

  const handleSubmit = () => {
    const result = submitGuess();
    if (result) navigate('/result');
  };

  return (
    <section className="card">
      <h1 className="title">ゲーム画面</h1>
      <p className="description">
        ラウンド: {round}/{totalRounds} | 合計スコア: {totalScore} | 制限時間: {timer}秒
      </p>
      <p className="description">認証: {isGuestAuthenticated ? 'ゲストログイン済み' : '未ログイン'}</p>

      {status === 'idle' && (
        <button type="button" className="start-button" onClick={startRound}>
          第1ラウンド開始
        </button>
      )}

      {currentQuestion && (
        <>
          <p className="description">
            問題ID: {currentQuestion.id} / 国: {currentQuestion.country} / 難易度: {currentQuestion.difficulty}
          </p>
          <div className="map-placeholder" onClick={handleMapClick} role="button" tabIndex={0}>
            <span>地図をクリックして推測地点を置いてください</span>
          </div>
          <p className="description">
            推測地点:{' '}
            {currentGuess ? `${currentGuess.lat.toFixed(4)}, ${currentGuess.lng.toFixed(4)}` : '未選択'}
          </p>
          <div className="button-row">
            <button type="button" className="start-button" onClick={handleSubmit} disabled={!currentGuess}>
              回答を確定
            </button>
            <button type="button" className="sub-button" onClick={() => navigate('/')}>
              ホームに戻る
            </button>
          </div>
        </>
      )}
    </section>
  );
}
