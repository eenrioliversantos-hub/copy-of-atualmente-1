import { useNotificationStore } from '../hooks/useNotificationStore';
import { NotificationType } from '../types';

const create = (type: NotificationType, context: any) => {
    const { addNotification } = useNotificationStore.getState();

    switch (type) {
        case NotificationType.PROPOSAL_SENT:
            addNotification({
                type,
                message: `Uma nova proposta "${context.proposalTitle}" foi enviada para sua aprovação.`,
                icon: 'file-text',
                cta: {
                    label: 'Ver Proposta',
                    view: 'proposal_detail',
                    context: { proposalId: context.proposalId },
                },
            });
            break;
        case NotificationType.PROPOSAL_APPROVED:
             addNotification({
                type,
                message: `Parabéns! A proposta "${context.proposalTitle}" foi aprovada por ${context.clientName}.`,
                icon: 'checkCircle',
                cta: {
                    label: 'Ver Projeto',
                    view: 'project_detail',
                    context: { projectId: context.projectId }, // Assuming projectId is passed
                },
            });
            break;
        case NotificationType.VALIDATION_REQUESTED:
            addNotification({
                type,
                message: `A fase "${context.phaseName}" do projeto "${context.projectName}" está pronta para sua validação.`,
                icon: 'share',
                cta: {
                    label: 'Revisar Agora',
                    view: 'validation_detail',
                    context: { projectId: context.projectId, validationId: context.validationId },
                },
            });
            break;
        case NotificationType.VALIDATION_APPROVED:
             addNotification({
                type,
                message: `A fase "${context.phaseName}" do projeto "${context.projectName}" foi aprovada pelo cliente.`,
                icon: 'checkCircle',
                cta: {
                    label: 'Ver Projeto',
                    view: 'project_detail',
                    context: { projectId: context.projectId },
                },
            });
            break;
        case NotificationType.ASSET_SUBMITTED:
             addNotification({
                type,
                message: `O cliente enviou o ativo "${context.assetLabel}" para o projeto "${context.projectName}".`,
                icon: 'upload',
                cta: {
                    label: 'Ver Ativos',
                    view: 'project_detail', // Or a specific tab
                    context: { projectId: context.projectId },
                },
            });
            break;
        case NotificationType.CONTRACT_SIGNED:
            addNotification({
                type,
                message: `O contrato "${context.contractTitle}" foi assinado por ${context.clientName}.`,
                icon: 'pen-tool',
                cta: {
                    label: 'Ver Contrato',
                    view: 'operator_contract_detail',
                    context: { contractId: context.contractId },
                },
            });
            break;
        case NotificationType.INVOICE_GENERATED:
            addNotification({
                type,
                message: `Uma nova fatura foi gerada para o projeto "${context.projectName}".`,
                icon: 'dollar-sign',
                cta: {
                    label: 'Ver Fatura',
                    view: 'invoice_detail',
                    context: { invoiceId: context.invoiceId },
                },
            });
            break;
        case NotificationType.DELIVERY_READY_FOR_APPROVAL:
            addNotification({
                type,
                message: `A entrega final para o projeto "${context.projectName}" está pronta para sua revisão.`,
                icon: 'package',
                cta: {
                    label: 'Revisar Entrega',
                    view: 'client_project_detail',
                    context: { projectId: context.projectId },
                },
            });
            break;
        // Add other cases here
    }
};

export const notificationService = {
    create,
};