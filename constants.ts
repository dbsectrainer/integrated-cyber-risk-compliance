import { View } from './types';
import { Shield, LayoutDashboard, GanttChart, Presentation, Scale, CheckCircle, ClipboardList, Network } from 'lucide-react';

export const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', view: View.Dashboard },
  { icon: CheckCircle, label: 'Verifier', view: View.Verifier },
  { icon: ClipboardList, label: 'CMMC Tracker', view: View.Cmmc },
  { icon: Network, label: 'Integrations', view: View.Integrations },
  { icon: Shield, label: 'Governance', view: View.Governance },
  { icon: Scale, label: 'Risk Register', view: View.RiskRegister },
  { icon: GanttChart, label: 'Project Plan', view: View.ProjectPlan },
  { icon: Presentation, label: 'Executive Deck', view: View.Presentation },
];
