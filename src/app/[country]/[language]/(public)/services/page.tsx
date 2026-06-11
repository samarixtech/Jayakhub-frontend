import Services from "@/components/modules/public-website/services/ServicePage";
import { getPublicPlansAction } from "@/app/actions/public/plans";

export default async function ServicesPage() {
  const result = await getPublicPlansAction();
  const plans = (result.success ? result.data ?? [] : []).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div>
      <Services plans={plans} />
    </div>
  );
}
