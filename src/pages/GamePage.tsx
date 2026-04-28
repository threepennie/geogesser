import { useNavigate } from 'react-router-dom';
import { useGame } from '../state/GameContext';

export default function GamePage() {
  const navigate = useNavigate();
  const { round, totalScore, currentQuestion, startRound, submitGuess } = useGame();

  const handleSubmit = () => {
    const dummyGuess = { lat: 35.6804, lng: 139.7690 };
    const result = submitGuess(dummyGuess);
    if (result) navigate('/result');
  };

  return (
    <section className="card">
      <h1 className="title">ゲーム画面（仮）</h1>
      <p className="description">ラウンド: {round} / 合計スコア: {totalScore}</p>
      {currentQuestion ? (
        <p className="description">問題: 次の場所を推測してください（ダミー）: {currentQuestion.name}</p>
      ) : (
        <p className="description">まだラウンドが始まっていません。</p>
      )}
      <div className="button-row">
        <button type="button" className="start-button" onClick={startRound}>
          ラウンド開始
        </button>
        <button type="button" className="start-button" onClick={handleSubmit}>
          回答する（ダミー）
        </button>
        <button type="button" className="sub-button" onClick={() => navigate('/')}>
          ホームに戻る
        </button>
      </div>
    </section>
  );
}
