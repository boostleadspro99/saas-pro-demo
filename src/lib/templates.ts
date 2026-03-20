import { supabase } from './supabase';
import { MessageTemplate } from '../types';

const mockTemplates: MessageTemplate[] = [
  {
    id: '1',
    name: 'Relance Lead Non Répondu',
    type: 'whatsapp',
    content: 'Bonjour {{name}}, nous avons bien reçu votre demande de consultation. Êtes-vous toujours intéressé(e) ? Nous restons à votre disposition pour planifier un rendez-vous.'
  },
  {
    id: '2',
    name: 'Relance Lead Non Répondu',
    type: 'email',
    subject: 'Votre demande de consultation',
    content: 'Bonjour {{name}},\n\nNous avons bien reçu votre demande de consultation mais n\'avons pas réussi à vous joindre.\n\nÊtes-vous toujours intéressé(e) ? Vous pouvez nous répondre directement à cet email ou nous appeler pour planifier un rendez-vous.\n\nCordialement,\nL\'équipe du cabinet'
  },
  {
    id: '3',
    name: 'Relance No-Show',
    type: 'whatsapp',
    content: 'Bonjour {{name}}, nous avons remarqué votre absence à votre rendez-vous d\'aujourd\'hui. Souhaitez-vous le reprogrammer ?'
  },
  {
    id: '4',
    name: 'Relance No-Show',
    type: 'email',
    subject: 'Rendez-vous manqué',
    content: 'Bonjour {{name}},\n\nNous avons remarqué votre absence à votre rendez-vous d\'aujourd\'hui.\n\nSouhaitez-vous le reprogrammer ? N\'hésitez pas à nous contacter pour fixer une nouvelle date.\n\nCordialement,\nL\'équipe du cabinet'
  },
  {
    id: '5',
    name: 'Relance Plan Non Accepté',
    type: 'whatsapp',
    content: 'Bonjour {{name}}, avez-vous pu consulter le plan de traitement que nous vous avons proposé ? Nous restons à votre disposition pour toute question.'
  },
  {
    id: '6',
    name: 'Relance Plan Non Accepté',
    type: 'email',
    subject: 'Votre plan de traitement',
    content: 'Bonjour {{name}},\n\nAvez-vous pu consulter le plan de traitement que nous vous avons proposé lors de votre dernière visite ?\n\nNous restons à votre entière disposition si vous avez des questions ou si vous souhaitez en discuter.\n\nCordialement,\nL\'équipe du cabinet'
  }
];

export const getMessageTemplates = async (): Promise<MessageTemplate[]> => {
  try {
    const { data, error } = await supabase
      .from('message_templates')
      .select('*');
      
    if (error) throw error;
    return data as MessageTemplate[];
  } catch (err) {
    return mockTemplates;
  }
};
