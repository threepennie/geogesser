import { useNavigate } from 'react-router-dom';
import { useGame } from '../state/GameContext';

export default function ResultPage() {
  const navigate = useNavigate();
  const { round, totalRounds, roundResults, totalScore, status, goToNextRound, resetGame } = useGame();
  const lastResult = roundResults[roundResults.length - 1] ?? null;

  return (
    <section className="card">
      <h1 className="title">結果</h1>
      {lastResult ? (
        <>
          <p className="description">問題ID: {lastResult.questionId}</p>
          <p className="description">正解の国: {lastResult.country}</p>
          <p className="description">距離: {lastResult.distanceKm.toFixed(1)} km</p>
          <p className="description">獲得: {lastResult.gainedScore} / 合計: {totalScore}</p>
        </>
      ) : (
        <p className="description">結果データがありません。先にゲームを開始してください。</p>
      )}
      <div className="button-row">
        {status === 'scored' && round < totalRounds ? (
          <button
            type="button"
            className="start-button"
            onClick={() => {
              goToNextRound();
              navigate('/game');
            }}
          >
            次のラウンドへ
          </button>
        ) : (
          <button type="button" className="start-button" onClick={() => navigate('/')}>
            ホームへ
          </button>
        )}
        <button
          type="button"
          className="sub-button"
          onClick={() => {
            resetGame();
            navigate('/');
          }}
        >
          ゲームをリセット
        </button>
      </div>
    </section>
  );
}
