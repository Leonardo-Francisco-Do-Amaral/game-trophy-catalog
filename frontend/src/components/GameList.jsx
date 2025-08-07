import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, Link, Rating } from '@mui/material'; // Importa Rating
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // Ícone para tempo de jogo
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech'; // Ícone para troféu

function GameList({ games }) {
  if (!games || games.length === 0) {
    return (
      <Typography variant="h6" color="textSecondary" align="center" sx={{ mt: 4 }}>
        Nenhum jogo encontrado no seu catálogo.
      </Typography>
    );
  }

  const columns = [
    // Colunas Principais do Jogo
    { field: 'colocacao', headerName: 'Colocação', width: 100, type: 'number',
      renderCell: (params) => (
        <Link component="button" variant="body2" sx={{color: 'secondary.main'}} onClick={() => alert(`Detalhes da Colocação ${params.value} do jogo ${params.row.nome}`)}>
          {params.value}
        </Link>
      )
    },
    { field: 'nome', headerName: 'Nome do Jogo', width: 250, editable: true },
    { field: 'desenvolvedora', headerName: 'Desenvolvedora', width: 180 },
    { field: 'publicadora', headerName: 'Publicadora', width: 180 },
    { field: 'ano_lancamento', headerName: 'Lançamento', type: 'number', width: 120 },
    { field: 'genero', headerName: 'Gênero', width: 200 },
    { field: 'plataforma', headerName: 'Plataforma', width: 120 },
    { field: 'idioma', headerName: 'Idioma', width: 120 },


    // Colunas de Tempo de Jogo
    {
      field: 'tempo_jogado',
      headerName: 'Tempo Jogado',
      width: 150,
      renderCell: (params) => {
        const horas = params.row.tempo_jogado_horas;
        const minutos = params.row.tempo_jogado_minutos;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="body2">
              {horas ? `${horas}h` : ''} {minutos ? `${minutos}m` : ''}
            </Typography>
          </Box>
        );
      },
    },

    // Colunas de Notas
    // Para 'nota_gameplay', 'nota_historia', 'nota_trilha_sonora'
{ field: 'nota_gameplay', headerName: 'Gameplay', type: 'number', width: 110, align: 'center', headerAlign: 'center',
  renderCell: (params) => (
    <Tooltip title={`Nota Gameplay: ${params.value || 0}/10`}>
      {/* Divide a nota por 2 para mapear 0-10 para 0-5 estrelas */}
      <Rating name="gameplay-rating" value={(params.value || 0) / 2} max={5} readOnly size="small" precision={0.5} />
    </Tooltip>
  ),
},
// Repita para 'nota_historia' e 'nota_trilha_sonora'
{ field: 'nota_historia', headerName: 'História', type: 'number', width: 110, align: 'center', headerAlign: 'center',
  renderCell: (params) => (
    <Tooltip title={`Nota História: ${params.value || 0}/10`}>
      <Rating name="historia-rating" value={(params.value || 0) / 2} max={5} readOnly size="small" precision={0.5} />
    </Tooltip>
  ),
},
{ field: 'nota_trilha_sonora', headerName: 'Trilha Sonora', type: 'number', width: 120, align: 'center', headerAlign: 'center',
  renderCell: (params) => (
    <Tooltip title={`Nota Trilha Sonora: ${params.value || 0}/10`}>
      <Rating name="trilha-sonora-rating" value={(params.value || 0) / 2} max={5} readOnly size="small" precision={0.5} />
    </Tooltip>
  ),
},
    { field: 'nota_total', headerName: 'Total', type: 'number', width: 90 },

    // Colunas de Troféus
    { field: 'platinado', headerName: 'Platinado', width: 100, type: 'boolean',
      renderCell: (params) => {
        return params.value ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />;
      },
    },
    { field: 'trofeus_totais', headerName: 'Totais', type: 'number', width: 100,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <MilitaryTechIcon fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    { field: 'trofeus_obtidos', headerName: 'Obtidos', type: 'number', width: 100 },
    { field: 'trofeus_restantes', headerName: 'Restantes', type: 'number', width: 110 },
   { field: 'trofeu_mais_dificil_percentual', headerName: '% Mais Difícil', type: 'number', width: 130, align: 'center', headerAlign: 'center',
  valueFormatter: (params) => params.value ? `${params.value}%` : '-',
},

    { field: 'status_online', headerName: 'Online', width: 150 },
    { field: 'completude_jogo', headerName: 'Completude', width: 180 },
    { field: 'dificuldade_platina', headerName: 'Dificuldade Platina', width: 160 },

    // Colunas de Datas de Troféus
    { field: 'data_primeiro_trofeu', headerName: '1º Troféu', type: 'date', width: 120,
      valueFormatter: (params) => {
        if (!params.value) return '';
        const date = new Date(params.value);
        return date.toLocaleDateString('pt-BR'); // Formata a data para dd/mm/yyyy
      }
    },
    { field: 'data_ultimo_trofeu', headerName: 'Último Troféu', type: 'date', width: 120,
      valueFormatter: (params) => {
        if (!params.value) return '';
        const date = new Date(params.value);
        return date.toLocaleDateString('pt-BR'); // Formata a data para dd/mm/yyyy
      }
    },
    { field: 'dias_para_platina', headerName: 'Dias p/ Platina', type: 'number', width: 140 },
    { field: 'tipo_jogo', headerName: 'Tipo de Jogo', width: 120 },
  ];
  

  const rows = games.map(game => ({
    ...game,
    // Garantindo que 'id' seja string ou number (DataGrid exige isso)
    id: game.id,
    // Convertendo as strings de data para objetos Date para o DataGrid lidar como tipo 'date'
    data_primeiro_trofeu: game.data_primeiro_trofeu ? new Date(game.data_primeiro_trofeu) : null,
    data_ultimo_trofeu: game.data_ultimo_trofeu ? new Date(game.data_ultimo_trofeu) : null,
  }));

  return (
    <Box sx={{ height: 650, width: '100%', mt: 4, bgcolor: 'background.paper', borderRadius: 2, overflow: 'hidden' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10, 25, 50, 100]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
          sorting: {
            sortModel: [{ field: 'colocacao', sort: 'asc' }],
          },
        }}
        disableRowSelectionOnClick
        // Estilos para o tema escuro
        sx={{
          '& .MuiDataGrid-root': {
            border: 'none', // Remove borda padrão do DataGrid
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'primary.dark',
            color: 'primary.contrastText',
            fontWeight: 'bold',
            fontSize: '0.95rem',
            borderBottom: 'none', // Remove borda inferior dos cabeçalhos
          },
          '& .MuiDataGrid-cell': {
            borderColor: theme => theme.palette.divider, // Cor da borda das células
            color: 'text.primary', // Cor do texto das células
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          },
          '& .MuiDataGrid-footerContainer': {
            backgroundColor: 'background.paper', // Fundo do rodapé da paginação
            color: 'text.secondary',
            borderTop: 'none', // Remove borda superior do rodapé
          },
          '& .MuiTablePagination-root': {
            color: 'text.secondary',
          },
          '& .MuiSvgIcon-root': {
            color: 'text.secondary',
          },
          '& .MuiInputBase-root': {
            color: 'text.secondary',
          },
          '& .MuiDataGrid-virtualScrollerContent': {
            '& .MuiDataGrid-row': {
              // Adiciona um separador visual entre as linhas
              '&:not(:last-child)': {
                borderBottom: `1px solid ${theme => theme.palette.divider}`,
              },
            },
          },
        }}
      />
    </Box>
  );
}

export default GameList;