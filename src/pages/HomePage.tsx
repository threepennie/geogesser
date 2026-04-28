import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <section className="card">
      <h1 className="title">GeoGuessr Evolution Prototype</h1>
      <p className="description">
        GeoGuessr風Webアプリの拡張版を開発するための初期土台です。最小構成で、段階的に機能追加します。
      </p>
      <button type="button" className="start-button" onClick={() => navigate('/game')}>
        ゲームを始める
      </button>
    </section>
  );
}
