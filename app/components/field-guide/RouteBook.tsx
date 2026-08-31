import { fieldGuideCatalog } from "../../content/field-guide/catalog.ts";
import type { GeneratedRoute } from "../../lib/field-guide/route-engine.ts";

type RouteBookProps = {
  route: GeneratedRoute;
};

export function RouteBook({ route }: RouteBookProps) {
  const platform = fieldGuideCatalog.platforms.find(
    (option) => option.id === route.profile.platform,
  );
  const provider = fieldGuideCatalog.providers.find(
    (option) => option.id === route.profile.provider,
  );

  return (
    <section className="manual-route" aria-labelledby="manual-route-title">
      <header className="manual-route__header">
        <div>
          <p className="manual-kicker">
            {platform?.label} · {provider?.label}
          </p>
          <h1 id="manual-route-title">准备好你的工作环境</h1>
          <p>从设备准备开始，沿着四个成果完成第一次可靠交付。</p>
        </div>
        <strong className="manual-route__time">{route.totalMinutes} 分钟</strong>
      </header>

      <ol className="manual-volume-list" aria-label="个性化学习路线">
        {route.volumes.map((volume, index) => (
          <li className="manual-volume" key={volume.id}>
            <span className="manual-volume__number">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h2>{volume.title}</h2>
              <p>{volume.outcome}</p>
            </div>
            <span>{volume.estimatedMinutes} 分钟</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
