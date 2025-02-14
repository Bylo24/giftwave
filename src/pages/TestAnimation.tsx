
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";

const TestAnimation = () => {
  return (
    <PageContainer>
      <PageHeader title="Animation Test" />
      <div className="p-4" data-testid="animation-container">
        {/* Card Container */}
        <div className="w-[300px] h-[500px] perspective-[1000px] mx-auto mt-[100px]">
          {/* Inner part of the card */}
          <div className="w-full h-full transform-style-3d transition-transform duration-1000 group hover:rotate-y-180">
            {/* Front of the Card */}
            <div className="absolute w-full h-full backface-hidden bg-gray-100 flex justify-center items-center text-2xl font-bold text-gray-700 text-center">
              <h3>Your Personalized Gift</h3>
            </div>
            
            {/* Back of the Card */}
            <div className="absolute w-full h-full backface-hidden bg-yellow-300 flex flex-col justify-center items-center text-3xl font-bold text-gray-700 rotate-y-180">
              <p>Amount: $100</p>
              <p className="text-xl mt-4">Thank you for your purchase!</p>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default TestAnimation;
