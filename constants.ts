import { View } from './types';
import { Shield, LayoutDashboard, GanttChart, Presentation, Scale, CheckCircle } from 'lucide-react';

export const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', view: View.Dashboard },
  { icon: CheckCircle, label: 'Verifier', view: View.Verifier },
  { icon: Shield, label: 'Governance', view: View.Governance },
  { icon: Scale, label: 'Risk Register', view: View.RiskRegister },
  { icon: GanttChart, label: 'Project Plan', view: View.ProjectPlan },
  { icon: Presentation, label: 'Executive Deck', view: View.Presentation },
];
