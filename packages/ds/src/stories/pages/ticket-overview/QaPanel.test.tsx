import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { QaPanel } from './QaPanel';
import { useTicketOverviewState } from './useTicketOverviewState';
import { ticket } from './shared';
import { stubStacked } from '../../../test-helpers';

afterEach(() => {
  vi.unstubAllGlobals();
});

function Harness() {
  const s = useTicketOverviewState();
  return (
    <QaPanel
      environments={ticket.qa.environments}
      activeEnvironment={s.activeEnvironment}
      onEnvironmentChange={s.setActiveEnvironment}
      envSelector={s.envSelector}
      scenarios={s.qaScenarios}
      onUpdateScenario={s.updateScenario}
      expandedScenarioId={s.expandedScenarioId}
      onToggleScenario={s.toggleScenario}
      statusSelectScenarioId={s.statusSelectScenarioId}
      onStatusSelectOpenChange={s.setStatusSelectOpen}
      editingSectionsById={s.editingSectionsById}
      onEditingSectionsChange={s.setScenarioEditingSections}
      onOpenEvidence={s.openEvidencePreview}
      pendingStatusChange={s.pendingStatusChange}
      statusPromptOpen={s.statusPromptOpen}
      statusDraft={s.statusDraft}
      onStatusDraftChange={s.setStatusDraft}
      onRequestScenarioStatus={s.requestScenarioStatus}
      onConfirmStatusChange={s.confirmStatusChange}
      onCancelStatusChange={s.cancelStatusChange}
    />
  );
}

describe('QaPanel — status prompt presentation', () => {
  it('draws the waive prompt as a centred dialog on a wide viewport', async () => {
    render(<Harness />);
    await userEvent.click(
      screen.getAllByRole('button', { name: /expand scenario/i })[0],
    );
    await userEvent.click(screen.getByRole('button', { name: 'Waive' }));

    expect(
      screen.getByRole('dialog', { name: 'Waive scenario' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Close' }),
    ).not.toBeInTheDocument();
  });

  it('draws the waive prompt as a sheet once stacked', async () => {
    stubStacked();
    render(<Harness />);
    await userEvent.click(
      screen.getAllByRole('button', { name: 'Set scenario status' })[0],
    );
    await userEvent.click(screen.getByRole('option', { name: /Waived/ }));

    const prompt = screen.getByRole('dialog', { name: 'Waive scenario' });
    expect(prompt).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });
});
