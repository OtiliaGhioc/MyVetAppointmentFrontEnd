import { Button, Typography } from "@mui/material";
import { Container } from "@mui/system";
import * as React from "react";
import { useLocation, useNavigate } from "react-router";
import { API_ROOT, BACKGROUND_COLOR } from "../../env";
import { getDocumentName } from "../../util/DocumentUtil";
import { disconnectUser, getAccessToken, getRefreshToken, makeRequestWithJWT } from "../../util/JWTUtil";
import CreateDrugModal from "./CreateDrugModal";
import CreateDrugStockModal from "./CreateDrugStockModal";
import DrugStocksList from "./DrugStocksList";
import EditDrugStockModal from "./EditDrugStockModal";

const DrugStocksPage = ({ locationChangeCallback }) => {
    const navigate = useNavigate();
    const location = useLocation()

    const [isAllowed, setIsAllowed] = React.useState(false);
    const [drugStocks, setDrugStocks] = React.useState([]);
    const [drugsList, setDrugsList] = React.useState([]);

    const [isEditDrugStockModalOpen, setIsEditDrugStockModalOpen] = React.useState(false);
    const [isCreateDrugModalOpen, setIsCreateDrugModalOpen] = React.useState(false);
    const [isCreateDrugStockModalOpen, setIsCreateDrugStockModalOpen] = React.useState(false);
    const [currentModalDrugStock, setCurrentModalDrugStock] = React.useState({});

    React.useEffect(() => {
        document.title = getDocumentName('Drug Stocks')
    }, [])

    React.useEffect(() => {
        locationChangeCallback(location);
    }, [location]);

    React.useEffect(() => {
        document.body.style.backgroundColor = BACKGROUND_COLOR;

        const fetchData = async () => {
            let res = await makeRequestWithJWT(
                `${API_ROOT}/v1.0/DrugStocks/`, {
                method: 'GET',
                mode: 'cors'
            }, {
                accessToken: getAccessToken(),
                refreshToken: getRefreshToken()
            }
            )

            if (res.status === 401) {
                disconnectUser();
                navigate('/login');
                return;
            }

            if (res.status === 403) {
                setIsAllowed(false);
                return;
            }

            const drugStocksData = await res.json();

            res = await makeRequestWithJWT(
                `${API_ROOT}/v1.0/Drugs/`, {
                method: 'GET',
                mode: 'cors'
            }, {
                accessToken: getAccessToken(),
                refreshToken: getRefreshToken()
            }
            )

            if (res.status === 401) {
                disconnectUser();
                navigate('/login');
                return;
            }

            const drugsListData = await res.json();

            setPageData(drugStocksData, drugsListData);
            setIsAllowed(true);
        }
        fetchData();
    }, [navigate])

    const setPageData = (drugStocksData, drugsListData) => {
        setDrugStocks(drugStocksData);
        setDrugsList(drugsListData);
    }

    const openDrugStockEditModal = (drugStockId, title) => {
        setCurrentModalDrugStock({
            drugStockId,
            title
        });
        setIsEditDrugStockModalOpen(true);
    }

    const handleEditDrugStockModalClose = () => {
        setIsEditDrugStockModalOpen(false);
    }

    const openCreateDrugModal = () => {
        setIsCreateDrugModalOpen(true);
    }

    const handleCreateDrugModalClose = () => {
        setIsCreateDrugModalOpen(false);
    }

    const openCreateDrugStockModal = () => {
        setIsCreateDrugStockModalOpen(true);
    }

    const handleCreateDrugStockModalClose = () => {
        setIsCreateDrugStockModalOpen(false);
    }

    const updateDrugStockState = (drugStockId, supplyQuantity, price) => {
        drugStocks.forEach((elem) => {
            if (elem.drugStockId === drugStockId) {
                elem.quantity += supplyQuantity;
                elem.pricePerItem = price;
            }
        });
        setDrugStocks([...drugStocks]);
    }

    const updateDrugsListState = (drugData) => {
        setDrugsList([...drugsList, {
            id: drugData.id,
            title: drugData.title
        }])
    }

    const updateDrugStocksListState = (drugStockData) => {
        setDrugStocks([...drugStocks, {
            drugStockId: drugStockData.id,
            drugName: drugStockData.type.title,
            quantity: drugStockData.quantity,
            pricePerItem: drugStockData.pricePerItem,
            drugId: drugStockData.typeId
        }])
    }

    return (
        <>
            {isAllowed ?
                <>
                    <Container style={{ width: '100%', padding: '0.5rem 1rem', margin: '0 auto 1.5rem auto', backgroundImage: 'url(/img/dog_paws_pattern.jpg)', backgroundSize: '150%', display: 'flex', flex: 'none', justifyContent: 'space-between' }}>
                        <Button
                            type="button"
                            style={{ width: '14rem', backgroundColor: "#ffffff", color: '#186bc9', fontWeight: '600' }}
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={openCreateDrugModal}
                        >
                            Add drug
                        </Button>
                        <Button
                            type="button"
                            style={{ width: '14rem', backgroundColor: "#ffffff", color: '#186bc9', fontWeight: '600' }}
                            variant="contained"
                            color="secondary"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={openCreateDrugStockModal}
                        >
                            Create drug stock
                        </Button>
                        <CreateDrugModal
                            isOpen={isCreateDrugModalOpen}
                            handleClose={handleCreateDrugModalClose}
                            updateDrugsList={updateDrugsListState} />
                        <CreateDrugStockModal
                            isOpen={isCreateDrugStockModalOpen}
                            handleClose={handleCreateDrugStockModalClose}
                            updateDrugStocksList={updateDrugStocksListState}
                            drugsList={drugsList} />
                    </Container>
                    <DrugStocksList drugStockEntries={drugStocks} supplyDrugCallback={openDrugStockEditModal} />
                    <EditDrugStockModal
                        isOpen={isEditDrugStockModalOpen}
                        handleClose={handleEditDrugStockModalClose}
                        drugStockId={currentModalDrugStock.drugStockId}
                        drugName={currentModalDrugStock.title}
                        updateDrugStockState={updateDrugStockState} />

                </> :
                <>
                    <Container style={{ width: '100%', padding: '1rem', backgroundImage: 'url(/img/dog_paws_pattern.jpg)', backgroundSize: '150%' }}>
                        <Typography variant="h3" component="div" style={{ overflow: 'hidden', padding: '0.5rem', fontWeight: '600', textShadow: '2px 2px 4px black', color: 'white' }} >
                            Access Forbidden
                        </Typography>
                        <Typography variant="h6" component="div" style={{ overflow: 'hidden', padding: '0.5rem', fontWeight: '600', textShadow: '2px 2px 4px black', color: 'white' }} >
                            Only medics can view content on this page.
                        </Typography>
                    </Container>
                </>
            }
        </>
    )
}

export default DrugStocksPage;