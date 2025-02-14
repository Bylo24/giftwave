
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";

const TestAnimation = () => {
  return (
    <PageContainer>
      <PageHeader title="Animation Test" />
      <div className="p-4" data-testid="animation-container">
      </div>
    </PageContainer>
  );
};

export default TestAnimation;
