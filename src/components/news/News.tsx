import { FC } from "react";
import { DashboardLayout } from "../layout/DashboardLayout";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button } from "@mui/material";
import { Link } from "react-router-dom";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { PATHS } from "../../constants/path";


const rows = [
  {
    id: '1',
    title: 'Пингвины научились изготавливать СВУ',
    type: 'Срочное',
    date: '13.07.2024',
    status: <CheckCircleOutlineIcon />
  },
  {
    id: '2',
    title: 'В Нигерии был установлен рекорд по метанию бананов',
    type: 'Обычное',
    date: '14.07.2024',
    status: <BorderColorIcon />
  },
  {
    id: '3',
    title: 'Создана организация по защите прав собак в Южной Корее',
    type: 'Обычное',
    date: '04.07.2024',
    status: <CheckCircleOutlineIcon />
  },
  {
    id: '4',
    title: 'От лица Австралии на чемпионат мира по боксу отправят кенгуру',
    type: 'Обычное',
    date: '02.07.2024',
    status: <CheckCircleOutlineIcon />
  },
  {
    id: '5',
    title: 'Миллиарду обезьян всё-таки удалось написать "Войну и мир"',
    type: 'Срочное',
    date: '13.07.2024',
    status: <BorderColorIcon />
  }
];

const NewsTable: FC = () => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Заголовок</TableCell>
            <TableCell>Тип</TableCell>
            <TableCell>Дата и время</TableCell>
            <TableCell>Статус</TableCell>
            <TableCell align="right"></TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
            >
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.title}</TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell align="right" sx={{ maxWidth: 7 }}>
                <Link to={`${PATHS.NEWS}/${row.id}`} style={{ textDecoration: 'none' }}>
                  <Button>
                    <CreateOutlinedIcon />
                  </Button>
                </Link>
              </TableCell>
              <TableCell align="right" sx={{ maxWidth: 7 }}>
                <Button>
                  <DeleteOutlinedIcon sx={{ color: '#C50000' }}/>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export const News: FC = () => {
  return (
    <DashboardLayout>
      <NewsTable />
    </DashboardLayout>
  )
};
