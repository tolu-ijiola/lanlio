import React from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Plus, X, Check } from "lucide-react";
import { ComponentData } from "@/lib/editor-state";

interface PricingFeature {
  text: string;
}

interface PricingPlan {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: PricingFeature[];
  buttonText: string;
  buttonLink: string;
  popular?: boolean;
}

interface PricingComponentData {
  id: string;
  type: 'pricing';
  plans: PricingPlan[];
}

interface PricingProps {
  data: PricingComponentData;
  isPreviewMode: boolean;
  onUpdate: (data: ComponentData) => void;
}

function Pricing({ data, isPreviewMode, onUpdate }: PricingProps) {
  const [newPlan, setNewPlan] = React.useState<PricingPlan>({
    name: '',
    price: '',
    period: '/month',
    description: '',
    features: [],
    buttonText: 'Get Started',
    buttonLink: '#',
    popular: false,
  });

  const handleAddPlan = () => {
    if (newPlan.name.trim() && newPlan.price.trim()) {
      onUpdate({
        ...data,
        plans: [...data.plans, { ...newPlan }],
      });
      setNewPlan({
        name: '',
        price: '',
        period: '/month',
        description: '',
        features: [],
        buttonText: 'Get Started',
        buttonLink: '#',
        popular: false,
      });
    }
  };

  const handleRemovePlan = (index: number) => {
    const newPlans = data.plans.filter((_, i) => i !== index);
    onUpdate({ ...data, plans: newPlans });
  };

  const handleUpdatePlan = (index: number, field: keyof PricingPlan, value: any) => {
    const newPlans = [...data.plans];
    newPlans[index] = { ...newPlans[index], [field]: value };
    onUpdate({ ...data, plans: newPlans });
  };

  const handleAddFeature = (planIndex: number) => {
    const newPlans = [...data.plans];
    newPlans[planIndex].features = [...newPlans[planIndex].features, { text: '' }];
    onUpdate({ ...data, plans: newPlans });
  };

  const handleUpdateFeature = (planIndex: number, featureIndex: number, text: string) => {
    const newPlans = [...data.plans];
    newPlans[planIndex].features[featureIndex].text = text;
    onUpdate({ ...data, plans: newPlans });
  };

  const handleRemoveFeature = (planIndex: number, featureIndex: number) => {
    const newPlans = [...data.plans];
    newPlans[planIndex].features = newPlans[planIndex].features.filter((_, i) => i !== featureIndex);
    onUpdate({ ...data, plans: newPlans });
  };

  if (isPreviewMode) {
    if (data.plans.length === 0) return null;
    
    const styles = (data as any).styles || {};
    const gap = (data as any).gap || '24px';
    const titleColor = styles.color || 'var(--palette-title)';
    const priceColor = styles.priceColor || 'var(--palette-primary)';
    const buttonColor = styles.buttonColor || 'var(--palette-primary)';
    const buttonTextColor = styles.buttonTextColor || '#ffffff';
    const backgroundColor = styles.backgroundColor || '#ffffff';
    const borderColor = styles.borderColor || '#e5e7eb';
    const borderRadius = styles.borderRadius || '12px';
    const borderWidth = styles.borderWidth || '1px';
    const padding = styles.padding || '32px';
    const boxShadow = styles.boxShadow;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap }}>
        {data.plans.map((plan, index) => (
          <div
            key={index}
            className="relative transition-all duration-300 hover:shadow-lg"
            style={{ 
              borderRadius: borderRadius,
              backgroundColor: backgroundColor,
              borderColor: plan.popular ? buttonColor : borderColor,
              borderWidth: borderWidth,
              borderStyle: 'solid',
              padding: padding,
              boxShadow: boxShadow || (plan.popular ? '0 4px 12px rgba(0,0,0,0.08)' : undefined),
            }}
          >
            {plan.popular && (
              <div 
                className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: buttonColor,
                  color: buttonTextColor,
                }}
              >
                Popular
              </div>
            )}
            <div className="space-y-4">
              <div>
                <h3 
                  className="text-xl font-bold mb-1"
                  style={{ color: titleColor }}
                >
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1.5">
                  <span 
                    className="text-3xl font-bold"
                    style={{ color: priceColor }}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span 
                      className="text-xs"
                      style={{ color: 'var(--palette-description)' }}
                    >
                      {plan.period}
                    </span>
                  )}
                </div>
              </div>
              
              {plan.features.length > 0 && (
                <ul className="space-y-2">
                  {plan.features.map((feature, fIndex) => (
                    feature.text && (
                      <li key={fIndex} className="flex items-start gap-2">
                        <Check 
                          className="h-4 w-4 flex-shrink-0 mt-0.5"
                          style={{ color: priceColor }}
                        />
                        <span 
                          className="text-sm leading-relaxed"
                          style={{ color: 'var(--palette-description)' }}
                        >
                          {feature.text}
                        </span>
                      </li>
                    )
                  ))}
                </ul>
              )}

              <Button
                className="w-full mt-4"
                style={{
                  backgroundColor: buttonColor,
                  color: buttonTextColor,
                  borderRadius: borderRadius,
                }}
                asChild
              >
                <a href={plan.buttonLink || '#'}>{plan.buttonText || 'Get Started'}</a>
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Canvas mode - show clean content only
  if (data.plans.length === 0) return null;
  
  const styles = (data as any).styles || {};
  const gap = (data as any).gap || '24px';
  const titleColor = styles.color || 'var(--palette-title)';
  const priceColor = styles.priceColor || 'var(--palette-primary)';
  const buttonColor = styles.buttonColor || 'var(--palette-primary)';
  const buttonTextColor = styles.buttonTextColor || '#ffffff';
  const popularColor = styles.popularColor || buttonColor;
  const backgroundColor = styles.backgroundColor || '#ffffff';
  const borderColor = styles.borderColor || '#e5e7eb';
  const borderRadius = styles.borderRadius || '12px';
  const borderWidth = styles.borderWidth || '1px';
  const padding = styles.padding || '32px';
  const boxShadow = styles.boxShadow;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap }}>
      {data.plans.map((plan, index) => (
        <div
          key={index}
          className="relative transition-all duration-300 hover:shadow-lg"
          style={{ 
            borderRadius: borderRadius,
            backgroundColor: backgroundColor,
            borderColor: plan.popular ? popularColor : borderColor,
            borderWidth: borderWidth,
            borderStyle: 'solid',
            padding: padding,
            boxShadow: boxShadow || (plan.popular ? '0 4px 12px rgba(0,0,0,0.08)' : undefined),
          }}
        >
          {plan.popular && (
            <div 
              className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: popularColor,
                color: buttonTextColor,
              }}
            >
              Popular
            </div>
          )}
          <div className="space-y-4">
            <div>
              <h3 
                className="text-xl font-bold mb-1"
                style={{ color: titleColor }}
              >
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1.5">
                <span 
                  className="text-3xl font-bold"
                  style={{ color: priceColor }}
                >
                  {plan.price}
                </span>
                {plan.period && (
                  <span 
                    className="text-xs"
                    style={{ color: 'var(--palette-description)' }}
                  >
                    {plan.period}
                  </span>
                )}
              </div>
            </div>
            
            {plan.features.length > 0 && (
              <ul className="space-y-2">
                {plan.features.map((feature, fIndex) => (
                  feature.text && (
                    <li key={fIndex} className="flex items-start gap-2">
                      <Check 
                        className="h-4 w-4 flex-shrink-0 mt-0.5"
                        style={{ color: priceColor }}
                      />
                      <span 
                        className="text-sm leading-relaxed"
                        style={{ color: 'var(--palette-description)' }}
                      >
                        {feature.text}
                      </span>
                    </li>
                  )
                ))}
              </ul>
            )}

            <Button
              className="w-full mt-4"
              style={{
                backgroundColor: buttonColor,
                color: buttonTextColor,
                borderRadius: borderRadius,
              }}
              asChild
            >
              <a href={plan.buttonLink || '#'}>{plan.buttonText || 'Get Started'}</a>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Pricing;

