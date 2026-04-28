import { useNavigate } from 'react-router-dom';
import { useGame } from '../state/GameContext';

export default function ResultPage() {
  const navigate = useNavigate();
  const { lastResult, totalScore, resetGame } = useGame();

  return (
    <section className="card">
      <h1 className="title">結果</h1>
      {lastResult ? (
        <>
          <p className="description">正解エリア: {lastResult.questionName}</p>
          <p className="description">距離: {lastResult.distanceKm.toFixed(1)} km</p>
          <p className="description">獲得: {lastResult.gainedScore} / 合計: {totalScore}</p>
        </>
      ) : (
        <p className="description">結果データがありません。先にゲームを開始してください。</p>
      )}
      <div className="button-row">
        <button type="button" className="start-button" onClick={() => navigate('/game')}>
          次のラウンドへ
        </button>
        <button
          type="button"
          className="sub-button"
          onClick={() => {
            resetGame();
            navigate('/');
          }}
        >
          ホームへ戻る（リセット）
        </button>
      </div>
    </section>
  );
}
